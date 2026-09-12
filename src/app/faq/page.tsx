import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers on sizing, delivery, Cash on Delivery, the ₹99 advance on printed sets, personalization, returns and tracking.",
};

// The ₹advance FAQ below mirrors the Return & Refund policy wording exactly.
const faqs: { q: string; a: string }[] = [
  {
    q: "What comes in a set?",
    a: "Two T-shirts, one for each of you, printed with the same design and personalized with the names, initials or date you type on the product page. Both tees ship together in one box.",
  },
  {
    q: "How do sizes work? Can we pick different ones?",
    a: "Yes. Every set has two separate size choices, so one of you can take an M and the other an XL. All tees are unisex fit, XS to XXL. If you're between sizes, size up or message us on WhatsApp and we'll help.",
  },
  {
    q: "How long will delivery take?",
    a: "Most sets are delivered within 5–7 days across India. Since every set is printed to order, the exact delivery date is shown on each product page and at checkout.",
  },
  {
    q: "Do you offer Cash on Delivery?",
    a: "Yes, with a small twist: because every set is printed with your names, we take a ₹99 advance online and you pay the rest in cash on delivery (see below).",
  },
  {
    q: `Why do printed sets need a ₹${site.advanceAmount} advance?`,
    a: `Since every set is printed specially for you, we ask for a small ₹${site.advanceAmount} advance before we start printing. A personalized set can't be resold if it's returned, so this advance covers our production cost. You pay the remaining amount in cash when your order is delivered. If we're ever unable to deliver your order, your ₹${site.advanceAmount} is fully refunded within 5–7 business days.`,
  },
  {
    q: "How does personalization work?",
    a: "On the product page, type the names, initials or date you want printed. You'll see it appear on both tees in the live preview. We print exactly what you preview, so please double-check the spelling and format.",
  },
  {
    q: "Can I return a set?",
    a: "Because sets are printed just for you, we can't accept change-of-mind or wrong-size returns. We do replace any set that arrives damaged, defective, or wrongly printed on our part. Just message us within 7 days with a photo.",
  },
  {
    q: "Will the print fade or crack?",
    a: "Not if you treat it normally. We use DTF/DTG inks on 180 GSM soft-washed cotton. Wash inside out in cold water, skip the dryer, and don't iron directly over the print.",
  },
  {
    q: "How do I track my order?",
    a: "We share updates on WhatsApp, and you can check any time on our Track Order page using your order number and phone number.",
  },
  {
    q: "Where do you deliver?",
    a: "We deliver across India. Some remote pincodes may take a little longer.",
  },
  {
    q: "How do I contact you?",
    a: `Message us on WhatsApp or email ${site.email}. We reply within 2 hours, ${site.supportHours}.`,
  },
];

export default function FAQPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <p className="eyebrow">Help</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Frequently asked questions</h1>
      <p className="mt-3 text-lg text-ink">
        Everything about sizing, delivery, payment, printing and returns.
      </p>

      <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-night-card">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-noir">
              {f.q}
              <span className="shrink-0 text-2xl leading-none text-coral transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-ink">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
