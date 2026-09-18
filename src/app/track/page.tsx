import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { listOrdersByCustomer } from "@/lib/orders";
import { products, FALLBACK_PRODUCT_IMAGE } from "@/lib/products";
import { inr } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import { STATUS_LABEL } from "@/components/account/OrderTracker";
import { HeadsetIcon, WhatsAppIcon, BagIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Track your order" };
export const dynamic = "force-dynamic";

export default async function TrackOrderPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login?next=/track");
  const recentOrders = await listOrdersByCustomer(customer.id);

  return (
    <div className="container-page max-w-lg py-6 sm:py-10">
      <Link href="/account" className="text-xs font-semibold text-coral">← My account</Link>
      <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Track your order</h1>
      <p className="mt-1 text-sm text-ink">Here&apos;s the latest on your orders.</p>

      {recentOrders.length > 0 ? (
        <div className="mt-7">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink">Your orders</h2>
          <ul className="mt-3 space-y-2.5">
            {recentOrders.map((order) => {
              const firstItem = order.items[0];
              const product = firstItem ? products.find((p) => p.slug === firstItem.slug) : undefined;
              const image = product?.imageUrls?.[0] ?? product?.imageUrl ?? FALLBACK_PRODUCT_IMAGE;
              return (
                <li key={order.orderNumber}>
                  <Link href={`/account/orders/${order.orderNumber}`} className="flex items-center gap-3 rounded-2xl border border-line bg-night-card p-3 transition hover:border-coral/40">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-sand">
                      <Image src={image} alt="" fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{order.orderNumber}</p>
                      <p className="mt-0.5 text-xs text-ink">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {inr(order.total)}
                      </p>
                    </div>
                    <span className={`tag shrink-0 ${order.status === "cancelled" ? "bg-red-500/15 text-red-400" : "bg-coral/15 text-coral-light"}`}>{STATUS_LABEL[order.status] ?? order.status}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="mt-7 flex flex-col items-center rounded-2xl border border-dashed border-line bg-sand/50 px-6 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-coral/10 text-coral"><BagIcon className="h-5 w-5" /></span>
          <p className="mt-4 font-semibold text-white">No orders yet</p>
          <p className="mt-1 text-sm text-ink">Once you place an order, you can track it here.</p>
          <Link href="/category" className="btn-primary mt-5 text-sm">Browse products</Link>
        </div>
      )}

      <div className="mt-7 flex items-center gap-3 rounded-2xl border border-line bg-night-card p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral"><HeadsetIcon className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">Need help with your order?</p>
          <p className="text-xs text-ink">Our support team is here for you.</p>
        </div>
        <a
          href={whatsappLink(`Hi ${site.name}, I need help tracking my order.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-coral/40 px-3 py-2 text-xs font-semibold text-coral"
        >
          <WhatsAppIcon className="h-3.5 w-3.5" /> Contact
        </a>
      </div>
    </div>
  );
}
