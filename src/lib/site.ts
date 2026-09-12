/**
 * Central site configuration. Anything a founder needs to change without
 * touching components lives here. TODOs mark real values Yash must fill in.
 */
export const site = {
  name: "Printoll",
  legalName: "Printoll",
  tagline: "Custom Prints Made Personal",
  description:
    "Custom printed tees, matching styles and thoughtful gifts made personal for every story. COD available and delivered across India.",
  url: "https://pairwear.in",

  // Customer-facing signature / support persona — brand name, never a personal name.
  founder: "Team Printoll",
  // Public support email shown to customers.
  // TODO(Yash): before launch, set up FREE forwarding (Cloudflare Email Routing
  // or ImprovMX) hello@pairwear.in -> ownerEmail, or customer mail will bounce.
  email: "hello@pairwear.in",
  // Private inbox that receives order / Razorpay / Resend notifications. Never shown publicly.
  ownerEmail: "yashparmar0084@gmail.com",
  phoneDisplay: "+91 85298 93292",
  // WhatsApp number: digits only, with country code, no + or spaces.
  whatsappNumber: "918529893292",
  supportHours: "10 AM – 8 PM IST",
  addressLine: "Mangaldhara Complex, Alkapuri, Vadodara, Gujarat, India",

  social: {
    instagram: "https://instagram.com/pairwear.in",
  },

  // Featured-occasion countdown on the homepage.
  // TODO(Yash): roll this forward each year (or swap to the next big couple date).
  occasionName: "Valentine's Day",
  occasionDate: "2027-02-14T00:00:00+05:30",

  // Honest social-proof line used in the hero. Update as real order count grows.
  couplesServed: "2,000+",

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
