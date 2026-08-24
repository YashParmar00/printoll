import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const orderCount = await prisma.order.count();
  const productCount = await prisma.product.count();
  const latest = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  console.log("PRODUCTS_IN_DB:", productCount);
  console.log("ORDERS_IN_DB:", orderCount);
  console.log(
    "LATEST_ORDER:",
    latest
      ? JSON.stringify(
          {
            orderNumber: latest.orderNumber,
            status: latest.status,
            paymentMethod: latest.paymentMethod,
            customerName: latest.customerName,
            total: latest.total,
            advancePaid: latest.advancePaid,
            codDue: latest.codDue,
            items: latest.items.map((i) => `${i.qty}x ${i.name}`),
            createdAt: latest.createdAt,
          },
          null,
          2,
        )
      : "none",
  );
}

main().finally(() => prisma.$disconnect());
