/** Quick DB sanity check: `npm run db:check` */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });
  console.log(`products: ${products.length}`);
  for (const p of products) console.log(`  - ${p.slug}  ₹${p.price}  ${p.badge ?? "—"}`);
  console.log(`orders: ${await prisma.order.count()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
