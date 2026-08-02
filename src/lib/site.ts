/**
 * Central site configuration. Anything a founder needs to change without
 * touching components lives here. TODOs mark real values Yash must fill in.
 */
export const site = {
  name: "AuraaMarts",
  legalName: "AuraaMarts",
  tagline: "Gifts They'll Never Forget — Personalized in India",
  description:
    "Personalized gifts made in India — engraved name necklaces, custom photo mugs & frames. COD available, delivered in 5–7 days, 7-day damage replacement.",
  url: "https://auraamarts.com",

  // Customer-facing signature / support persona — brand name, never a personal name.
  founder: "Team AuraaMarts",
  // Public support email shown to customers.
  // TODO(Yash): before launch, set up FREE forwarding (Cloudflare Email Routing
  // or ImprovMX) hello@auraamarts.com -> ownerEmail, or customer mail will bounce.
  email: "hello@auraamarts.com",
  // Private inbox that receives order / Razorpay / Resend notifications. Never shown publicly.
  ownerEmail: "yashparmar0084@gmail.com",
  phoneDisplay: "+91 85298 93292",
  // WhatsApp number: digits only, with country code, no + or spaces.
  whatsappNumber: "918529893292",
  supportHours: "10 AM – 8 PM IST",
  addressLine: "Mangaldhara Complex, Alkapuri, Vadodara, Gujarat, India",

  social: {
    instagram: "https://instagram.com/auraamarts",
  },

  // Raksha Bandhan 2026 falls on Sunday, 9 Aug 2026 (confirmed by founder).
  rakhiDate: "2026-08-09T00:00:00+05:30",

  // Store-wide promises used across the UI (kept honest per RESEARCH.md §B).
  deliveryDays: 6, // "order today, delivery by" = today + 6 days
  prepaidDiscount: 50, // ₹ off for paying full amount online (RTO reducer)
  advanceAmount: 99, // ₹ advance collected online for items with requiresAdvance; rest is COD
} as const;

/** Build a wa.me deep link, optionally with a prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
