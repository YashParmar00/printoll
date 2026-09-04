import { Prisma, type Product as DbProduct } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Product, ProductFaq } from "@/lib/products";

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function accent(value: unknown): [string, string] {
  const colors = strings(value);
  return [colors[0] ?? "#5b2a5e", colors[1] ?? "#d4a947"];
}

function faqs(value: unknown): ProductFaq[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const { q, a } = item as { q?: unknown; a?: unknown };
    return typeof q === "string" && typeof a === "string" ? [{ q, a }] : [];
  });
}

export function toCatalogProduct(row: DbProduct): Product {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    price: row.price,
    compareAtPrice: row.compareAtPrice,
    category: row.category,
    personalization: row.personalization as Product["personalization"],
    shape: row.shape as Product["shape"],
    supplierSku: row.supplierSku,
    requiresAdvance: row.requiresAdvance,
    occasions: row.occasions,
    rating: row.rating,
    reviews: row.reviewsCount,
    description: strings(row.description),
    highlights: strings(row.highlights),
    faqs: faqs(row.faqs),
    accent: accent(row.accent),
    badge: row.badge ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    imageUrls: row.imageUrls,
    sortOrder: row.sortOrder,
    active: row.active,
  };
}

export async function listCatalogProducts(includeInactive = false): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: includeInactive ? undefined : { active: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toCatalogProduct);
}

export async function findCatalogProduct(slug: string, includeInactive = false): Promise<Product | undefined> {
  const row = await prisma.product.findFirst({ where: { slug, ...(includeInactive ? {} : { active: true }) } });
  return row ? toCatalogProduct(row) : undefined;
}

export async function relatedCatalogProducts(slug: string, limit = 3): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, slug: { not: slug } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    take: limit,
  });
  return rows.map(toCatalogProduct);
}

export type CatalogInput = Omit<Product, "slug"> & { slug: string; active: boolean; sortOrder: number };

export async function saveCatalogProduct(input: CatalogInput) {
  const data = {
    name: input.name, tagline: input.tagline, price: input.price, compareAtPrice: input.compareAtPrice,
    category: input.category, personalization: input.personalization, shape: input.shape,
    supplierSku: input.supplierSku, requiresAdvance: input.requiresAdvance, occasions: input.occasions,
    rating: input.rating, reviewsCount: input.reviews, description: input.description, highlights: input.highlights,
    faqs: input.faqs as unknown as Prisma.InputJsonValue, accent: input.accent, badge: input.badge ?? null,
    imageUrl: input.imageUrl ?? input.imageUrls?.[0] ?? null, imageUrls: input.imageUrls ?? [], active: input.active, sortOrder: input.sortOrder,
  };
  return prisma.product.upsert({ where: { slug: input.slug }, update: data, create: { slug: input.slug, ...data } });
}
