/**
 * Launch catalogue (seed data). In M3 this moves behind Prisma/Postgres, but
 * the shape here mirrors the future Product model so the swap is mechanical.
 *
 * TODO(Yash §D): confirm final SKUs, prices and Qikink SKU codes.
 */

export type PersonalizationType = "none" | "text" | "photo" | "both";

export interface Product {
  slug: string;
  name: string;
  /** Short emotional hook shown under the name on cards. */
  tagline: string;
  price: number; // selling price, whole ₹
  compareAtPrice: number; // struck anchor price, whole ₹
  category: "personalized" | "wellness";
  personalization: PersonalizationType;
  occasions: string[];
  rating: number; // seed ratings are placeholders until real reviews land
  reviews: number;
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
    occasions: ["Rakhi", "Birthday", "Anniversary"],
    rating: 4.8,
    reviews: 0,
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
    occasions: ["Birthday", "Anniversary"],
    rating: 4.9,
    reviews: 0,
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
    occasions: ["Anniversary", "Birthday"],
    rating: 4.8,
    reviews: 0,
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
    occasions: [],
    rating: 4.7,
    reviews: 0,
    accent: ["#431f46", "#5b2a5e"],
    badge: "Wellness",
  },
];

export const featuredProducts = products;

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
