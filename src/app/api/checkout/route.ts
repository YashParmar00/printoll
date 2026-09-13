import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { validateCustomer, CheckoutError, type CustomerInput, type PaymentMethod } from "@/lib/checkout";
import { checkoutSnapshot } from "@/lib/checkout-server";
import { validateItems } from "@/lib/checkout-input";
import { createOrder, getOrder, updateOrder, type Order } from "@/lib/orders";
import { createRazorpayOrder, publicKeyId } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { boundedText, privateJson } from "@/lib/private-response";
import { withReceipt } from "@/lib/receipt";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function orderResponse(order: Order) {
  if (order.status === "cancelled") return privateJson({ error: "This order was cancelled. Please contact us before retrying." }, 409);
  if (order.paymentMethod !== "cod" && !order.razorpay?.orderId) return privateJson({ error: `Payment preparation is pending for ${order.orderNumber}. Please contact us if this persists; do not place another order.` }, 409);
  return withReceipt(privateJson({ orderNumber: order.orderNumber, paymentMethod: order.paymentMethod, total: order.total, advancePaid: order.onlineAmount, codDue: order.total - (order.onlineAmount ?? 0), settled: order.paymentStatus === "captured",
    razorpay: order.razorpay?.orderId ? { orderId: order.razorpay.orderId, amount: (order.onlineAmount ?? 0) * 100, keyId: publicKeyId() } : undefined }), order.orderNumber);
}

export async function POST(request: Request) {
  try {
    let body;
    try { body = JSON.parse(await boundedText(request)); } catch { return privateJson({ error: "Invalid request." }, 400); }
    const customerError = validateCustomer(body?.customer);
    if (customerError) return privateJson({ error: customerError }, 400);
    const items = validateItems(body.items);
    const method = body.paymentMethod as PaymentMethod;
    if (!["cod", "advance_cod", "prepaid"].includes(method)) return privateJson({ error: "Invalid payment method." }, 400);
    const key = request.headers.get("idempotency-key");
    if (!key || !/^[a-f0-9-]{36}$/.test(key)) return privateJson({ error: "Missing checkout retry key. Please refresh checkout." }, 400);
    const customer = Object.fromEntries(Object.entries(body.customer as CustomerInput).filter(([key]) => ["name", "phone", "email", "address", "city", "state", "pincode"].includes(key)).map(([key, value]) => [key, value.trim()])) as unknown as CustomerInput;
    const requestHash = createHash("sha256").update(JSON.stringify({ items, customer: [customer.name, customer.phone, customer.email ?? "", customer.address, customer.city, customer.state, customer.pincode], method, expectedTotal: body.expectedTotal })).digest("hex");
    if (!await rateLimit(request.headers, "checkout", 12)) return privateJson({ error: "Please wait before trying again." }, 429);
    const existing = await prisma.order.findUnique({ where: { checkoutKey: key }, select: { orderNumber: true, requestHash: true } });
    if (existing) {
      if (existing.requestHash !== requestHash) return privateJson({ error: "Checkout details changed. Refresh your quote before submitting." }, 409);
      return orderResponse((await getOrder(existing.orderNumber))!);
    }
    const snapshot = await checkoutSnapshot(items);
    if (!snapshot.methods.includes(method)) return privateJson({ error: "This payment method is unavailable. Please refresh checkout." }, 400);
    const totals = snapshot.totals[method];
    if (body.expectedTotal !== totals.total) return privateJson({ error: "Prices changed. Refresh your quote and review the new total.", code: "PRICE_CHANGED" }, 409);
    let order: Order;
    try {
      order = await createOrder({ status: method === "cod" ? "pending" : "awaiting_payment", paymentMethod: method, customer, items: totals.lineItems, subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, total: totals.total, advancePaid: 0, codDue: totals.total, onlineAmount: totals.advancePaid, currency: totals.currency, checkoutKey: key, requestHash });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return privateJson({ error: "Checkout is already processing. Retry with the same details shortly." }, 409);
      throw error;
    }
    if (method !== "cod") {
      // Only the request that inserted the unique checkout key may create a
      // provider order. An uncertain provider response requires reconciliation,
      // never an automatic second provider charge/order.
      try {
        const provider = await createRazorpayOrder(totals.advancePaid * 100, order.orderNumber);
        if (!provider.id || provider.amount !== totals.advancePaid * 100 || provider.currency !== "INR") throw new Error("Unexpected provider order.");
        const updated = await updateOrder(order.orderNumber, { razorpay: { orderId: provider.id } });
        if (!updated) throw new Error("Order persistence failed.");
        order = updated;
      } catch { return privateJson({ error: `Payment preparation needs verification for ${order.orderNumber}. Retry with the same details or contact us.` }, 503); }
    }
    return orderResponse(order);
  } catch (error) {
    return privateJson({ error: error instanceof CheckoutError ? error.message : "Checkout is temporarily unavailable. Retry with the same details." }, error instanceof CheckoutError ? 400 : 503);
  }
}
