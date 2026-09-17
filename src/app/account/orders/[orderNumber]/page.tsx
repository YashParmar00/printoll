import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { getOrderForCustomer } from "@/lib/orders";
import OrderTracker from "@/components/account/OrderTracker";

export const metadata: Metadata = { title: "Order details" };
export const dynamic = "force-dynamic";

export default async function AccountOrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const customer = await getCurrentCustomer();
  if (!customer) redirect(`/account/login?next=${encodeURIComponent(`/account/orders/${orderNumber}`)}`);
  const order = await getOrderForCustomer(orderNumber, customer.id);
  if (!order) notFound();

  return (
    <div className="container-page max-w-2xl py-10 sm:py-14">
      <Link href="/account/orders" className="text-sm font-semibold text-coral">← My orders</Link>
      <h1 className="mt-3 text-3xl sm:text-4xl">Order {order.orderNumber}</h1>
      <div className="mt-6"><OrderTracker order={order} /></div>
    </div>
  );
}
