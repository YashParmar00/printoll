import { verifyWebhookSignature } from "@/lib/razorpay";
import { settlePayment } from "@/lib/payment-settlement";
import { boundedText, privateJson } from "@/lib/private-response";
import { reportServerError } from "@/lib/server-error";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let raw: string;
  try { raw = await boundedText(req, 65_536); }
  catch { return privateJson({ error: "Invalid request." }, 400); }
  if (!verifyWebhookSignature(raw, req.headers.get("x-razorpay-signature") ?? "")) return privateJson({ error: "Invalid signature." }, 400);
  let event;
  try { event = JSON.parse(raw); }
  catch { return privateJson({ error: "Bad payload." }, 400); }
  if (!event || typeof event !== "object") return privateJson({ error: "Bad payload." }, 400);
  if (event.event !== "payment.captured" && event.event !== "order.paid") return privateJson({ ok: true });
  const payment = event.payload?.payment?.entity;
  if (!payment || typeof payment.order_id !== "string" || payment.order_id.length > 128) return privateJson({ error: "Missing payment entity." }, 400);
  try {
    const result = await settlePayment(payment);
    if (result === "invalid") return privateJson({ error: "Payment does not match expected capture." }, 400);
    return privateJson({ ok: true });
  } catch (error) {
    reportServerError("payment-webhook-unavailable", error);
    return privateJson({ error: "Payment persistence unavailable." }, 503);
  }
}
