import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers on delivery, Cash on Delivery, the advance on personalized items, personalization, returns and tracking.",
};

// The ₹advance FAQ below uses the founder's final approved wording
// (kept consistent with the Return & Refund policy and checkout explanation).
const faqs: { q: string; a: string }[] = [
  {
    q: "How long will delivery take?",
    a: "Most orders are delivered within 5–7 days across India. Since personalized items are made to order, the exact delivery date is shown on each product page and at checkout.",
  },
  {
    q: "Do you offer Cash on Delivery?",
    a: "Yes. The acupressure mat is available as full Cash on Delivery. For personalized items we take a small advance online and you pay the rest in cash on delivery (see below).",
  },
  {
    q: "Why do personalized items need a ₹99 advance?",
    a: "Since gifts like the Engraved Name Necklace, Custom Photo Frame, Magic Photo Mug, and Custom Photo Mug are made specially for you, we ask for a small ₹99 advance before we start personalizing your order. A customized item can't be resold if it's returned, so this advance covers our production cost — you pay the remaining amount in cash when your order is delivered. If we're ever unable to deliver your order, your ₹99 is fully refunded within 5–7 business days.",
  },
  {
    q: "How does personalization work?",
    a: "On the product page, type the name to engrave or upload your photo — you'll see a live preview on the product before you buy. We make exactly what you preview, so please double-check the spelling and photo.",
  },
  {
    q: "Can I return a personalized item?",
    a: "Because personalized items are made just for you, we can't accept change-of-mind returns. We do replace any item that arrives damaged, defective, or wrongly personalized on our part — just message us within 7 days with a photo.",
  },
  {
    q: "How do I track my order?",
    a: "We share updates on WhatsApp, and you can check any time on our Track Order page using your order number and phone number.",
  },
  {
    q: "What if my item arrives damaged?",
    a: "You're covered by our 7-Day Damage Replacement Guarantee. Send us a photo on WhatsApp within 7 days of delivery and we'll replace it free.",
  },
  {
    q: "Is my photo and personal data safe?",
    a: "Yes. Photos are used only to make your gift, and payments are handled securely by Razorpay — we never store your card or bank details. See our Privacy Policy for more.",
  },
  {
    q: "Where do you deliver?",
    a: "We deliver across India. Some remote pincodes may take a little longer.",
  },
  {
    q: "How do I contact you?",
    a: `Message us on WhatsApp or email ${site.email} — we reply within 2 hours, ${site.supportHours}.`,
  },
];

export default function FAQPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <p className="eyebrow">Help</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Frequently asked questions</h1>
      <p className="mt-3 text-lg text-ink">Everything about delivery, payment, personalization and returns.</p>

      <div className="mt-8 divide-y divide-line rounded-2xl border border-line">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-charcoal">
              {f.q}
              <span className="shrink-0 text-2xl leading-none text-plum transition-transform group-open:rotate-45">
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
