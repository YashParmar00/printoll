import { NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { getOrder, updateOrder } from "@/lib/orders";

export const runtime = "nodejs";

interface VerifyBody {
  orderNumber?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as VerifyBody;
  const { orderNumber, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!orderNumber || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  }

  const order = getOrder(orderNumber);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  // Defense-in-depth: the paid Razorpay order must match the one we created.
  if (order.razorpay?.orderId && order.razorpay.orderId !== razorpay_order_id) {
    return NextResponse.json({ error: "Order mismatch." }, { status: 400 });
  }

  const valid = verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!valid) {
    updateOrder(orderNumber, { status: "cancelled" });
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  updateOrder(orderNumber, {
    status: "paid",
    razorpay: { orderId: razorpay_order_id, paymentId: razorpay_payment_id },
  });
  return NextResponse.json({ ok: true, orderNumber });
}
