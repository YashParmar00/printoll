"use client";

import { useState } from "react";
import OrderTracker, { OrderNotFound, OrderTrackerFooter, type TrackedOrder } from "@/components/account/OrderTracker";

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

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
      if (!res.ok) setError(data.error ?? "Something went wrong.");
      else if (!data.found) setNotFound(true);
      else setResult(data.order);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="container-page max-w-2xl py-10 sm:py-14">
      <p className="eyebrow flex items-center gap-2 text-[10px] sm:text-xs"><span className="h-1.5 w-1.5 rounded-full bg-coral" /> Orders</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Track your order</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink sm:text-base">Enter your order number and the phone number you used at checkout.</p>

      <div className="mt-6 rounded-2xl border border-line bg-night-card p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="on" className="field-label">Order number</label>
            <input id="on" className="field mt-1" placeholder="AM-YYYYMMDD-XXXX" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lookup()} />
          </div>
          <div>
            <label htmlFor="ph" className="field-label">Phone number</label>
            <input id="ph" className="field mt-1" inputMode="numeric" maxLength={10} placeholder="10-digit number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} onKeyDown={(e) => e.key === "Enter" && lookup()} />
          </div>
        </div>
        <button type="button" onClick={lookup} disabled={loading || !orderNumber || phone.length !== 10} className={`btn-primary mt-5 w-full sm:w-auto disabled:opacity-60 ${focus}`}>
          {loading ? "Checking…" : "Track order"}
        </button>
        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
      </div>

      {notFound && <OrderNotFound />}
      {result && <div className="mt-6"><OrderTracker order={result} /></div>}
      <OrderTrackerFooter />
    </div>
  );
}
