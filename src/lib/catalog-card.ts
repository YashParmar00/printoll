import type { Product } from "@/lib/products";
export type CatalogCard = Pick<Product, "slug" | "name" | "tagline" | "price" | "compareAtPrice" | "category" | "shape" | "reviews" | "accent" | "imageUrl" | "imageUrls">;
