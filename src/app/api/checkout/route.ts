import { NextResponse } from "next/server";
import {
  computeTotals,
  validateCustomer,
  CheckoutError,
  type CheckoutLineInput,
  type CustomerInput,
  type PaymentMethod,
} from "@/lib/checkout";
import { createOrder, updateOrder } from "@/lib/orders";
import { isRazorpayConfigured, createRazorpayOrder, publicKeyId } from "@/lib/razorpay";

export const runtime = "nodejs";

interface CheckoutRequestBody {
  items?: CheckoutLineInput[];
  customer?: CustomerInput;
  paymentMethod?: string;
}

export async function POST(req: Request) {
  let body: CheckoutRequestBody;
  try {
    body = (await req.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const paymentMethod: PaymentMethod = body.paymentMethod === "prepaid" ? "prepaid" : "cod";
  const items = body.items ?? [];

  const customerError = validateCustomer(body.customer);
  if (customerError) return NextResponse.json({ error: customerError }, { status: 400 });
  const customer = body.customer as CustomerInput;

  // Server-side price validation — recomputed from the catalogue, client total ignored.
  let totals;
  try {
    totals = computeTotals(items, paymentMethod);
  } catch (e) {
    if (e instanceof CheckoutError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }

  if (paymentMethod === "prepaid" && !isRazorpayConfigured()) {
    return NextResponse.json(
      {
        error: "Online payment isn't enabled yet — please choose Cash on Delivery.",
        code: "RAZORPAY_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  const order = createOrder({
    status: paymentMethod === "prepaid" ? "awaiting_payment" : "pending",
    paymentMethod,
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email?.trim() || undefined,
      address: customer.address.trim(),
      city: customer.city.trim(),
      state: customer.state.trim(),
      pincode: customer.pincode.trim(),
    },
    items: totals.lineItems,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shipping: totals.shipping,
    total: totals.total,
    currency: totals.currency,
  });

  if (paymentMethod === "prepaid") {
    try {
      const rzp = await createRazorpayOrder(totals.total * 100, order.orderNumber);
      updateOrder(order.orderNumber, { razorpay: { orderId: rzp.id } });
      return NextResponse.json({
        orderNumber: order.orderNumber,
        total: totals.total,
        razorpay: { orderId: rzp.id, amount: rzp.amount, keyId: publicKeyId() },
      });
    } catch {
      updateOrder(order.orderNumber, { status: "cancelled" });
      return NextResponse.json(
        { error: "Could not start online payment. Please try Cash on Delivery." },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ orderNumber: order.orderNumber, total: totals.total, paymentMethod: "cod" });
}
