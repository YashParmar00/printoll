import { prisma } from "@/lib/prisma";
import { paymentMatches, settledStatus, type CapturedPayment } from "@/lib/payment-state";

export const paymentSelect = { id: true, orderNumber: true, status: true, paymentMethod: true, onlineAmount: true, currency: true, razorpayOrderId: true, razorpayPaymentId: true, paymentStatus: true, total: true } as const;

export async function settlePayment(payment: CapturedPayment) {
  return prisma.$transaction(async (tx) => {
    const matches = await tx.order.findMany({ where: { razorpayOrderId: payment.order_id }, select: paymentSelect, take: 2 });
    if (matches.length === 0) return "unknown" as const;
    if (matches.length !== 1) throw new Error("Ambiguous provider order ID.");
    const order = matches[0];
    if (!paymentMatches(order, payment)) return "invalid" as const;
    if (order.paymentStatus === "captured") return order.razorpayPaymentId === payment.id ? "settled" as const : "invalid" as const;
    const result = await tx.order.updateMany({
      where: { id: order.id, status: order.status, paymentStatus: order.paymentStatus, razorpayPaymentId: order.razorpayPaymentId },
      data: { paymentStatus: "captured", status: settledStatus(order.status, order.paymentMethod), razorpayPaymentId: payment.id, advancePaid: order.onlineAmount, codDue: order.total - order.onlineAmount },
    });
    if (result.count !== 1) throw new Error("Concurrent payment update; retry verification.");
    return "settled" as const;
  });
}
