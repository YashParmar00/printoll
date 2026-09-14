import sampleCatalog from "./sample-catalog.json";

export type PersonalizationType = "none" | "text" | "photo" | "both";
export type ProductShape = "tee" | "hoodie" | "tote";
export interface ProductFaq { q: string; a: string }
export interface Product {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  compareAtPrice: number;
  category: string;
  personalization: PersonalizationType;
  shape: ProductShape;
  supplierSku: string;
  requiresAdvance: boolean;
  occasions: string[];
  rating: number;
  reviews: number;
  description: string[];
  highlights: string[];
  faqs: ProductFaq[];
  accent: [string, string];
  badge?: string;
  imageUrl?: string;
  imageUrls?: string[];
  sortOrder?: number;
  active?: boolean;
}

export const FALLBACK_PRODUCT_IMAGE = "/uploads/catalog/men-explorer-graphic-tee.webp";
export const HERO_IMAGE = "https://images.pexels.com/photos/29219966/pexels-photo-29219966.jpeg?auto=compress&cs=tinysrgb&w=1200";

// Temporary sample inventory with real reference photographs, not supplier inventory.
// Attribution: docs/catalog-photo-sources.json. Prices and homepage selections
// are sample values; no sales counts or reviews are invented.
export const products: Product[] = sampleCatalog.map((item, sortOrder) => {
  const isSet = item.category === "matching";
  const isBag = item.category === "gifts-more";
  const included = isSet ? "Two printed T-shirts" : isBag ? "One printed canvas tote" : "One printed T-shirt";
  return {
    ...item,
    compareAtPrice: item.price + (isSet ? 500 : 300),
    personalization: "none",
    shape: isBag ? "tote" : "tee",
    supplierSku: `SAMPLE-${item.slug.toUpperCase()}`,
    requiresAdvance: false,
    occasions: isSet ? ["Anniversary", "Date Night"] : ["Everyday", "Birthday"],
    rating: 0,
    reviews: 0,
    description: [
      `${item.name}. ${item.tagline}`,
      isSet ? "Coordinating printed tees for days out together. Pick a size for each tee to make the pair your own." : isBag ? "A printed canvas tote for your books, daily essentials and thoughtful gifting." : "A graphic printed tee to pair with denim, cargos or your favourite everyday layers.",
    ],
    highlights: [included, isBag ? "One size; no garment size selection needed" : isSet ? "Choose two sizes independently" : "Choose your preferred size", "Graphic artwork printed on the product", "Pre-designed print; no personalisation required"],
    faqs: [
      { q: "What is included?", a: `${included}. The displayed price covers the complete ${isSet ? "pair" : "item"}.` },
      { q: "Can I personalise this item?", a: "This style comes as pictured, without text or photo customisation." },
    ],
    accent: ["#eee8e0", "#faf7f2"],
    badge: item.badge,
    imageUrls: [item.imageUrl],
    sortOrder,
    active: true,
  };
});

export const featuredProducts = products.filter(product => product.badge).slice(0, 9);
export const getProduct = (slug: string) => products.find(product => product.slug === slug);
export const relatedProducts = (slug: string, limit = 3) => products.filter(product => product.slug !== slug).slice(0, limit);
