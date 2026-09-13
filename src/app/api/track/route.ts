import { prisma } from "@/lib/prisma";
import { boundedText, privateJson } from "@/lib/private-response";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export async function POST(request: Request) {
  let body;
  try { body = JSON.parse(await boundedText(request, 2048)); } catch { return privateJson({ error: "Invalid request." }, 400); }
  if (!body || typeof body.orderNumber !== "string" || !/^AM-\d{8}-[A-F0-9]{4,16}$/.test(body.orderNumber) || typeof body.phone !== "string" || !/^[6-9]\d{9}$/.test(body.phone)) return privateJson({ error: "Enter a valid order number and phone." }, 400);
  try {
    if (!await rateLimit(request.headers, "track", 10)) return privateJson({ error: "Please wait before trying again." }, 429);
    const order = await prisma.order.findFirst({ where: { orderNumber: body.orderNumber, customerPhone: body.phone }, select: { orderNumber: true, status: true, paymentMethod: true, createdAt: true, total: true, advancePaid: true, codDue: true, trackingUrl: true, items: { select: { name: true, qty: true } } } });
    return privateJson(order ? { found: true, order } : { found: false });
  } catch { return privateJson({ error: "Tracking is temporarily unavailable." }, 503); }
}
