import "server-only";
import { prisma } from "@/lib/prisma";

export async function listWishlistSlugs(customerId: string) {
  const rows = await prisma.wishlistItem.findMany({ where: { customerId }, select: { productSlug: true }, orderBy: { createdAt: "desc" } });
  return rows.map((row) => row.productSlug);
}

export async function isWishlisted(customerId: string, slug: string) {
  const row = await prisma.wishlistItem.findUnique({ where: { customerId_productSlug: { customerId, productSlug: slug } } });
  return row !== null;
}

/** Adds if absent, removes if present. Returns the resulting state. */
export async function toggleWishlist(customerId: string, slug: string) {
  const existing = await prisma.wishlistItem.findUnique({ where: { customerId_productSlug: { customerId, productSlug: slug } } });
  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return false;
  }
  await prisma.wishlistItem.create({ data: { customerId, productSlug: slug } });
  return true;
}
