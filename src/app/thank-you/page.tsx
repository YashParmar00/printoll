import Link from "next/link";
import type { Metadata } from "next";
import { getOrder } from "@/lib/orders";
import { inr } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import { CheckIcon, WhatsAppIcon, TruckIcon } from "@/components/ui/icons";
import ClearCart from "@/components/cart/ClearCart";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order confirmed" };

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber ? getOrder(orderNumber) : undefined;

  const waMessage = order
    ? `Hi ${site.name}, I just placed order ${order.orderNumber} (${order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid online"}). Please confirm.`
    : `Hi ${site.name}, I just placed an order.`;

  return (
    <div className="container-page max-w-2xl py-14">
      <ClearCart />

      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-plum text-white">
          <CheckIcon className="h-9 w-9" />
        </div>
        <h1 className="mt-5 text-3xl sm:text-4xl">Thank you!</h1>
        {order ? (
          <p className="mt-2 text-ink">
            Your order <strong className="text-charcoal">{order.orderNumber}</strong> is placed.
            {order.paymentMethod === "cod"
              ? " We'll confirm the details with you on WhatsApp shortly."
              : order.paymentMethod === "advance_cod"
                ? ` Your ${inr(order.advancePaid)} advance is received — pay the remaining ${inr(order.codDue)} in cash on delivery.`
                : order.status === "paid"
                  ? " Payment received — we're on it."
                  : " We'll confirm shortly."}
          </p>
        ) : (
          <p className="mt-2 text-ink">Your order is placed. We&apos;ll be in touch on WhatsApp shortly.</p>
        )}
      </div>

      {order && (
        <div className="mt-8 rounded-2xl border border-line bg-cream p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-plum">
            <TruckIcon className="h-5 w-5" /> Delivery in 5–7 days across India
          </div>

          <ul className="mt-4 space-y-3 border-t border-line pt-4">
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between gap-3 text-sm">
                <span className="text-charcoal">
                  {it.name} <span className="text-ink">× {it.qty}</span>
                  {it.personalizationText && <span className="block text-xs text-ink">“{it.personalizationText}”</span>}
                  {it.personalizationPhotoName && <span className="block text-xs text-ink">Photo: {it.personalizationPhotoName}</span>}
                </span>
                <span className="font-semibold text-charcoal">{inr(it.unitPrice * it.qty)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink">Subtotal</dt>
              <dd className="text-charcoal">{inr(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink">Prepaid discount</dt>
                <dd className="text-plum">−{inr(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-2 text-base">
              <dt className="font-semibold text-charcoal">Order total</dt>
              <dd className="font-bold text-plum">{inr(order.total)}</dd>
            </div>
            {order.advancePaid > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink">Paid online{order.paymentMethod === "advance_cod" ? " (advance)" : ""}</dt>
                <dd className="font-semibold text-charcoal">{inr(order.advancePaid)}</dd>
              </div>
            )}
            {order.codDue > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink">Pay on delivery</dt>
                <dd className="font-semibold text-charcoal">{inr(order.codDue)}</dd>
              </div>
            )}
          </dl>

          <div className="mt-4 border-t border-line pt-4 text-sm text-ink">
            <p className="font-medium text-charcoal">Delivering to</p>
            <p className="mt-1">
              {order.customer.name} · {order.customer.phone}
              <br />
              {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.pincode}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        <a
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp w-full sm:w-auto"
        >
          <WhatsAppIcon className="h-5 w-5" /> Confirm on WhatsApp
        </a>
        <Link href="/#featured" className="text-sm font-medium text-plum hover:underline">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
