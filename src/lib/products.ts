/**
 * Launch catalogue — 5 matching couple T-shirt sets (2 tees per set), printed
 * and fulfilled by Qikink. This static array is the seed source for
 * `prisma/seed.ts`; the live site reads products from Postgres via
 * `src/lib/catalog.ts`, so edit here + reseed (or use /admin/products).
 *
 * `supplierSku` holds the Qikink style code for the set.
 * TODO(Yash): the set codes below are placeholders — replace each with the two
 * real Qikink unisex round-neck tee style codes once the sample order confirms
 * them. Qikink base cost is ~₹230–₹260 per printed tee (≈₹500 per set), which
 * is what the ₹999 anchor is built on.
 */

export type PersonalizationType = "none" | "text" | "photo" | "both";

/** Drives the live preview mockup silhouette + print area. */
export type ProductShape = "tee" | "hoodie" | "tote";

export interface ProductFaq {
  q: string;
  a: string;
}

export interface Product {
  slug: string;
  name: string;
  /** Short emotional hook shown under the name on cards. */
  tagline: string;
  price: number; // selling price for the full 2-tee set, whole ₹
  compareAtPrice: number; // struck anchor price, whole ₹
  category: string;
  personalization: PersonalizationType;
  shape: ProductShape;
  /** Supplier SKU / style code (Qikink). Placeholders until the sample order. */
  supplierSku: string;
  /**
   * Require a small online advance (rest as COD) instead of full COD.
   * Personalized sets can't be resold if refused at the door, so every printed
   * set defaults to true. Per-product config (not a hardcoded rule) so it can
   * be flipped later.
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

/**
 * Placeholder imagery — free Pexels stock, allow-listed in `next.config.ts`.
 * TODO(Yash): replace every URL below with the real Qikink mockups / your own
 * product shots as soon as the sample order lands. Stock photos are a
 * stand-in for layout only; they are not our actual product.
 */
const pexels = (id: number, w = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

/** Shown on a card when a product has no image of its own yet. */
export const FALLBACK_PRODUCT_IMAGE = pexels(8217304, 700);

/** Hero lifestyle shot. Same TODO applies — swap for a real couple photo. */
export const HERO_IMAGE = pexels(29219966, 1200);

/** Shared boilerplate — every set ships the same way, so keep it in one place. */
const setFaqs: ProductFaq[] = [
  {
    q: "What exactly comes in a set?",
    a: "Two T-shirts, one for each of you, printed with the same design and personalized with whatever you type on this page. You pick both sizes at checkout, and they can be different.",
  },
  {
    q: "How do sizes work?",
    a: "Unisex fit, XS to XXL. Choose a size for each tee in the box on this page. If you're between sizes, size up or message us on WhatsApp and we'll help.",
  },
  {
    q: "When will it arrive?",
    a: "Each set is printed after you order and delivered in 5–7 days across India. The delivery date is shown on this page before you add to cart.",
  },
  {
    q: "Will the print fade in the wash?",
    a: "No. We print with DTF/DTG inks that stay sharp for years. Wash inside out in cold water and skip the dryer to keep them looking new.",
  },
];

const setHighlights = (line: string): string[] => [
  "Two tees per set, one for each of you",
  line,
  "180 GSM soft-washed cotton, unisex fit (XS–XXL, pick a size for each)",
  "Long-lasting print. Wash inside out in cold water",
  "Order with a ₹99 advance, pay the rest on delivery",
];

export const products: Product[] = [
  {
    slug: "king-queen-couple-tee-set",
    name: "King & Queen Couple Tee Set",
    tagline: "The one everybody asks about.",
    price: 999,
    compareAtPrice: 1599,
    category: "couple-sets",
    personalization: "text",
    shape: "tee",
    supplierSku: "PW-SET-KINGQUEEN", // TODO(Yash): real Qikink style codes ×2
    requiresAdvance: true,
    occasions: ["Anniversary", "Valentine's Day", "Birthday"],
    rating: 4.8,
    reviews: 0,
    description: [
      "Crowns on the chest, your names underneath. It's the couple tee everyone recognises and actually wears on trips, date nights and lazy Sundays at home.",
      "We print both tees to order with the names you type here, so it stops being a generic set the second it arrives. Two tees, one box, ready to wear together.",
    ],
    highlights: setHighlights("Crown print with your two names, printed exactly as you type them"),
    faqs: setFaqs,
    accent: ["#141414", "#d2603f"],
    badge: "Bestseller",
    imageUrls: [pexels(8217299), pexels(8217304), pexels(8217365)],
  },
  {
    slug: "mr-mrs-couple-tee-set",
    name: "Mr & Mrs Couple Tee Set",
    tagline: "For the newly-weds who want to say it out loud.",
    price: 1049,
    compareAtPrice: 1699,
    category: "couple-sets",
    personalization: "text",
    shape: "tee",
    supplierSku: "PW-SET-MRMRS", // TODO(Yash): real Qikink style codes ×2
    requiresAdvance: true,
    occasions: ["Wedding", "Anniversary", "Honeymoon"],
    rating: 4.9,
    reviews: 0,
    description: [
      "The honeymoon-suitcase set. Clean type, your shared surname under it, and enough restraint that you'll still wear them long after the wedding photos are printed.",
      "Add your surname and your wedding date and we print both tees to match. It makes a thoughtful gift for a shagun, bridal shower or the morning after the reception.",
    ],
    highlights: setHighlights("Mr & Mrs type with your surname and wedding date"),
    faqs: setFaqs,
    accent: ["#232323", "#f0b49b"],
    badge: "Wedding favourite",
    imageUrls: [pexels(6214283), pexels(6214254), pexels(6213951)],
  },
  {
    slug: "since-date-couple-tee-set",
    name: "Since Couple Tee Set",
    tagline: "Your date, worn like a badge.",
    price: 999,
    compareAtPrice: 1599,
    category: "couple-sets",
    personalization: "text",
    shape: "tee",
    supplierSku: "PW-SET-SINCE", // TODO(Yash): real Qikink style codes ×2
    requiresAdvance: true,
    occasions: ["Anniversary", "Valentine's Day"],
    rating: 4.8,
    reviews: 0,
    description: [
      "One date, big and bold across the chest. The day you met, the day you said yes, or the day it stopped being casual. Nobody else needs to know what it means.",
      "Type the date exactly how you want it read and we print it on both tees. Quiet, specific, and far more personal than a slogan anyone can buy.",
    ],
    highlights: setHighlights("Your date printed large on both tees, in your own format"),
    faqs: setFaqs,
    accent: ["#d2603f", "#f3e3d3"],
    imageUrls: [pexels(9370883), pexels(10614285)],
  },
  {
    slug: "initials-couple-tee-set",
    name: "Initials Couple Tee Set",
    tagline: "Minimal enough to wear anywhere.",
    price: 949,
    compareAtPrice: 1499,
    category: "couple-sets",
    personalization: "text",
    shape: "tee",
    supplierSku: "PW-SET-INITIALS", // TODO(Yash): real Qikink style codes ×2
    requiresAdvance: true,
    occasions: ["Valentine's Day", "Birthday", "Anniversary"],
    rating: 4.7,
    reviews: 0,
    description: [
      "Two letters, small, left chest. This is the set for couples who want the matching thing without announcing it to the entire metro compartment.",
      "Send us your initials: A & D, S ♥ R, or whatever you both answer to. We print them small and clean on each tee. Understated and easily the most worn set we make.",
    ],
    highlights: setHighlights("Your initials printed small on the left chest of each tee"),
    faqs: setFaqs,
    accent: ["#3d3a38", "#fbf1e7"],
    badge: "New print",
    imageUrls: [pexels(15568939), pexels(11147277)],
  },
  {
    slug: "her-one-his-only-couple-tee-set",
    name: "Her One & His Only Couple Tee Set",
    tagline: "The gift that gets the reaction.",
    price: 999,
    compareAtPrice: 1599,
    category: "couple-sets",
    personalization: "text",
    shape: "tee",
    supplierSku: "PW-SET-ONEONLY", // TODO(Yash): real Qikink style codes ×2
    requiresAdvance: true,
    occasions: ["Valentine's Day", "Anniversary", "Birthday"],
    rating: 4.8,
    reviews: 0,
    description: [
      "Two halves of one line: \"Her One\" on his and \"His Only\" on hers. The set only works when you're standing next to each other. That's the whole point.",
      "We add your names underneath and print both tees to order. It's the set people gift when they want a reaction, not a polite thank-you.",
    ],
    highlights: setHighlights("Two-halves print that completes when you stand together, with your names"),
    faqs: setFaqs,
    accent: ["#b0472a", "#141414"],
    badge: "Gift favourite",
    imageUrls: [pexels(26797752), pexels(9294979), pexels(13640700)],
  },
  {
    slug: "womens-heart-bloom-tee",
    name: "Bloom Heart Women’s Tee",
    tagline: "A little romance, made for every day.",
    price: 699,
    compareAtPrice: 999,
    category: "womens",
    personalization: "none",
    shape: "tee",
    supplierSku: "PW-WOMEN-BLOOM", // TODO(Yash): replace with the supplier style code
    requiresAdvance: false,
    occasions: ["Date Night", "Birthday", "Valentine's Day"],
    rating: 0,
    reviews: 0,
    description: [
      "An easy ivory tee with a fine coral heart-and-flower print: romantic enough for a date, simple enough for your regular rotation.",
      "The relaxed silhouette works with denim, cargos or a matching layer. It is a finished printed tee, ready to wear as it is.",
    ],
    highlights: [
      "Soft ivory base with a minimal coral heart-and-flower artwork",
      "Relaxed everyday fit that styles easily with denim",
      "Ready-made print with no customisation needed",
    ],
    faqs: [
      { q: "Is this one T-shirt or a set?", a: "This is one ready-to-wear women’s printed T-shirt." },
      { q: "How should I wash it?", a: "Wash inside out in cold water and avoid ironing directly over the print." },
    ],
    accent: ["#f5eadf", "#d2603f"],
    badge: "New arrival",
    imageUrls: ["/uploads/products/womens-heart-bloom-tee.png"],
  },
];

// Homepage "Bestselling Sets" row — the whole catalogue is couple sets today,
// so this is just a stable, sorted view of it.
export const featuredProducts = products;

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function relatedProducts(slug: string, limit = 3): Product[] {
  return products.filter((p) => p.slug !== slug).slice(0, limit);
}
