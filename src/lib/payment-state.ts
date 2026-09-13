export interface CapturedPayment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  captured: boolean;
}

export function paymentMatches(order: { razorpayOrderId: string | null; onlineAmount: number; currency: string; paymentMethod: string }, payment: CapturedPayment) {
  return order.paymentMethod !== "cod" && !!order.razorpayOrderId &&
    payment.order_id === order.razorpayOrderId && typeof payment.id === "string" && /^pay_[a-zA-Z0-9]+$/.test(payment.id) &&
    Number.isSafeInteger(payment.amount) && order.onlineAmount > 0 && payment.amount === order.onlineAmount * 100 &&
    payment.currency === order.currency && payment.status === "captured" && payment.captured === true;
}

export function settledStatus(status: string, method: string) {
  return status === "awaiting_payment" ? (method === "advance_cod" ? "confirmed" : "paid") : status;
}
