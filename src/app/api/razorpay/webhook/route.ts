import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { listOrders, updateOrder } from "@/lib/orders";

export const runtime = "nodejs";

/**
 * Razorpay webhook — the source of truth for prepaid payments. Verifies the
 * x-razorpay-signature over the RAW body before trusting anything.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string } } };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad payload." }, { status: 400 });
  }

  if (event.event === "payment.captured" || event.event === "order.paid") {
    const rzpOrderId = event.payload?.payment?.entity?.order_id;
    const paymentId = event.payload?.payment?.entity?.id;
    if (rzpOrderId) {
      const order = listOrders().find((o) => o.razorpay?.orderId === rzpOrderId);
      if (order && order.status !== "paid") {
        updateOrder(order.orderNumber, {
          status: "paid",
          razorpay: { orderId: rzpOrderId, paymentId },
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
