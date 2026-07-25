"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { computeTotals, validateCustomer, type PaymentMethod } from "@/lib/checkout";
import { inr } from "@/lib/format";
import { site } from "@/lib/site";
import { ShieldIcon, RupeeIcon, CheckIcon } from "@/components/ui/icons";

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

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as unknown as { Razorpay?: RazorpayCtor }).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";
const prepaidEnabled = publicKey.length > 0 && !publicKey.includes("PLACEHOLDER");

const emptyForm = { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, count, hydrated } = useCart();

  const [form, setForm] = useState(emptyForm);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totals = useMemo(() => {
    try {
      return computeTotals(
        items.map((i) => ({ slug: i.slug, qty: i.qty })),
        paymentMethod,
      );
    } catch {
      return null;
    }
  }, [items, paymentMethod]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (error) setError("");
  }

  async function placeOrder() {
    const customerError = validateCustomer(form);
    if (customerError) {
      setError(customerError);
      return;
    }
    setSubmitting(true);
    setError("");

    const payload = {
      paymentMethod,
      customer: form,
      items: items.map((i) => ({
        slug: i.slug,
        qty: i.qty,
        personalizationText: i.personalizationText,
        personalizationPhotoName: i.personalizationPhotoName,
      })),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      // Cash on Delivery — order placed, done.
      if (paymentMethod === "cod") {
        router.push(`/thank-you?order=${encodeURIComponent(data.orderNumber)}`);
        return;
      }

      // Prepaid — open Razorpay Checkout.
      const ok = await loadRazorpay();
      if (!ok) {
        setError("Couldn't load the payment window. Please try Cash on Delivery.");
        setSubmitting(false);
        return;
      }
      const Razorpay = (window as unknown as { Razorpay: RazorpayCtor }).Razorpay;
      const rzp = new Razorpay({
        key: data.razorpay.keyId,
        order_id: data.razorpay.orderId,
        amount: data.razorpay.amount,
        currency: "INR",
        name: site.name,
        description: `Order ${data.orderNumber}`,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#5b2a5e" },
        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderNumber: data.orderNumber, ...response }),
          });
          if (verifyRes.ok) {
            router.push(`/thank-you?order=${encodeURIComponent(data.orderNumber)}`);
          } else {
            setError("Payment could not be verified. If money was deducted, contact us on WhatsApp.");
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
      });
      rzp.open();
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return <div className="container-page py-20 text-center text-ink">Loading…</div>;
  }

  if (count === 0) {
    return (
      <div className="container-page flex flex-col items-center py-20 text-center">
        <h1 className="text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-ink">Add a gift before checking out.</p>
        <Link href="/#featured" className="btn-primary mt-6">Shop gifts</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl sm:text-4xl">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Delivery + payment */}
        <div>
          <section>
            <h2 className="text-xl">Delivery details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="name" className="field-label">Full name</label>
                <input id="name" className="field" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
              </div>
              <div className="sm:col-span-1">
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
              <PaymentOption
                selected={paymentMethod === "cod"}
                onSelect={() => setPaymentMethod("cod")}
                title="Cash on Delivery"
                subtitle="Pay in cash when your order arrives."
              />
              <PaymentOption
                selected={paymentMethod === "prepaid"}
                onSelect={() => prepaidEnabled && setPaymentMethod("prepaid")}
                disabled={!prepaidEnabled}
                title={`Pay Online — save ₹${site.prepaidDiscount}`}
                subtitle={
                  prepaidEnabled
                    ? "UPI, cards & netbanking via Razorpay. Ships a little faster."
                    : "Coming soon — online payment activates once test keys are added."
                }
              />
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
                <span className="font-semibold text-charcoal">{inr(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>

          {totals && (
            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink">Subtotal</dt>
                <dd className="font-semibold text-charcoal">{inr(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink">Shipping</dt>
                <dd className="font-semibold text-plum">Free</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink">Prepaid discount</dt>
                  <dd className="font-semibold text-plum">−{inr(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-line pt-2">
                <dt className="font-semibold text-charcoal">Total</dt>
                <dd className="text-xl font-bold text-plum">{inr(totals.total)}</dd>
              </div>
            </dl>
          )}

          {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

          <button type="button" onClick={placeOrder} disabled={submitting} className="btn-primary mt-4 w-full disabled:opacity-60">
            {submitting ? "Placing order…" : paymentMethod === "cod" ? "Place Order (COD)" : `Pay ${totals ? inr(totals.total) : ""}`}
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
        selected ? "border-plum bg-plum/5 ring-1 ring-plum" : "border-line bg-white hover:border-plum/40"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-plum" : "border-line"}`}>
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-plum" />}
      </span>
      <span>
        <span className="block font-semibold text-charcoal">{title}</span>
        <span className="block text-sm text-ink">{subtitle}</span>
      </span>
    </button>
  );
}
