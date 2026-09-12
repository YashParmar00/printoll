"use client";

import { useState } from "react";
import Link from "next/link";
import { inr } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";

interface TrackedOrder {
  orderNumber: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  total: number;
  advancePaid: number;
  codDue: number;
  items: { name: string; qty: number }[];
  trackingUrl: string | null;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Order placed. Being confirmed",
  awaiting_payment: "Awaiting payment",
  paid: "Payment received",
  confirmed: "Confirmed. Being made",
  pushed_to_supplier: "In production",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function lookup() {
    setLoading(true);
    setError("");
    setResult(null);
    setNotFound(false);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else if (!data.found) {
        setNotFound(true);
      } else {
        setResult(data.order);
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="container-page max-w-2xl py-12">
      <p className="eyebrow">Orders</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Track your order</h1>
      <p className="mt-3 text-ink">Enter your order number and the phone number you used at checkout.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="on" className="field-label">Order number</label>
          <input id="on" className="field" placeholder="AM-YYYYMMDD-XXXX" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
        </div>
        <div>
          <label htmlFor="ph" className="field-label">Phone number</label>
          <input id="ph" className="field" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} />
        </div>
      </div>
      <button type="button" onClick={lookup} disabled={loading} className="btn-primary mt-4 disabled:opacity-60">
        {loading ? "Checking…" : "Track order"}
      </button>

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

      {notFound && (
        <div className="mt-6 rounded-2xl border border-line bg-cream p-6 text-center">
          <p className="font-semibold text-charcoal">We couldn&apos;t find that order</p>
          <p className="mt-1 text-sm text-ink">Double-check the order number and phone, or message us.</p>
          <a href={whatsappLink(`Hi ${site.name}, I need help tracking my order.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-4">
            <WhatsAppIcon className="h-5 w-5" /> Ask on WhatsApp
          </a>
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-2xl border border-line bg-night-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-charcoal">{result.orderNumber}</span>
            <span className="pill bg-jet/10 text-plum">{STATUS_LABEL[result.status] ?? result.status}</span>
          </div>
          <p className="mt-1 text-xs text-ink">Placed {new Date(result.createdAt).toLocaleDateString("en-IN")}</p>

          <ul className="mt-4 space-y-1 border-t border-line pt-4 text-sm text-charcoal">
            {result.items.map((it, i) => (
              <li key={i}>{it.qty}× {it.name}</li>
            ))}
          </ul>

          <dl className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-ink">Order total</dt><dd className="font-semibold text-charcoal">{inr(result.total)}</dd></div>
            {result.advancePaid > 0 && <div className="flex justify-between"><dt className="text-ink">Paid online</dt><dd className="text-charcoal">{inr(result.advancePaid)}</dd></div>}
            {result.codDue > 0 && <div className="flex justify-between"><dt className="text-ink">Pay on delivery</dt><dd className="text-charcoal">{inr(result.codDue)}</dd></div>}
          </dl>

          {result.trackingUrl && (
            <a href={result.trackingUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-4">
              Open courier tracking
            </a>
          )}
        </div>
      )}

      <p className="mt-6 text-sm text-ink">
        Can&apos;t find your order number? It&apos;s in your confirmation, or{" "}
        <Link href="/contact" className="text-plum underline">contact us</Link>.
      </p>
    </div>
  );
}
