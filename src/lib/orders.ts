/**
 * Order store — SERVER ONLY (uses node:fs). Backed by a local JSON file so
 * orders survive dev restarts and are visible to the founder. This is a
 * placeholder for the real Postgres/Prisma store (M5) — the exported functions
 * are the interface that swap keeps stable.
 *
 * NOTE: file storage is fine for local dev, but is ephemeral on serverless
 * hosts (Vercel). Moving to a hosted DB is a blocker tracked in PROJECT_STATUS.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { OrderLine, PaymentMethod } from "@/lib/checkout";

export type OrderStatus =
  | "pending" // COD, awaiting founder confirmation
  | "awaiting_payment" // prepaid order created, not yet paid
  | "paid" // prepaid payment verified
  | "confirmed" // founder confirmed — ready to fulfil
  | "pushed_to_supplier" // auto-pushed to supplier (enabled once a supplier is chosen)
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
  advancePaid: number; // collected online now (0 for full COD)
  codDue: number; // collected in cash on delivery (0 for full prepaid)
  currency: string;
  razorpay?: { orderId?: string; paymentId?: string };
}

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "orders.json");

function readAll(): Order[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as Order[];
  } catch {
    return [];
  }
}

function writeAll(orders: Order[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(orders, null, 2), "utf8");
}

export function generateOrderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `AM-${ymd}-${rand}`;
}

export function createOrder(input: Omit<Order, "orderNumber" | "createdAt">): Order {
  const order: Order = {
    ...input,
    orderNumber: generateOrderNumber(),
    createdAt: new Date().toISOString(),
  };
  const orders = readAll();
  orders.push(order);
  writeAll(orders);
  return order;
}

export function getOrder(orderNumber: string): Order | undefined {
  return readAll().find((o) => o.orderNumber === orderNumber);
}

/** Track-order lookup (M6) uses number + phone so orders aren't guessable. */
export function getOrderByNumberAndPhone(orderNumber: string, phone: string): Order | undefined {
  return readAll().find((o) => o.orderNumber === orderNumber && o.customer.phone === phone);
}

export function updateOrder(orderNumber: string, patch: Partial<Order>): Order | undefined {
  const orders = readAll();
  const idx = orders.findIndex((o) => o.orderNumber === orderNumber);
  if (idx < 0) return undefined;
  orders[idx] = { ...orders[idx], ...patch };
  writeAll(orders);
  return orders[idx];
}

export function listOrders(): Order[] {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
