import { NextResponse } from "next/server";
import { getOrderByNumberAndPhone } from "@/lib/orders";

export const runtime = "nodejs";

/** Look up an order by number + phone (so orders aren't guessable). */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { orderNumber?: string; phone?: string };
  const orderNumber = (body.orderNumber ?? "").trim();
  const phone = (body.phone ?? "").trim();

  if (!orderNumber || !phone) {
    return NextResponse.json({ error: "Enter your order number and phone." }, { status: 400 });
  }

  const order = await getOrderByNumberAndPhone(orderNumber, phone);
  if (!order) return NextResponse.json({ found: false });

  // Return only what's safe to show — no full address.
  return NextResponse.json({
    found: true,
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      total: order.total,
      advancePaid: order.advancePaid,
      codDue: order.codDue,
      items: order.items.map((i) => ({ name: i.name, qty: i.qty })),
      trackingUrl: order.trackingUrl ?? null,
    },
  });
}
