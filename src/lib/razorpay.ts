/**
 * Razorpay server helpers — SERVER ONLY (secrets + node:crypto).
 * Implemented with fetch + HMAC (no SDK dependency). The logic is identical
 * whether the keys are placeholders or real rzp_test_ keys — only the env
 * values change (see .env.example).
 */
import crypto from "node:crypto";

const KEY_ID = process.env.RAZORPAY_KEY_ID ?? "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? "";
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

/** A value is a real key only if it's set and not one of our placeholders. */
function isReal(v: string): boolean {
  return v.length > 0 && !v.includes("PLACEHOLDER");
}

/** True once real key id + secret are present (prepaid can go live). */
export function isRazorpayConfigured(): boolean {
  return isReal(KEY_ID) && isReal(KEY_SECRET);
}

export function publicKeyId(): string {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

/** Create a Razorpay order (amount in paise). */
export async function createRazorpayOrder(amountPaise: number, receipt: string): Promise<RazorpayOrder> {
  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, payment_capture: 1 }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Razorpay order creation failed (${res.status}): ${detail}`);
  }
  return (await res.json()) as RazorpayOrder;
}

function safeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Verify the checkout callback signature: HMAC_SHA256(order_id|payment_id, key_secret). */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const expected = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");
  return safeEqualHex(expected, params.signature);
}

/** Verify a webhook: HMAC_SHA256(rawBody, webhook_secret) vs x-razorpay-signature. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}
