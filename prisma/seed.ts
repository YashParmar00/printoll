import { Prisma, PrismaClient } from "@prisma/client";
import { products } from "../src/lib/products";

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const data = {
      name: p.name,
      tagline: p.tagline,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      category: p.category,
      personalization: p.personalization,
      shape: p.shape,
      supplierSku: p.supplierSku,
      requiresAdvance: p.requiresAdvance,
      occasions: p.occasions,
      rating: p.rating,
      reviewsCount: p.reviews,
      description: p.description,
      highlights: p.highlights,
      faqs: p.faqs as unknown as Prisma.InputJsonValue,
      accent: p.accent,
      badge: p.badge ?? null,
      imageUrl: p.imageUrl ?? null,
      imageUrls: p.imageUrls ?? (p.imageUrl ? [p.imageUrl] : []),
      active: true,
      sortOrder: i,
    };
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { slug: p.slug, ...data },
    });
    console.log(`  upserted ${p.slug}`);
  }
  const count = await prisma.product.count();
  console.log(`Seed complete. Products in DB: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
