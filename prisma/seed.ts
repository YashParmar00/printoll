import { Prisma, PrismaClient } from "@prisma/client";
import { products } from "../src/lib/products";
import { defaultHomeCollections } from "../src/lib/home-collections";
import { mkdir, writeFile } from "node:fs/promises";

const prisma = new PrismaClient();

async function main() {
  const replace = process.argv.includes("--replace") || process.env.CATALOG_REPLACE === "true";
  if (replace) {
    await mkdir(".data/catalog-backups", { recursive: true });
    const previous = await prisma.product.findMany();
    await writeFile(`.data/catalog-backups/products-${Date.now()}.json`, JSON.stringify(previous, null, 2));
  }
  await prisma.$transaction(async (tx) => {
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
      await tx.product.upsert({
        where: { slug: p.slug },
        update: data,
        create: { slug: p.slug, ...data },
      });
      console.log(`  upserted ${p.slug}`);
    }
    if (replace) {
      await tx.product.updateMany({ where: { slug: { notIn: products.map(product => product.slug) } }, data: { active: false } });
    }
    for (const collection of defaultHomeCollections) {
      await tx.homeCollection.upsert({
        where: { id: collection.id },
        update: {
          title: collection.title, description: collection.description, imageUrl: collection.imageUrl,
          href: collection.href, active: collection.active, sortOrder: collection.sortOrder,
        },
        create: collection,
      });
    }
  }, { timeout: 60000 });
  const count = await prisma.product.count({ where: { active: true } });
  console.log(`Seed complete. Active products in DB: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
