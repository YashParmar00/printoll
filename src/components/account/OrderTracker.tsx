import Link from "next/link";
import { inr } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon, CheckIcon, TruckIcon, SparkleIcon, BagIcon, XIcon } from "@/components/ui/icons";

export interface TrackedOrder {
  orderNumber: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  total: number;
  advancePaid: number;
  codDue: number;
  items: { name: string; qty: number }[];
  trackingUrl?: string | null;
}

export const STATUS_LABEL: Record<string, string> = {
  pending: "Order placed. Being confirmed",
  awaiting_payment: "Awaiting payment",
  paid: "Payment received",
  confirmed: "Confirmed. Being made",
  pushed_to_supplier: "In production",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// Five-stop journey shown as an animated progress bar. awaiting_payment/paid
// fold into the nearest real step rather than getting their own stop.
const STEPS = [
  { key: "placed", label: "Placed", Icon: BagIcon },
  { key: "confirmed", label: "Confirmed", Icon: CheckIcon },
  { key: "production", label: "In production", Icon: SparkleIcon },
  { key: "shipped", label: "Shipped", Icon: TruckIcon },
  { key: "delivered", label: "Delivered", Icon: CheckIcon },
] as const;

function stepIndex(status: string) {
  switch (status) {
    case "confirmed": case "paid": return 1;
    case "pushed_to_supplier": return 2;
    case "shipped": return 3;
    case "delivered": return 4;
    default: return 0; // pending, awaiting_payment
  }
}

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

/** The order card + animated stepper shared by /track (guest lookup) and /account/orders (signed-in). */
export default function OrderTracker({ order }: { order: TrackedOrder }) {
  const cancelled = order.status === "cancelled";
  const current = stepIndex(order.status);
  const progressPct = (current / (STEPS.length - 1)) * 100;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-night-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-5 sm:p-6">
        <div>
          <span className="font-semibold text-white">{order.orderNumber}</span>
          <span className="ml-2 text-xs text-ink">Placed {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
        <span className={`tag ${cancelled ? "bg-red-500/15 text-red-400" : "bg-coral/15 text-coral-light"}`}>{STATUS_LABEL[order.status] ?? order.status}</span>
      </div>

      <div className="p-5 sm:p-6">
        {cancelled ? (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400"><XIcon className="h-5 w-5" /></span>
            <p className="text-sm text-red-300">This order was cancelled. Message us on WhatsApp if that&apos;s unexpected.</p>
          </div>
        ) : (
          <div className="relative pt-4">
            <div className="absolute left-4 right-4 top-8 h-0.5 bg-line sm:top-[1.125rem]" />
            <div
              className="absolute left-4 top-8 h-0.5 bg-coral transition-[width] duration-700 ease-out sm:top-[1.125rem]"
              style={{ width: `calc((100% - 2rem) * ${progressPct / 100})` }}
            />
            <ol className="relative flex items-start justify-between">
              {STEPS.map((step, i) => {
                const done = i < current;
                const active = i === current;
                const inProgress = active && current < STEPS.length - 1;
                return (
                  <li key={step.key} className="flex flex-1 flex-col items-center text-center last:flex-none">
                    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center sm:h-9 sm:w-9">
                      {inProgress && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-coral/40" />}
                      <span className={`relative flex h-full w-full items-center justify-center rounded-full transition-all duration-500 ${done || active ? "scale-100 bg-coral text-white" : "scale-90 bg-sand text-ink"}`}>
                        <step.Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      </span>
                    </span>
                    <span className={`mt-2 max-w-16 text-[10px] font-medium leading-tight transition-colors sm:max-w-none sm:text-xs ${done || active ? "text-white" : "text-ink"}`}>{step.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      <ul className="space-y-1 border-t border-line px-5 py-4 text-sm text-white sm:px-6">
        {order.items.map((item, i) => (
          <li key={i} className="flex justify-between gap-3"><span>{item.qty}× {item.name}</span></li>
        ))}
      </ul>

      <dl className="space-y-1.5 border-t border-line px-5 py-4 text-sm sm:px-6">
        <div className="flex justify-between"><dt className="text-ink">Order total</dt><dd className="font-semibold text-white">{inr(order.total)}</dd></div>
        {order.advancePaid > 0 && <div className="flex justify-between"><dt className="text-ink">Paid online</dt><dd className="text-white">{inr(order.advancePaid)}</dd></div>}
        {order.codDue > 0 && <div className="flex justify-between"><dt className="text-ink">Pay on delivery</dt><dd className="text-white">{inr(order.codDue)}</dd></div>}
      </dl>

      <div className="flex flex-wrap gap-3 border-t border-line px-5 py-4 sm:px-6">
        {order.trackingUrl && (
          <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className={`btn-secondary ${focus}`}>
            <TruckIcon className="h-4 w-4" /> Open courier tracking
          </a>
        )}
        <a href={whatsappLink(`Hi ${site.name}, I have a question about order ${order.orderNumber}.`)} target="_blank" rel="noopener noreferrer" className={`btn-whatsapp ${focus}`}>
          <WhatsAppIcon className="h-5 w-5" /> Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}

export function OrderNotFound() {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-line bg-sand/50 p-6 text-center">
      <p className="font-semibold text-white">We couldn&apos;t find that order</p>
      <p className="mt-1 text-sm text-ink">Double-check the order number and phone, or message us and we&apos;ll look it up.</p>
      <a href={whatsappLink(`Hi ${site.name}, I need help tracking my order.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-4">
        <WhatsAppIcon className="h-5 w-5" /> Ask on WhatsApp
      </a>
    </div>
  );
}

export function OrderTrackerFooter() {
  return (
    <p className="mt-6 text-sm text-ink">
      Can&apos;t find your order number? It&apos;s in your confirmation, or{" "}
      <Link href="/contact" className="font-semibold text-coral hover:underline">contact us</Link>.
    </p>
  );
}
