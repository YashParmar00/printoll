"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { validateCustomer, type OrderTotals, type PaymentMethod } from "@/lib/checkout";
import { loadRazorpay } from "@/lib/razorpay-browser";
import { inr } from "@/lib/format";
import { site } from "@/lib/site";
import { products, FALLBACK_PRODUCT_IMAGE } from "@/lib/products";
import { ShieldIcon, RupeeIcon, CheckIcon, TruckIcon, LockIcon, PenIcon, PlusIcon, ChevronLeftIcon, ArrowRightIcon } from "@/components/ui/icons";

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

const STEPS = ["Address", "Payment", "Review"] as const;
type Step = 0 | 1 | 2;

const emptyForm = { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, count, hydrated } = useCart();

  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState(emptyForm);
  const [chosenMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [error, setError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  function applyAddress(address: SavedAddress, email?: string) {
    setSelectedAddressId(address.id);
    setShowAddressForm(false);
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
        if (!data?.loggedIn) { router.replace(`/account/login?next=${encodeURIComponent("/checkout")}`); return; }
        setSavedAddresses(data.addresses ?? []);
        const preferred = data.addresses?.find((a: SavedAddress) => a.isDefault) ?? data.addresses?.[0];
        if (preferred) applyAddress(preferred, data.email);
        else { if (data.email) setForm((f) => ({ ...f, email: data.email })); setShowAddressForm(true); }
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
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
  const prepaidT = currentQuote?.totals.prepaid;
  const selected = currentQuote?.totals[paymentMethod];
  const cartRequiresAdvance = selected?.requiresAdvance ?? false;
  const advanceItemNames = selected?.lineItems.filter(item => item.requiresAdvance).map(item => item.name) ?? [];
  useEffect(() => { if (paymentMethod !== "cod") void loadRazorpay(); }, [paymentMethod]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (selectedAddressId) setSelectedAddressId(""); // editing by hand un-selects the saved-address chip
    if (error) setError("");
  }

  function goToPayment() {
    const customerError = validateCustomer(form);
    if (customerError) { setAddressError(customerError); return; }
    setAddressError("");
    setStep(1);
  }

  async function placeOrder() {
    if (submittingRef.current || !selected || !availableMethods.length || quoteError) return;
    const customerError = validateCustomer(form);
    if (customerError) {
      setError(customerError);
      setStep(0);
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
        theme: { color: "#d2603f" },
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

  if (!hydrated || !authChecked) {
    return (
      <div className="container-page min-h-[1200px] max-w-lg py-6" aria-busy="true">
        <div className="h-8 w-40 animate-pulse rounded bg-sand" />
        <div className="mt-6 h-14 animate-pulse rounded-2xl bg-sand" />
        <div className="mt-4 h-64 animate-pulse rounded-2xl bg-sand" />
        <div className="mt-4 h-40 animate-pulse rounded-2xl bg-sand" />
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="container-page flex min-h-[720px] flex-col items-center py-20 text-center">
        <h1 className="text-3xl text-white">Your cart is empty</h1>
        <p className="mt-2 text-ink">Add something to your cart before checking out.</p>
        <Link href="/category" className="btn-primary mt-6">Start shopping</Link>
      </div>
    );
  }

  const placeLabel =
    paymentMethod === "cod"
      ? `Place Order · ${selected ? inr(selected.total) : ""}`
      : paymentMethod === "advance_cod"
        ? `Pay ${selected ? inr(selected.advancePaid) : ""} advance`
        : `Pay ${selected ? inr(selected.total) : ""}`;

  return (
    <div className="min-h-[1200px] bg-paper pb-28 sm:pb-10">
      <div className="container-page max-w-lg py-5 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => (step === 0 ? router.back() : setStep((s) => (s - 1) as Step))}
              aria-label="Back"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-white transition hover:bg-white/5"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <span className="text-base font-bold text-white">Checkout</span>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 text-right">
            <LockIcon className="h-3.5 w-3.5 shrink-0 text-coral" />
            <span className="leading-tight">
              <span className="block text-[11px] font-semibold text-white">Secure Checkout</span>
              <span className="block text-[10px] text-ink">Safe &amp; encrypted</span>
            </span>
          </span>
        </div>

        {/* Stepper */}
        <div className="mt-6 flex items-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => i < step && setStep(i as Step)}
                disabled={i > step}
                className="flex flex-col items-center gap-1.5"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${
                    i < step
                      ? "bg-coral text-white"
                      : i === step
                        ? "bg-coral text-white ring-4 ring-coral/25"
                        : "bg-sand text-ink"
                  }`}
                >
                  {i < step ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={`text-[11px] font-semibold ${i <= step ? "text-white" : "text-ink"}`}>{label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <span className={`mx-1.5 mb-4 h-0.5 flex-1 rounded ${i < step ? "bg-coral" : "bg-sand"}`} />
              )}
            </div>
          ))}
        </div>

        {(!currentQuote || quoteError || !availableMethods.length) && (
          <div role="status" className="mt-5 rounded-xl border border-line bg-sand p-3.5 text-sm text-ink">
            {quoteError || (!currentQuote ? "Checking current prices and availability…" : "Payment is temporarily unavailable.")}{" "}
            <button type="button" onClick={() => refreshQuote((value) => value + 1)} className="font-semibold text-coral underline">Refresh prices</button>
          </div>
        )}

        {/* Step 1: Address */}
        {step === 0 && (
          <section className="mt-6">
            <h2 className="text-base font-bold text-white">Delivery address</h2>
            <p className="mt-0.5 text-xs text-ink">Where should we deliver your order?</p>

            {savedAddresses.length > 0 && (
              <div className="mt-3.5 space-y-2.5">
                {savedAddresses.map((address) => {
                  const isSelected = selectedAddressId === address.id && !showAddressForm;
                  return (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() => applyAddress(address)}
                      aria-pressed={isSelected}
                      className={`flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition ${
                        isSelected ? "border-coral bg-coral/[0.08] ring-1 ring-coral" : "border-line bg-night-card hover:border-coral/40"
                      }`}
                    >
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? "border-coral" : "border-line"}`}>
                        {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-coral" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-white">{address.label}{address.isDefault && " (Default)"}</span>
                          <Link
                            href="/account/addresses"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-coral/30 px-2 py-1 text-[11px] font-semibold text-coral"
                          >
                            <PenIcon className="h-3 w-3" /> Edit
                          </Link>
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-ink">{address.fullName}</span>
                        <span className="block text-xs leading-relaxed text-ink">{address.line1}{address.line2 ? `, ${address.line2}` : ""}</span>
                        <span className="block text-xs leading-relaxed text-ink">{address.city}, {address.state} – {address.pincode}</span>
                        <span className="block text-xs leading-relaxed text-ink">+91 {address.phone}</span>
                      </span>
                    </button>
                  );
                })}
                {!showAddressForm && (
                  <button
                    type="button"
                    onClick={() => { setShowAddressForm(true); setSelectedAddressId(""); setForm(emptyForm); }}
                    className="flex w-full items-center gap-2 rounded-2xl border border-dashed border-line p-3.5 text-sm font-semibold text-ink transition hover:border-coral/40 hover:text-white"
                  >
                    <PlusIcon className="h-4 w-4" /> Add new address
                  </button>
                )}
              </div>
            )}

            {showAddressForm && (
              <div className="mt-4 grid gap-3.5 rounded-2xl border border-line bg-night-card p-4">
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="field-label">Full name</label>
                    <input id="name" className="field" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="field-label">Mobile number <span className="text-coral">*</span></label>
                    <input id="phone" required className="field" inputMode="numeric" maxLength={10} placeholder="10-digit number" value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} autoComplete="tel" />
                  </div>
                </div>
                <div>
                  <label htmlFor="address" className="field-label">Full address</label>
                  <textarea id="address" rows={2} className="field" placeholder="House / flat, street, area, landmark" value={form.address} onChange={(e) => set("address", e.target.value)} autoComplete="street-address" />
                </div>
                <div className="grid gap-3.5 sm:grid-cols-3">
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
                </div>
              </div>
            )}

            <div className="mt-5">
              <h3 className="text-sm font-bold text-white">Contact details</h3>
              <p className="mt-0.5 text-xs text-ink">We&apos;ll use this to share order updates.</p>
              <div className="mt-3">
                <label htmlFor="email" className="field-label">Email <span className="font-normal text-ink">(optional)</span></label>
                <input id="email" type="email" className="field" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
              </div>
            </div>

            {addressError && <p className="mt-4 text-sm font-medium text-red-400">{addressError}</p>}

            <button type="button" onClick={goToPayment} className="btn-primary mt-6 w-full">
              Continue to Payment <ArrowRightIcon className="h-4 w-4" />
            </button>
          </section>
        )}

        {/* Step 2: Payment */}
        {step === 1 && (
          <section className="mt-6">
            <h2 className="text-base font-bold text-white">Payment method</h2>
            <p className="mt-0.5 text-xs text-ink">Choose how you want to pay.</p>
            <div className="mt-3.5 grid gap-2.5">
              {availableMethods.includes("advance_cod") && (
                <PaymentOption
                  selected={paymentMethod === "advance_cod"}
                  onSelect={() => setPaymentMethod("advance_cod")}
                  title={`Pay ${inr(site.advanceAmount)} advance now`}
                  subtitle={`+ ${advT ? inr(advT.codDue) : ""} on delivery. Secures your personalized order.`}
                />
              )}
              {availableMethods.includes("cod") && (
                <PaymentOption
                  selected={paymentMethod === "cod"}
                  onSelect={() => setPaymentMethod("cod")}
                  title="Cash on Delivery"
                  subtitle={
                    cartRequiresAdvance
                      ? `Pay ${codT ? inr(codT.total) : ""} on delivery. Online advance turns on once payment is enabled.`
                      : `Pay ${codT ? inr(codT.total) : ""} in cash when your order arrives.`
                  }
                />
              )}
              {availableMethods.includes("prepaid") && (
                <PaymentOption
                  selected={paymentMethod === "prepaid"}
                  onSelect={() => setPaymentMethod("prepaid")}
                  title="Pay online"
                  subtitle={`UPI, cards & netbanking via Razorpay. Pay ${prepaidT ? inr(prepaidT.total) : ""} now.`}
                  badge={`Save ${inr(site.prepaidDiscount)}`}
                />
              )}
            </div>

            {paymentMethod === "advance_cod" && selected && selected.advancePaid > 0 && (
              <div className="mt-4 rounded-2xl border border-gold/30 bg-gold/10 p-3.5">
                <p className="text-xs leading-relaxed text-white/90">
                  {`Why we ask for ₹${selected.advancePaid} upfront: your ${advanceItemNames.join(" and ")} is personalized just for you, so we can't resell it if it's returned. Pay the rest (${inr(selected.codDue)}) in cash on delivery.`}
                </p>
              </div>
            )}

            <button type="button" onClick={() => setStep(2)} className="btn-primary mt-6 w-full">
              Continue to Review <ArrowRightIcon className="h-4 w-4" />
            </button>
          </section>
        )}

        {/* Step 3: Review */}
        {step === 2 && (
          <section className="mt-6">
            <div className="rounded-2xl border border-line bg-night-card p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">Order summary</h2>
                <span className="text-xs text-ink">{count} item{count === 1 ? "" : "s"}</span>
              </div>

              <ul className="mt-3.5 space-y-3">
                {items.map((i) => {
                  const product = products.find((p) => p.slug === i.slug);
                  const image = product?.imageUrls?.[0] ?? product?.imageUrl ?? FALLBACK_PRODUCT_IMAGE;
                  const compareAt = product?.compareAtPrice;
                  const unitPrice = selected?.lineItems.find((line) => line.slug === i.slug)?.unitPrice ?? i.price;
                  const savePct = compareAt && compareAt > unitPrice ? Math.round(100 - (unitPrice / compareAt) * 100) : 0;
                  return (
                    <li key={i.key} className="flex gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand">
                        <Image src={image} alt={i.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-semibold text-white">{i.name}</p>
                        {i.personalizationText && <p className="truncate text-xs text-ink">&ldquo;{i.personalizationText}&rdquo;</p>}
                        <p className="mt-0.5 text-xs text-ink">Qty: {i.qty}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-white">{inr(unitPrice * i.qty)}</p>
                        {compareAt && compareAt > unitPrice && (
                          <p className="flex items-center justify-end gap-1">
                            <span className="strike text-[11px] text-ink">{inr(compareAt * i.qty)}</span>
                            {savePct > 0 && <span className="rounded bg-[#11291B] px-1 py-0.5 text-[9px] font-bold text-[#2CCB68]">Save {savePct}%</span>}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {selected && (
                <dl className="mt-4 space-y-2 border-t border-line pt-3.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink">Subtotal</dt>
                    <dd className="font-semibold text-white">{inr(selected.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink">Shipping</dt>
                    <dd className="rounded-md bg-[#11291B] px-2 py-0.5 text-xs font-bold text-[#2CCB68]">FREE</dd>
                  </div>
                  {selected.discount > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-ink">Prepaid discount</dt>
                      <dd className="font-semibold text-[#2CCB68]">−{inr(selected.discount)}</dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-line pt-3">
                    <dt className="text-base font-bold text-white">Total</dt>
                    <dd className="text-xl font-extrabold text-white">{inr(selected.total)}</dd>
                  </div>
                  {paymentMethod === "advance_cod" && selected.advancePaid > 0 && (
                    <div className="mt-1 space-y-1.5 rounded-xl bg-sand p-3">
                      <div className="flex justify-between">
                        <dt className="font-medium text-white">Pay now (advance)</dt>
                        <dd className="font-bold text-coral">{inr(selected.advancePaid)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-white">Pay on delivery</dt>
                        <dd className="font-semibold text-white">{inr(selected.codDue)}</dd>
                      </div>
                    </div>
                  )}
                </dl>
              )}

              {paymentMethod !== "prepaid" && availableMethods.includes("prepaid") && prepaidT && (
                <button
                  type="button"
                  onClick={() => { setPaymentMethod("prepaid"); setStep(1); }}
                  className="mt-4 flex w-full items-center gap-3 rounded-xl border border-[#2CCB68]/25 bg-[#11291B] p-3 text-left"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2CCB68]/20 text-[#2CCB68]">
                    <RupeeIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-[#a5eabf]">Pay online &amp; save {inr(site.prepaidDiscount)}</span>
                    <span className="block text-[11px] text-[#a5eabf]/80">Use online payment to get an instant discount</span>
                  </span>
                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-[#2CCB68]" />
                </button>
              )}
            </div>

            <div className="mt-3.5 rounded-2xl border border-line bg-night-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Delivery details</h3>
                <button type="button" onClick={() => setStep(0)} className="inline-flex items-center gap-1 text-xs font-semibold text-coral">
                  <PenIcon className="h-3 w-3" /> Edit
                </button>
              </div>
              <div className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-ink">
                <TruckIcon className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                <span>
                  <span className="block font-semibold text-white">{form.name}</span>
                  {form.address}, {form.city}, {form.state} – {form.pincode}
                  <span className="block">+91 {form.phone}</span>
                </span>
              </div>
            </div>

            <div className="mt-3.5 rounded-2xl border border-line bg-night-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Payment method</h3>
                <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1 text-xs font-semibold text-coral">
                  <PenIcon className="h-3 w-3" /> Edit
                </button>
              </div>
              <p className="mt-2 text-xs text-ink">
                {paymentMethod === "cod" && "Cash on Delivery"}
                {paymentMethod === "advance_cod" && `${inr(site.advanceAmount)} advance online + rest on delivery`}
                {paymentMethod === "prepaid" && "Pay fully online"}
              </p>
            </div>

            <label className="mt-4 flex items-start gap-2.5 text-xs text-ink">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-line bg-sand accent-coral" />
              <span>
                I agree to the <Link href="/terms" className="font-semibold text-coral underline underline-offset-2">Terms &amp; Conditions</Link> and{" "}
                <Link href="/privacy-policy" className="font-semibold text-coral underline underline-offset-2">Privacy Policy</Link>.
              </span>
            </label>

            {error && <p className="mt-4 text-sm font-medium text-red-400">{error}</p>}

            <button
              type="button"
              onClick={placeOrder}
              disabled={submitting || !selected || !!quoteError || !availableMethods.length || !agreed}
              className="btn-primary mt-4 w-full disabled:opacity-50"
            >
              {submitting ? "Placing order…" : <><LockIcon className="h-4 w-4" /> {placeLabel}</>}
            </button>

            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4">
              <Trust icon={<TruckIcon className="h-4 w-4" />} title="Free shipping across India" />
              <Trust icon={<ShieldIcon className="h-4 w-4" />} title="7-day damage replacement" />
              <Trust icon={<LockIcon className="h-4 w-4" />} title="Secure payments" />
            </div>
          </section>
        )}
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
  badge,
}: {
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition ${
        selected ? "border-coral bg-coral/[0.08] ring-1 ring-coral" : "border-line bg-night-card hover:border-coral/40"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-coral" : "border-line"}`}>
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-coral" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-semibold text-white">{title}</span>
          {badge && <span className="rounded-md bg-[#11291B] px-1.5 py-0.5 text-[10px] font-bold text-[#2CCB68]">{badge}</span>}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-ink">{subtitle}</span>
      </span>
    </button>
  );
}

function Trust({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="text-center text-[10px] leading-tight text-ink">
      <span className="mx-auto mb-1 flex w-fit text-coral">{icon}</span>
      {title}
    </div>
  );
}
