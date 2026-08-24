/**
 * Order store — SERVER ONLY. Backed by Prisma/Postgres (Supabase).
 *
 * The exported `Order` shape (nested `customer` + `razorpay`) is unchanged from
 * the old file store, via the `toOrder` mapper — so callers only needed to add
 * `await`. Replaces the previous `.data/orders.json` file store.
 */
import crypto from "node:crypto";
import type { Order as DbOrder, OrderItem as DbOrderItem } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { OrderLine, PaymentMethod } from "@/lib/checkout";

export type OrderStatus =
  | "pending" // COD, awaiting founder confirmation
  | "awaiting_payment" // online order created, not yet paid
  | "paid" // full prepaid verified
  | "confirmed" // founder confirmed / advance secured — ready to fulfil
  | "pushed_to_supplier" // auto-pushed to supplier (once a supplier is chosen)
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  customer: OrderCustomer;
  items: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  advancePaid: number;
  codDue: number;
  currency: string;
  razorpay?: { orderId?: string; paymentId?: string };
  trackingUrl?: string;
}

export function generateOrderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `AM-${ymd}-${rand}`;
}

/** Reshape a Prisma row (+items) back into the app's `Order` shape. */
function toOrder(row: DbOrder & { items: DbOrderItem[] }): Order {
  return {
    orderNumber: row.orderNumber,
    createdAt: row.createdAt.toISOString(),
    status: row.status as OrderStatus,
    paymentMethod: row.paymentMethod as PaymentMethod,
    customer: {
      name: row.customerName,
      phone: row.customerPhone,
      email: row.customerEmail ?? undefined,
      address: row.address,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
    },
    items: row.items.map((it) => ({
      slug: it.slug,
      name: it.name,
      qty: it.qty,
      unitPrice: it.unitPrice,
      lineTotal: it.lineTotal,
      requiresAdvance: it.requiresAdvance,
      personalizationText: it.personalizationText ?? undefined,
      personalizationPhotoName: it.personalizationPhotoName ?? undefined,
    })),
    subtotal: row.subtotal,
    discount: row.discount,
    shipping: row.shipping,
    total: row.total,
    advancePaid: row.advancePaid,
    codDue: row.codDue,
    currency: row.currency,
    razorpay:
      row.razorpayOrderId || row.razorpayPaymentId
        ? { orderId: row.razorpayOrderId ?? undefined, paymentId: row.razorpayPaymentId ?? undefined }
        : undefined,
    trackingUrl: row.trackingUrl ?? undefined,
  };
}

export async function createOrder(input: Omit<Order, "orderNumber" | "createdAt">): Promise<Order> {
  const row = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      status: input.status,
      paymentMethod: input.paymentMethod,
      customerName: input.customer.name,
      customerPhone: input.customer.phone,
      customerEmail: input.customer.email ?? null,
      address: input.customer.address,
      city: input.customer.city,
      state: input.customer.state,
      pincode: input.customer.pincode,
      subtotal: input.subtotal,
      discount: input.discount,
      shipping: input.shipping,
      total: input.total,
      advancePaid: input.advancePaid,
      codDue: input.codDue,
      currency: input.currency,
      razorpayOrderId: input.razorpay?.orderId ?? null,
      razorpayPaymentId: input.razorpay?.paymentId ?? null,
      trackingUrl: input.trackingUrl ?? null,
      items: {
        create: input.items.map((it) => ({
          slug: it.slug,
          name: it.name,
          qty: it.qty,
          unitPrice: it.unitPrice,
          lineTotal: it.lineTotal,
          requiresAdvance: it.requiresAdvance,
          personalizationText: it.personalizationText ?? null,
          personalizationPhotoName: it.personalizationPhotoName ?? null,
        })),
      },
    },
    include: { items: true },
  });
  return toOrder(row);
}

export async function getOrder(orderNumber: string): Promise<Order | undefined> {
  const row = await prisma.order.findUnique({ where: { orderNumber }, include: { items: true } });
  return row ? toOrder(row) : undefined;
}

/** Track-order lookup — number + phone so orders aren't guessable. */
export async function getOrderByNumberAndPhone(
  orderNumber: string,
  phone: string,
): Promise<Order | undefined> {
  const row = await prisma.order.findFirst({
    where: { orderNumber, customerPhone: phone },
    include: { items: true },
  });
  return row ? toOrder(row) : undefined;
}

export async function updateOrder(orderNumber: string, patch: Partial<Order>): Promise<Order | undefined> {
  const data: Record<string, unknown> = {};
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.trackingUrl !== undefined) data.trackingUrl = patch.trackingUrl;
  if (patch.razorpay !== undefined) {
    if (patch.razorpay.orderId !== undefined) data.razorpayOrderId = patch.razorpay.orderId;
    if (patch.razorpay.paymentId !== undefined) data.razorpayPaymentId = patch.razorpay.paymentId;
  }
  try {
    const row = await prisma.order.update({
      where: { orderNumber },
      data,
      include: { items: true },
    });
    return toOrder(row);
  } catch {
    return undefined; // order not found
  }
}

export async function listOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}
