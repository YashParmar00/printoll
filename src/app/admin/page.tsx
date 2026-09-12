import type { Metadata } from "next";
import { listOrders, type OrderStatus } from "@/lib/orders";
import { inr } from "@/lib/format";
import { updateStatusAction } from "./actions";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin · Orders",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  awaiting_payment: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  confirmed: "bg-jet/10 text-plum",
  pushed_to_supplier: "bg-blue-100 text-blue-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

function StatusButton({
  orderNumber,
  status,
  label,
  tone,
}: {
  orderNumber: string;
  status: OrderStatus;
  label: string;
  tone: "primary" | "muted" | "danger";
}) {
  const cls =
    tone === "primary"
      ? "border-plum text-plum hover:bg-jet hover:text-white"
      : tone === "danger"
        ? "border-red-300 text-red-600 hover:bg-red-600 hover:text-white"
        : "border-line text-ink hover:bg-cream";
  return (
    <form action={updateStatusAction}>
      <input type="hidden" name="orderNumber" value={orderNumber} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${cls}`}>
        {label}
      </button>
    </form>
  );
}

export default async function AdminPage() {
  const orders = await listOrders();
  const todayStr = new Date().toDateString();
  const active = orders.filter((o) => o.status !== "cancelled");
  const revenue = active.reduce((s, o) => s + o.total, 0);
  const todayCount = orders.filter((o) => new Date(o.createdAt).toDateString() === todayStr).length;
  const needsAction = orders.filter((o) => o.status === "pending" || o.status === "awaiting_payment").length;

  const stats: { label: string; value: string | number }[] = [
    { label: "Orders today", value: todayCount },
    { label: "Total orders", value: orders.length },
    { label: "Revenue (active)", value: inr(revenue) },
    { label: "Needs action", value: needsAction },
  ];

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">Printoll admin</p><h1 className="mt-1 text-3xl">Orders</h1></div>
        <div className="flex flex-wrap gap-2"><Link href="/admin/collections" className="btn-secondary px-5 py-2.5 text-sm">Manage homepage collections</Link><Link href="/admin/products" className="btn-secondary px-5 py-2.5 text-sm">Manage products</Link></div>
      </div>

      <p className="mt-4 rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink">
        Orders are stored in <strong>Supabase Postgres</strong> (via Prisma).
        Automatic supplier push is <strong>stubbed</strong> — it turns on once a supplier is chosen
        (<code>src/lib/supplier.ts</code>).
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-night-card p-4">
            <div className="text-2xl font-bold text-plum">{s.value}</div>
            <div className="text-xs text-ink">{s.label}</div>
          </div>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-line bg-night-card p-10 text-center text-ink">No orders yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-ink">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o.orderNumber} className="align-top">
                  <td className="p-3">
                    <div className="font-semibold text-charcoal">{o.orderNumber}</div>
                    <div className="text-xs text-ink">{new Date(o.createdAt).toLocaleString("en-IN")}</div>
                    <div className="mt-1 text-xs font-semibold uppercase text-plum">{o.paymentMethod}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-charcoal">{o.customer.name}</div>
                    <div className="text-xs text-ink">{o.customer.phone}</div>
                    <div className="text-xs text-ink">
                      {o.customer.city}, {o.customer.state} {o.customer.pincode}
                    </div>
                  </td>
                  <td className="p-3">
                    <ul className="space-y-1">
                      {o.items.map((it, i) => (
                        <li key={i} className="text-xs text-charcoal">
                          {it.qty}× {it.name}
                          {it.personalizationText && <span className="text-ink"> — “{it.personalizationText}”</span>}
                          {it.personalizationPhotoName && <span className="text-ink"> — 📷 {it.personalizationPhotoName}</span>}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-charcoal">{inr(o.total)}</span>
                    {o.advancePaid > 0 && (
                      <div className="text-xs font-medium text-emerald-700">{inr(o.advancePaid)} prepaid</div>
                    )}
                    {o.codDue > 0 && <div className="text-xs text-ink">{inr(o.codDue)} COD</div>}
                    {o.discount > 0 && <div className="text-xs text-plum">−{inr(o.discount)} discount</div>}
                  </td>
                  <td className="p-3">
                    <span className={`pill ${STATUS_STYLES[o.status]}`}>{o.status.replace(/_/g, " ")}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1.5">
                      <StatusButton orderNumber={o.orderNumber} status="confirmed" label="Confirm" tone="primary" />
                      <StatusButton orderNumber={o.orderNumber} status="shipped" label="Ship" tone="muted" />
                      <StatusButton orderNumber={o.orderNumber} status="delivered" label="Delivered" tone="muted" />
                      <StatusButton orderNumber={o.orderNumber} status="cancelled" label="Cancel" tone="danger" />
                      {/* Supplier auto-push plugs in here once a supplier is chosen (src/lib/supplier.ts). */}
                      <button
                        type="button"
                        disabled
                        title="Automatic supplier push — enabled once a supplier is selected (src/lib/supplier.ts)"
                        className="cursor-not-allowed rounded-full border border-dashed border-line px-3 py-1 text-xs font-semibold text-ink opacity-60"
                      >
                        Push to supplier ⛔
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
