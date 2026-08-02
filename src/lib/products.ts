/**
 * Launch catalogue (seed data). In a later milestone this moves behind
 * Prisma/Postgres, but the shape here mirrors the future Product model so the
 * swap is mechanical.
 *
 * TODO(Yash §D): confirm final SKUs, prices and the supplier's own SKU codes.
 * `supplierSku` is intentionally GENERIC — no supplier has been chosen yet, so
 * nothing Qikink-specific is hardcoded anywhere.
 */

export type PersonalizationType = "none" | "text" | "photo" | "both";

/** Drives the live preview mockup silhouette + print area. */
export type ProductShape = "pendant" | "mug" | "frame" | "mat";

export interface ProductFaq {
  q: string;
  a: string;
}

export interface Product {
  slug: string;
  name: string;
  /** Short emotional hook shown under the name on cards. */
  tagline: string;
  price: number; // selling price, whole ₹
  compareAtPrice: number; // struck anchor price, whole ₹
  category: "personalized" | "wellness";
  personalization: PersonalizationType;
  shape: ProductShape;
  /** Generic fulfilment SKU. Supplier not yet chosen — do NOT hardcode Qikink. */
  supplierSku: string;
  /**
   * Require a small online advance (rest as COD) instead of full COD.
   * Personalized items can't be resold if returned, so they default to true;
   * non-personalized (e.g. acupressure mat) stay full COD. Per-product config
   * (not a hardcoded rule) so it can be flipped later.
   */
  requiresAdvance: boolean;
  occasions: string[];
  rating: number; // seed ratings are placeholders until real reviews land
  reviews: number;
  /** Emotion-first description, one string per paragraph. */
  description: string[];
  /** Benefit-led "what's included" bullets. */
  highlights: string[];
  faqs: ProductFaq[];
  /** Placeholder gradient stops (from → to) until real mockups replace them. */
  accent: [string, string];
  badge?: string;
}

export const products: Product[] = [
  {
    slug: "engraved-name-necklace",
    name: "Engraved Name Necklace",
    tagline: "Her name, worn close to the heart.",
    price: 799,
    compareAtPrice: 1299,
    category: "personalized",
    personalization: "text",
    shape: "pendant",
    supplierSku: "AM-NECK-ENGRAVE-01",
    requiresAdvance: true,
    occasions: ["Rakhi", "Birthday", "Anniversary"],
    rating: 4.8,
    reviews: 0,
    description: [
      "Some gifts get used once and forgotten. A name worn around the neck isn't one of them. Our Engraved Name Necklace turns a single word — her name, your nickname for her, a date you both remember — into something she'll reach for every single day.",
      "Each piece is engraved to order in a clean, modern script on a gold-tone stainless steel bar that keeps its shine — no green necks, no fading. It arrives in a gift-ready box, so you can hand it over exactly as it should be: ready to open.",
    ],
    highlights: [
      "Gold-tone stainless steel — won't tarnish or fade",
      "Engraved with any name, up to 12 characters",
      "Adjustable 45–50 cm chain",
      "Arrives in a gift-ready box",
      "Cash on Delivery available across India",
    ],
    faqs: [
      {
        q: "How do I personalize it?",
        a: "Type the name in the box on this page and you'll see it on the necklace instantly. That exact spelling is what we engrave — so double-check it before you order.",
      },
      {
        q: "When will it arrive?",
        a: "We make each necklace to order and deliver in 5–7 days across India. The delivery date is shown on this page before you add to cart.",
      },
      {
        q: "What if it arrives damaged?",
        a: "We replace any item that reaches you damaged or defective within 7 days — just message us on WhatsApp with a photo.",
      },
    ],
    accent: ["#7c4b7f", "#d4a947"],
    badge: "Bestseller",
  },
  {
    slug: "custom-photo-mug",
    name: "Custom Photo Mug",
    tagline: "Their favourite memory, with every morning chai.",
    price: 499,
    compareAtPrice: 799,
    category: "personalized",
    personalization: "photo",
    shape: "mug",
    supplierSku: "AM-MUG-PHOTO-01",
    requiresAdvance: true,
    occasions: ["Birthday", "Anniversary"],
    rating: 4.9,
    reviews: 0,
    description: [
      "A photo sitting in your phone gets scrolled past. The same photo on a mug they hold every morning? That gets noticed — every single day.",
      "Upload your favourite picture and we print it edge-to-edge, in full colour, on a sturdy 330 ml ceramic mug that's safe for the microwave and dishwasher. It's the kind of small, thoughtful gift that keeps saying 'I was thinking of you' long after the occasion has passed.",
    ],
    highlights: [
      "330 ml ceramic mug — microwave & dishwasher safe",
      "Your photo printed edge-to-edge in full colour",
      "Fade-resistant, long-lasting print",
      "Upload any JPG, PNG or WebP",
      "Gift-ready packaging · COD available",
    ],
    faqs: [
      {
        q: "How do I add my photo?",
        a: "Upload it in the box on this page and you'll see it on the mug instantly. Use a clear, high-resolution photo for the sharpest print.",
      },
      {
        q: "What if my photo looks low quality?",
        a: "We check every photo before printing and message you on WhatsApp if anything looks blurry — we'd rather get it right than print something you won't love.",
      },
      {
        q: "When will it arrive?",
        a: "Made to order and delivered in 5–7 days across India. Cash on Delivery is available.",
      },
    ],
    accent: ["#5b2a5e", "#7c4b7f"],
  },
  {
    slug: "custom-photo-frame",
    name: "Custom Photo Frame",
    tagline: "A moment they'll want on the wall forever.",
    price: 899,
    compareAtPrice: 1499,
    category: "personalized",
    personalization: "photo",
    shape: "frame",
    supplierSku: "AM-FRAME-PHOTO-01",
    requiresAdvance: true,
    occasions: ["Anniversary", "Birthday"],
    rating: 4.8,
    reviews: 0,
    description: [
      "The best moments deserve more than a camera roll. Our Custom Photo Frame gives one of yours a permanent place on the shelf, the desk, or the wall — somewhere it'll catch their eye and make them smile mid-day.",
      "Upload your photo, see it framed instantly on this page, and we'll print and mount it ready to display. It's a gift that turns a memory into something they can actually hold onto.",
    ],
    highlights: [
      "Photo printed and mounted, ready to display",
      "Upload any JPG, PNG or WebP",
      "Rich, fade-resistant colour",
      "Sturdy frame with a clean finish",
      "Gift-ready · COD available",
    ],
    faqs: [
      {
        q: "How do I add my photo?",
        a: "Upload it in the box on this page and you'll see it in the frame instantly. A high-resolution photo prints best.",
      },
      {
        q: "When will it arrive?",
        a: "Made to order and delivered in 5–7 days across India, with the delivery date shown before you add to cart.",
      },
      {
        q: "What if it arrives damaged?",
        a: "Message us on WhatsApp with a photo within 7 days and we'll replace any item that arrives damaged or defective.",
      },
    ],
    accent: ["#b28623", "#e7cb82"],
  },
  {
    slug: "acupressure-mat",
    name: "Acupressure Mat",
    tagline: "10 minutes a day to unknot the whole body.",
    price: 999,
    compareAtPrice: 1799,
    category: "wellness",
    personalization: "none",
    shape: "mat",
    supplierSku: "AM-WELL-ACUMAT-01",
    requiresAdvance: false,
    occasions: [],
    rating: 4.7,
    reviews: 0,
    description: [
      "Ten minutes on your back, thousands of tiny points doing the work — that's the whole idea. The Acupressure Mat is the simplest way to unknot a tense back, shoulders and neck at the end of a long day, no appointment required.",
      "Lie down, breathe, and let the pressure points do what they've done for centuries. Most people feel the warmth spread in the first few minutes — and come back to it every evening.",
    ],
    highlights: [
      "Thousands of acupressure points for full-back relief",
      "Just 10–20 minutes a day",
      "Lightweight — roll it up and take it anywhere",
      "Comes with a carry bag",
      "COD available across India",
    ],
    faqs: [
      {
        q: "How do I use it?",
        a: "Lie back on the mat for 10–20 minutes a day. It feels intense for the first minute, then settles into a warm, relaxing pressure. Start over a thin t-shirt if you're new to it.",
      },
      {
        q: "Is it safe for everyone?",
        a: "Most people are fine, but if you're pregnant, have a skin condition, or a heart condition, please check with your doctor first.",
      },
      {
        q: "When will it arrive?",
        a: "Delivered in 5–7 days across India. Cash on Delivery is available.",
      },
    ],
    accent: ["#431f46", "#5b2a5e"],
    badge: "Wellness",
  },
];

export const featuredProducts = products;

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function relatedProducts(slug: string, limit = 3): Product[] {
  return products.filter((p) => p.slug !== slug).slice(0, limit);
}
