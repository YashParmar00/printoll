import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { listOrdersByCustomer } from "@/lib/orders";
import { inr } from "@/lib/format";
import { STATUS_LABEL } from "@/components/account/OrderTracker";
import { BagIcon, ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "My orders" };
export const dynamic = "force-dynamic";

export default async function MyOrdersPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login?next=/account/orders");
  const orders = await listOrdersByCustomer(customer.id);

  return (
    <div className="container-page min-h-[900px] py-10">
      <Link href="/account" className="text-sm font-semibold text-coral">← My account</Link>
      <h1 className="mt-3 text-3xl sm:text-4xl">My orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-line bg-sand/50 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-coral/10 text-coral"><BagIcon className="h-6 w-6" /></div>
          <h2 className="mt-5 text-2xl">No orders placed while signed in yet.</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink">Orders placed as a guest won&apos;t show here — track those from the Track order page with your order number and phone.</p>
          <Link href="/category" className="btn-primary mt-6 text-sm">Browse products</Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((order) => (
            <li key={order.orderNumber}>
              <Link href={`/account/orders/${order.orderNumber}`} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-night-card p-5 transition hover:border-coral/40">
                <div>
                  <span className="font-semibold text-white">{order.orderNumber}</span>
                  <span className="mt-1 block text-xs text-ink">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {inr(order.total)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`tag ${order.status === "cancelled" ? "bg-red-500/15 text-red-400" : "bg-coral/15 text-coral-light"}`}>{STATUS_LABEL[order.status] ?? order.status}</span>
                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-ink" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
