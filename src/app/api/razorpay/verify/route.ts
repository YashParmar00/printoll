import { fetchRazorpayPayment, verifyPaymentSignature } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { paymentSelect, settlePayment } from "@/lib/payment-settlement";
import { boundedText, privateJson } from "@/lib/private-response";
import { rateLimit } from "@/lib/rate-limit";
import { reportServerError } from "@/lib/server-error";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body;
  try { body = JSON.parse(await boundedText(req, 4096)); }
  catch { return privateJson({ error: "Invalid request." }, 400); }
  if (!body || [body.orderNumber, body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature].some(value => typeof value !== "string" || value.length > 128)) {
    return privateJson({ error: "Missing payment details." }, 400);
  }
  try {
    if (!await rateLimit(req.headers, "verify", 30)) return privateJson({ error: "Please wait before retrying." }, 429);
    const order = await prisma.order.findUnique({ where: { orderNumber: body.orderNumber }, select: paymentSelect });
    if (!order?.razorpayOrderId || order.razorpayOrderId !== body.razorpay_order_id || !verifyPaymentSignature({ orderId: order.razorpayOrderId, paymentId: body.razorpay_payment_id, signature: body.razorpay_signature })) {
      return privateJson({ error: "Payment verification failed." }, 400);
    }
    const result = await settlePayment(await fetchRazorpayPayment(body.razorpay_payment_id));
    if (result !== "settled") return privateJson({ error: "Payment is not captured for the expected amount. Please retry verification shortly." }, 409);
    return privateJson({ ok: true, orderNumber: order.orderNumber });
  } catch (error) {
    reportServerError("payment-verification-unavailable", error);
    return privateJson({ error: "Payment verification is temporarily unavailable. Please retry; your order has not been cancelled." }, 503);
  }
}
