import { NextResponse } from "next/server";
import {
  validateCustomer,
  CheckoutError,
  type CheckoutLineInput,
  type CustomerInput,
  type PaymentMethod,
} from "@/lib/checkout";
import { catalogItemsRequireAdvance, computeDatabaseTotals } from "@/lib/checkout-server";
import { createOrder, updateOrder } from "@/lib/orders";
import { isRazorpayConfigured, createRazorpayOrder, publicKeyId } from "@/lib/razorpay";
import { site } from "@/lib/site";

export const runtime = "nodejs";

interface CheckoutRequestBody {
  items?: CheckoutLineInput[];
  customer?: CustomerInput;
  paymentMethod?: string;
}

function normalizeMethod(v: unknown): PaymentMethod {
  return v === "prepaid" ? "prepaid" : v === "advance_cod" ? "advance_cod" : "cod";
}

export async function POST(req: Request) {
  let body: CheckoutRequestBody;
  try {
    body = (await req.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const items = body.items ?? [];
  let paymentMethod = normalizeMethod(body.paymentMethod);

  const customerError = validateCustomer(body.customer);
  if (customerError) return NextResponse.json({ error: customerError }, { status: 400 });
  const customer = body.customer as CustomerInput;

  const requiresAdvance = await catalogItemsRequireAdvance(items);
  const razorpayReady = isRazorpayConfigured();

  // If advance was requested but nothing in the cart needs it, treat as full COD.
  if (paymentMethod === "advance_cod" && !requiresAdvance) paymentMethod = "cod";

  // Online-collecting methods need Razorpay configured.
  if ((paymentMethod === "prepaid" || paymentMethod === "advance_cod") && !razorpayReady) {
    return NextResponse.json(
      {
        error: "Online payment isn't enabled yet. Please choose Cash on Delivery.",
        code: "RAZORPAY_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  // Once online is live, personalized carts must pay the advance (no full COD).
  if (paymentMethod === "cod" && requiresAdvance && razorpayReady) {
    return NextResponse.json(
      {
        error: `Personalized items need a ₹${site.advanceAmount} advance. Please choose the advance option.`,
        code: "ADVANCE_REQUIRED",
      },
      { status: 400 },
    );
  }

  // Server-side price validation — recomputed from the catalogue, client total ignored.
  let totals;
  try {
    totals = await computeDatabaseTotals(items, paymentMethod);
  } catch (e) {
    if (e instanceof CheckoutError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }

  const order = await createOrder({
    status: paymentMethod === "cod" ? "pending" : "awaiting_payment",
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
    advancePaid: totals.advancePaid,
    codDue: totals.codDue,
    currency: totals.currency,
  });

  // Collect the online portion (full amount for prepaid, the advance for advance_cod).
  if (paymentMethod === "prepaid" || paymentMethod === "advance_cod") {
    try {
      const rzp = await createRazorpayOrder(totals.advancePaid * 100, order.orderNumber);
      await updateOrder(order.orderNumber, { razorpay: { orderId: rzp.id } });
      return NextResponse.json({
        orderNumber: order.orderNumber,
        paymentMethod,
        total: totals.total,
        advancePaid: totals.advancePaid,
        codDue: totals.codDue,
        razorpay: { orderId: rzp.id, amount: rzp.amount, keyId: publicKeyId() },
      });
    } catch {
      await updateOrder(order.orderNumber, { status: "cancelled" });
      return NextResponse.json(
        { error: "Could not start online payment. Please try again." },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    paymentMethod: "cod",
    total: totals.total,
    advancePaid: 0,
    codDue: totals.codDue,
  });
}
