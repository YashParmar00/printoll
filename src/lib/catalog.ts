import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { CatalogCard } from "@/lib/catalog-card";
import { Prisma, type Product as DbProduct } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { products as seedCatalogue, type Product, type ProductFaq } from "@/lib/products";

/**
 * Where the *storefront* reads its catalogue from.
 *
 *   CATALOG_SOURCE=db      → Postgres (normal operation, admin-editable)
 *   CATALOG_SOURCE=static  → src/lib/products.ts  (default until this brand has
 *                            its own Supabase project seeded)
 *
 * Pairwear was branched from AuraaMarts and inherited its DATABASE_URL, so
 * reading products from the DB would show that store's catalogue — and seeding
 * over it would destroy the live AuraaMarts store. Until a fresh Supabase
 * project is created and seeded, the shop serves the static catalogue instead.
 * Admin screens always read the DB so they never misreport what is stored.
 */
const usingStaticCatalogue = (process.env.CATALOG_SOURCE ?? "static") !== "db";

function staticCatalogue(): Product[] {
  return seedCatalogue
    .filter((product) => product.active !== false)
    .map((product, index) => ({ ...product, sortOrder: product.sortOrder ?? index, active: true }));
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function accent(value: unknown): [string, string] {
  const colors = strings(value);
  return [colors[0] ?? "#141414", colors[1] ?? "#d2603f"];
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

async function readCatalogProducts(includeInactive = false, limit?: number): Promise<Product[]> {
  if (usingStaticCatalogue && !includeInactive) return staticCatalogue().slice(0, limit);
  const rows = await prisma.product.findMany({
    where: includeInactive ? undefined : { active: true },
    take: limit,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toCatalogProduct);
}

async function readCatalogProduct(slug: string, includeInactive = false): Promise<Product | undefined> {
  if (usingStaticCatalogue && !includeInactive) {
    return staticCatalogue().find((product) => product.slug === slug);
  }
  const row = await prisma.product.findFirst({ where: { slug, ...(includeInactive ? {} : { active: true }) } });
  return row ? toCatalogProduct(row) : undefined;
}

async function readRelatedCatalogProducts(slug: string, limit = 3): Promise<CatalogCard[]> {
  if (usingStaticCatalogue) {
    return staticCatalogue().filter((product) => product.slug !== slug).slice(0, limit);
  }
  const rows = await prisma.product.findMany({
    where: { active: true, slug: { not: slug } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    take: limit,
    select: cardSelect,
  });
  return rows.map(row => ({ ...row, shape: row.shape as Product["shape"], reviews: row.reviewsCount, accent: accent(row.accent), imageUrl: row.imageUrl ?? undefined }));
}

const cardSelect = { slug: true, name: true, tagline: true, price: true, compareAtPrice: true, category: true, shape: true, reviewsCount: true, accent: true, imageUrl: true, imageUrls: true } as const;
export const listCatalogCards = unstable_cache(async (limit?: number): Promise<CatalogCard[]> => {
  if (usingStaticCatalogue) return staticCatalogue().slice(0, limit).map(({ slug, name, tagline, price, compareAtPrice, category, shape, reviews, accent, imageUrl, imageUrls }) => ({ slug, name, tagline, price, compareAtPrice, category, shape, reviews, accent, imageUrl, imageUrls }));
  const rows = await prisma.product.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], take: limit, select: cardSelect });
  return rows.map(row => ({ ...row, shape: row.shape as Product["shape"], reviews: row.reviewsCount, accent: accent(row.accent), imageUrl: row.imageUrl ?? undefined }));
}, ["catalog-cards-v1", String(usingStaticCatalogue)], { tags: ["catalog"], revalidate: 300 });

export type CatalogInput = Omit<Product, "slug"> & { slug: string; active: boolean; sortOrder: number };

/** Deliberately uncached: authoritative checkout snapshot of requested products only. */
export async function checkoutProducts(slugs: string[]) {
  if (usingStaticCatalogue) return staticCatalogue().filter(product => slugs.includes(product.slug));
  return prisma.product.findMany({ where: { active: true, slug: { in: slugs } }, select: { slug: true, name: true, price: true, requiresAdvance: true, personalization: true, category: true, shape: true } });
}

export async function listCatalogCategories() {
  const rows = await prisma.product.findMany({ select: { category: true }, distinct: ["category"], orderBy: { category: "asc" } });
  return Array.from(new Set(["couple-sets", ...rows.map(row => row.category)]));
}

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

const cachedList = unstable_cache((limit?: number) => readCatalogProducts(false, limit), ["catalog-list-v2", String(usingStaticCatalogue)], { tags: ["catalog"], revalidate: 300 });
const cachedProduct = unstable_cache((slug: string) => readCatalogProduct(slug), ["catalog-product-v2", String(usingStaticCatalogue)], { tags: ["catalog"], revalidate: 300 });
export const findCatalogProduct = cache((slug: string, includeInactive = false) => includeInactive ? readCatalogProduct(slug, true) : cachedProduct(slug));
export const listCatalogProducts = (includeInactive = false, limit?: number) => includeInactive ? readCatalogProducts(true, limit) : cachedList(limit);
export const relatedCatalogProducts = unstable_cache(readRelatedCatalogProducts, ["catalog-related-v2", String(usingStaticCatalogue)], { tags: ["catalog"], revalidate: 300 });
