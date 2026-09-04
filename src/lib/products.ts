/**
 * Launch catalogue — 4 real personalized products sourced from Qikink
 * (verified from their dashboard catalog + pricing sheet) plus the wellness mat.
 * In a later milestone this moves behind Prisma/Postgres; the shape here mirrors
 * the future Product model so the swap is mechanical.
 *
 * `supplierSku` holds the Qikink style code. UP11 (necklace) and AF22 (frame)
 * are confirmed; the two mug codes are placeholders pending the sample order.
 * Qikink base costs are noted per product for margin reference (some unconfirmed
 * until a sample order verifies them).
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
  category: string;
  personalization: PersonalizationType;
  shape: ProductShape;
  /** Supplier SKU / style code (Qikink). Two mug codes are placeholders for now. */
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
  /** Optional hosted product photo, set from the admin panel. */
  imageUrl?: string;
  /** Up to five admin-managed gallery images; the first is the main product image. */
  imageUrls?: string[];
  sortOrder?: number;
  active?: boolean;
}

export const products: Product[] = [
  {
    // Qikink "Bar Pendant" (UP11) — cuboid bar, silver. Base cost ~₹110
    // (before engraving charge; unconfirmed until a sample order verifies).
    slug: "engraved-name-necklace",
    name: "Engraved Name Necklace",
    tagline: "Her name, worn close to the heart.",
    price: 549,
    compareAtPrice: 899,
    category: "personalized",
    personalization: "text",
    shape: "pendant",
    supplierSku: "UP11",
    requiresAdvance: true,
    occasions: ["Rakhi", "Birthday", "Anniversary"],
    rating: 4.8,
    reviews: 0,
    description: [
      "Some gifts get used once and forgotten. A name worn around the neck isn't one of them. Our Engraved Name Necklace turns a single word — her name, your nickname for her, a date you both hold onto — into something she reaches for every single day.",
      "Each sleek silver bar pendant is engraved to order in a clean, modern script and arrives in a gift-ready box — ready to hand over exactly as it should be.",
    ],
    highlights: [
      "Sleek silver bar pendant, engraved with any name (up to 12 characters)",
      "Clean, modern engraving done to order",
      "Adjustable chain — sits comfortably on everyone",
      "Arrives in a gift-ready box",
      "Order with a ₹99 advance, pay the rest on delivery",
    ],
    faqs: [
      {
        q: "How do I personalize it?",
        a: "Type the name in the box on this page and you'll see it on the pendant instantly. That exact spelling is what we engrave — so double-check it before you order.",
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
    accent: ["#7c4b7f", "#b9bcc2"],
  },
  {
    // Qikink "Acrylic Photo Frame with Stand" (AF22) — standard, white.
    // Base cost ~₹180.
    slug: "custom-photo-frame",
    name: "Custom Photo Frame",
    tagline: "A moment they'll want on display forever.",
    price: 649,
    compareAtPrice: 999,
    category: "personalized",
    personalization: "photo",
    shape: "frame",
    supplierSku: "AF22",
    requiresAdvance: true,
    occasions: ["Anniversary", "Birthday"],
    rating: 4.8,
    reviews: 0,
    description: [
      "The best moments deserve more than a camera roll. Our Custom Photo Frame gives one of yours a permanent place on the shelf or desk — somewhere it'll catch their eye and make them smile mid-day.",
      "Upload your photo, see it framed instantly on this page, and we print and mount it in a clear acrylic frame with a stand — ready to display the moment it arrives.",
    ],
    highlights: [
      "Clear acrylic photo frame with a stand — ready to display",
      "Your photo printed in rich, fade-resistant colour",
      "Standard size with a clean, modern finish",
      "Upload any JPG, PNG or WebP",
      "Order with a ₹99 advance, pay the rest on delivery",
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
    // Qikink "Magic Coffee Mug" — colour-changing (matte black cold → photo
    // reveals when hot). Base cost ~₹200. SKU placeholder until sample order.
    slug: "magic-photo-mug",
    name: "Magic Photo Mug",
    tagline: "Pour in hot chai — and watch their photo appear.",
    price: 649,
    compareAtPrice: 999,
    category: "personalized",
    personalization: "photo",
    shape: "mug",
    supplierSku: "MAGIC-MUG", // TODO(Yash): real Qikink SKU after sample order
    requiresAdvance: true,
    occasions: ["Birthday", "Anniversary"],
    rating: 4.9,
    reviews: 0,
    description: [
      "This one gets a reaction. The Magic Photo Mug looks like a plain matte-black mug — until hot chai or coffee is poured in, and their photo slowly appears like magic.",
      "Upload your favourite picture and we print it as the hidden reveal. It's the gift people pick up, gasp at, and show everyone — a memory that comes to life every single morning.",
    ],
    highlights: [
      "Colour-changing magic mug — matte black when cold, your photo appears when hot",
      "The reveal effect makes it a genuine showstopper gift",
      "Full-colour photo, printed to order",
      "Ceramic — hand-wash to keep the colour-change coating vivid",
      "Order with a ₹99 advance, pay the rest on delivery",
    ],
    faqs: [
      {
        q: "How does the magic effect work?",
        a: "The mug is coated so it looks solid black when cold. Pour in any hot drink and the heat reveals your photo in full colour; it hides again as the mug cools.",
      },
      {
        q: "How do I add my photo?",
        a: "Upload it in the box on this page — you'll see a preview of what gets printed. Use a clear, high-resolution photo for the sharpest reveal.",
      },
      {
        q: "How should I care for it?",
        a: "Hand-wash is best — it keeps the colour-changing coating looking its best for longer. Avoid the dishwasher and microwave.",
      },
    ],
    accent: ["#2b2b2b", "#5b2a5e"],
    badge: "Colour-changing",
  },
  {
    // Qikink "White Coffee Mug" — classic white photo mug. Base cost ~₹115.
    // SKU placeholder until sample order.
    slug: "custom-photo-mug",
    name: "Custom Photo Mug (White)",
    tagline: "Their favourite memory, with every morning chai.",
    price: 429,
    compareAtPrice: 699,
    category: "personalized",
    personalization: "photo",
    shape: "mug",
    supplierSku: "WHITE-MUG", // TODO(Yash): real Qikink SKU after sample order
    requiresAdvance: true,
    occasions: ["Birthday", "Anniversary"],
    rating: 4.8,
    reviews: 0,
    description: [
      "A photo sitting in your phone gets scrolled past. The same photo on a mug they hold every morning gets noticed — every single day.",
      "Upload your favourite picture and we print it edge-to-edge, in full colour, on a classic white ceramic mug that's safe for the microwave and dishwasher. Small, thoughtful, and used all the time.",
    ],
    highlights: [
      "Classic white ceramic mug — microwave & dishwasher safe",
      "Your photo printed edge-to-edge in full colour",
      "Fade-resistant, long-lasting print",
      "Upload any JPG, PNG or WebP",
      "Order with a ₹99 advance, pay the rest on delivery",
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
        a: "Made to order and delivered in 5–7 days across India.",
      },
    ],
    accent: ["#7c4b7f", "#e7cb82"],
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

// Homepage "Bestselling Gifts" row shows only the personalized gifts (the mat
// stays on its own product page + related rows, not the gifts grid).
export const featuredProducts = products.filter((p) => p.category === "personalized");

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function relatedProducts(slug: string, limit = 3): Product[] {
  return products.filter((p) => p.slug !== slug).slice(0, limit);
}
