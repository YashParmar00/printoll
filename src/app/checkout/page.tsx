"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { validateCustomer, type OrderTotals, type PaymentMethod } from "@/lib/checkout";
import { loadRazorpay } from "@/lib/razorpay-browser";
import { inr } from "@/lib/format";
import { site } from "@/lib/site";
import { ShieldIcon, RupeeIcon, CheckIcon, TruckIcon } from "@/components/ui/icons";

interface SavedAddress {
  id: string; label: string; fullName: string; phone: string;
  line1: string; line2: string; city: string; state: string; pincode: string; isDefault: boolean;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open: () => void;
}
interface RazorpayCtor {
  new (options: Record<string, unknown>): RazorpayInstance;
}

const emptyForm = { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, count, hydrated } = useCart();

  const [form, setForm] = useState(emptyForm);
  const [chosenMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  function applyAddress(address: SavedAddress, email?: string) {
    setSelectedAddressId(address.id);
    setForm((f) => ({
      name: address.fullName,
      phone: address.phone,
      email: email ?? f.email,
      address: address.line2 ? `${address.line1}, ${address.line2}` : address.line1,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    }));
  }

  useEffect(() => {
    fetch("/api/account/addresses")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.loggedIn) return;
        setSavedAddresses(data.addresses ?? []);
        const preferred = data.addresses?.find((a: SavedAddress) => a.isDefault) ?? data.addresses?.[0];
        if (preferred) applyAddress(preferred, data.email);
        else if (data.email) setForm((f) => ({ ...f, email: data.email }));
      })
      .catch(() => {});
    // Runs once on mount — applyAddress reads state via updater functions, so it doesn't need to be a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submittingRef = useRef(false);
  const [quote, setQuote] = useState<{ methods: PaymentMethod[]; totals: Record<PaymentMethod, OrderTotals>; input: string } | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [quoteVersion, refreshQuote] = useState(0);
  const lineInput = useMemo(() => JSON.stringify(items.map(({ slug, qty, sizes, personalizationText, personalizationPhotoName }) => ({ slug, qty, sizes, personalizationText, personalizationPhotoName }))), [items]);
  useEffect(() => {
    if (!hydrated || !items.length) return;
    const controller = new AbortController();
    fetch("/api/checkout/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: JSON.parse(lineInput) }), signal: controller.signal })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error); return data; })
      .then(data => { setQuote({ ...data, input: lineInput }); setQuoteError(""); performance.mark("checkout-ready"); })
      .catch(error => { if (!controller.signal.aborted) setQuoteError(error.message || "Could not refresh prices."); });
    return () => controller.abort();
  }, [hydrated, items.length, lineInput, quoteVersion]);
  const currentQuote = quote?.input === lineInput ? quote : null;
  const availableMethods = currentQuote?.methods ?? [];
  const paymentMethod = availableMethods.includes(chosenMethod) ? chosenMethod : availableMethods[0] ?? "cod";
  const codT = currentQuote?.totals.cod;
  const advT = currentQuote?.totals.advance_cod;
  const selected = currentQuote?.totals[paymentMethod];
  const cartRequiresAdvance = selected?.requiresAdvance ?? false;
  const advanceItemNames = selected?.lineItems.filter(item => item.requiresAdvance).map(item => item.name) ?? [];
  useEffect(() => { if (paymentMethod !== "cod") void loadRazorpay(); }, [paymentMethod]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (selectedAddressId) setSelectedAddressId(""); // editing by hand un-selects the saved-address chip
    if (error) setError("");
  }

  async function placeOrder() {
    if (submittingRef.current || !selected || !availableMethods.length || quoteError) return;
    const customerError = validateCustomer(form);
    if (customerError) {
      setError(customerError);
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setError("");

    const payload = {
      paymentMethod,
      customer: form,
      expectedTotal: selected.total,
      items: items.map((i) => ({
        slug: i.slug,
        qty: i.qty,
        sizes: i.sizes,
        personalizationText: i.personalizationText,
        personalizationPhotoName: i.personalizationPhotoName,
      })),
    };

    try {
      const fingerprint = JSON.stringify(payload);
      let attempt: { fingerprint: string; key: string } | null = null;
      try { attempt = JSON.parse(sessionStorage.getItem("checkout_attempt") ?? "null"); } catch { /* create a new key */ }
      if (attempt?.fingerprint !== fingerprint) attempt = { fingerprint, key: crypto.randomUUID() };
      sessionStorage.setItem("checkout_attempt", JSON.stringify(attempt));
      const paymentScript = paymentMethod === "cod" ? Promise.resolve(true) : loadRazorpay();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": attempt!.key },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        submittingRef.current = false; setSubmitting(false);
        return;
      }

      try { sessionStorage.setItem(`submitted_${data.orderNumber}`, JSON.stringify(items.map(({ key, qty }) => ({ key, qty })))); } catch { /* Retain cart if storage is unavailable. */ }

      // No online payment needed → order placed.
      if (data.paymentMethod === "cod" || data.settled) {
        router.push(`/thank-you?order=${encodeURIComponent(data.orderNumber)}`);
        return;
      }

      // Prepaid (full) or advance (₹advance) — open Razorpay for the online portion.
      const ok = await paymentScript;
      if (!ok) {
        setError("Couldn't load the payment window. Please try again.");
        submittingRef.current = false; setSubmitting(false);
        return;
      }
      const Razorpay = (window as unknown as { Razorpay: RazorpayCtor }).Razorpay;
      const rzp = new Razorpay({
        key: data.razorpay.keyId,
        order_id: data.razorpay.orderId,
        amount: data.razorpay.amount,
        currency: "INR",
        name: site.name,
        description:
          paymentMethod === "advance_cod"
            ? `Advance for order ${data.orderNumber}`
            : `Order ${data.orderNumber}`,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#5b2a5e" },
        handler: async (response: RazorpayResponse) => {
          try {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderNumber: data.orderNumber, ...response }),
          });
          if (verifyRes.ok) {
            router.push(`/thank-you?order=${encodeURIComponent(data.orderNumber)}`);
          } else {
            setError("Payment could not be verified. If money was deducted, contact us on WhatsApp.");
            submittingRef.current = false; setSubmitting(false);
          }
          } catch { setError("Verification interrupted. Retry with the same order; contact us if payment was deducted."); submittingRef.current = false; setSubmitting(false); }
        },
        modal: { ondismiss: () => { submittingRef.current = false; setSubmitting(false); } },
      });
      rzp.open();
      performance.mark("payment-window-open");
    } catch {
      setError("Network error. Please try again.");
      submittingRef.current = false; setSubmitting(false);
    }
  }

  if (!hydrated) {
    return <div className="container-page min-h-[1200px] py-10" aria-busy="true"><h1 className="text-3xl">Checkout</h1><div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]"><div className="h-[700px] rounded-2xl bg-sand p-6">Loading your delivery form and cart…</div><div className="h-80 rounded-2xl bg-sand p-6">Order summary</div></div></div>;
  }

  if (count === 0) {
    return (
      <div className="container-page min-h-[1200px] flex flex-col items-center py-20 text-center">
        <h1 className="text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-ink">Add a couple set before checking out.</p>
        <Link href="/#featured" className="btn-primary mt-6">Shop couple sets</Link>
      </div>
    );
  }

  const placeLabel =
    paymentMethod === "cod"
      ? "Place Order (COD)"
      : paymentMethod === "advance_cod"
        ? `Pay ${selected ? inr(selected.advancePaid) : ""} advance`
        : `Pay ${selected ? inr(selected.total) : ""}`;

  return (
    <div className="container-page min-h-[1200px] py-10">
      <h1 className="text-3xl sm:text-4xl">Checkout</h1>
      {(!currentQuote || quoteError || !availableMethods.length) && <div role="status" className="mt-4 rounded-xl bg-sand p-4">{quoteError || (!currentQuote ? "Checking current prices and availability..." : "Payment is temporarily unavailable.")} <button type="button" onClick={() => refreshQuote(value => value + 1)} className="underline">Refresh prices</button></div>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Delivery + payment */}
        <div>
          <section>
            <h2 className="text-xl">Delivery details</h2>
            {savedAddresses.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {savedAddresses.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => applyAddress(address)}
                    aria-pressed={selectedAddressId === address.id}
                    className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-left text-xs transition ${
                      selectedAddressId === address.id ? "border-coral bg-coral/10 ring-1 ring-coral" : "border-line bg-sand hover:border-coral/40"
                    }`}
                  >
                    <TruckIcon className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                    <span>
                      <span className="block font-semibold text-charcoal">{address.label}{address.isDefault && " · Default"}</span>
                      <span className="block text-ink">{address.line1}, {address.city} – {address.pincode}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="field-label">Full name</label>
                <input id="name" className="field" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
              </div>
              <div>
                <label htmlFor="phone" className="field-label">Mobile number</label>
                <input id="phone" className="field" inputMode="numeric" maxLength={10} placeholder="10-digit number" value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} autoComplete="tel" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="field-label">Full address</label>
                <textarea id="address" rows={2} className="field" placeholder="House / flat, street, area, landmark" value={form.address} onChange={(e) => set("address", e.target.value)} autoComplete="street-address" />
              </div>
              <div>
                <label htmlFor="city" className="field-label">City</label>
                <input id="city" className="field" value={form.city} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" />
              </div>
              <div>
                <label htmlFor="state" className="field-label">State</label>
                <input id="state" className="field" value={form.state} onChange={(e) => set("state", e.target.value)} autoComplete="address-level1" />
              </div>
              <div>
                <label htmlFor="pincode" className="field-label">Pincode</label>
                <input id="pincode" className="field" inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))} autoComplete="postal-code" />
              </div>
              <div>
                <label htmlFor="email" className="field-label">Email <span className="font-normal text-ink">(optional)</span></label>
                <input id="email" type="email" className="field" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl">Payment method</h2>
            <div className="mt-4 grid gap-3">
              {availableMethods.includes("advance_cod") && (
                <PaymentOption
                  selected={paymentMethod === "advance_cod"}
                  onSelect={() => setPaymentMethod("advance_cod")}
                  title={`Pay ${inr(site.advanceAmount)} advance now + ${advT ? inr(advT.codDue) : ""} on delivery`}
                  subtitle="A small advance secures your personalized order; pay the rest in cash when it arrives."
                />
              )}
              {availableMethods.includes("cod") && (
                <PaymentOption
                  selected={paymentMethod === "cod"}
                  onSelect={() => setPaymentMethod("cod")}
                  title="Cash on Delivery"
                  subtitle={
                    cartRequiresAdvance
                      ? `Pay ${codT ? inr(codT.total) : ""} on delivery. Online ${inr(site.advanceAmount)} advance turns on once payment is enabled.`
                      : `Pay ${codT ? inr(codT.total) : ""} in cash when your order arrives.`
                  }
                />
              )}
              {availableMethods.includes("prepaid") && (
                <PaymentOption
                  selected={paymentMethod === "prepaid"}
                  onSelect={() => setPaymentMethod("prepaid")}
                  title={`Pay fully online and save ${inr(site.prepaidDiscount)}`}
                  subtitle="UPI, cards & netbanking via Razorpay. Ships a little faster."
                />
              )}
            </div>
          </section>
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-2xl border border-line bg-cream p-6 lg:sticky lg:top-24">
          <h2 className="text-lg">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={i.key} className="flex justify-between gap-3 text-sm">
                <span className="text-charcoal">
                  {i.name} <span className="text-ink">× {i.qty}</span>
                  {i.personalizationText && <span className="block text-xs text-ink">“{i.personalizationText}”</span>}
                  {i.personalizationPhotoName && <span className="block text-xs text-ink">Photo: {i.personalizationPhotoName}</span>}
                </span>
                <span className="font-semibold text-charcoal">{inr(selected?.lineItems.find(line => line.slug === i.slug)?.unitPrice !== undefined ? selected.lineItems.find(line => line.slug === i.slug)!.unitPrice * i.qty : i.price * i.qty)}</span>
              </li>
            ))}
          </ul>

          {selected && (
            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink">Subtotal</dt>
                <dd className="font-semibold text-charcoal">{inr(selected.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink">Shipping</dt>
                <dd className="font-semibold text-plum">Free</dd>
              </div>
              {selected.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink">Prepaid discount</dt>
                  <dd className="font-semibold text-plum">−{inr(selected.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-line pt-2">
                <dt className="font-semibold text-charcoal">Order total</dt>
                <dd className="text-lg font-bold text-plum">{inr(selected.total)}</dd>
              </div>

              {/* Advance / COD split */}
              {paymentMethod === "advance_cod" && selected.advancePaid > 0 && (
                <div className="mt-2 space-y-1 rounded-xl bg-night-card p-3">
                  <div className="flex justify-between">
                    <dt className="font-medium text-charcoal">Pay now (advance)</dt>
                    <dd className="font-bold text-plum">{inr(selected.advancePaid)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-charcoal">Pay on delivery</dt>
                    <dd className="font-semibold text-charcoal">{inr(selected.codDue)}</dd>
                  </div>
                </div>
              )}
            </dl>
          )}

          {/* Exact trust explanation shown wherever the advance amount appears */}
          {paymentMethod === "advance_cod" && selected && selected.advancePaid > 0 && (
            <div className="mt-3 rounded-xl border border-gold/40 bg-gold/10 p-3">
              <p className="text-sm leading-relaxed text-charcoal">
                {`Why we ask for ₹${selected.advancePaid} upfront: Your ${advanceItemNames.join(" and ")} is made just for you and personalized only after you order, so we can't resell it if it's returned. This small advance covers that cost. You pay the rest (₹${selected.codDue}) in cash when it's delivered to your door.`}
              </p>
              <p className="mt-2 text-xs font-medium text-ink">
                {`🔒 Secure payment via Razorpay · 🎁 Fully refunded if we're ever unable to deliver your order`}
              </p>
            </div>
          )}

          {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

          <button type="button" onClick={placeOrder} disabled={submitting || !selected || !!quoteError || !availableMethods.length} className="btn-primary mt-4 w-full disabled:opacity-60">
            {submitting ? "Placing order…" : placeLabel}
          </button>

          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-ink">
            <span className="inline-flex items-center gap-1"><ShieldIcon className="h-4 w-4 text-plum" /> Secure payments via Razorpay</span>
            <span className="inline-flex items-center gap-1"><RupeeIcon className="h-4 w-4 text-plum" /> COD available</span>
            <span className="inline-flex items-center gap-1"><CheckIcon className="h-4 w-4 text-plum" /> 7-day damage replacement</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentOption({
  selected,
  onSelect,
  disabled,
  title,
  subtitle,
}: {
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
        selected ? "border-coral bg-coral/10 ring-1 ring-coral" : "border-line bg-sand hover:border-coral/40"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-plum" : "border-line"}`}>
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-coral" />}
      </span>
      <span>
        <span className="block font-semibold text-charcoal">{title}</span>
        <span className="block text-sm text-ink">{subtitle}</span>
      </span>
    </button>
  );
}
