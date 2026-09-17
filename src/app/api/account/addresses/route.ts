import { getCurrentCustomer } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { privateJson } from "@/lib/private-response";

export const runtime = "nodejs";

export async function GET() {
  const customer = await getCurrentCustomer();
  if (!customer) return privateJson({ loggedIn: false, addresses: [] });
  const addresses = await prisma.address.findMany({
    where: { customerId: customer.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: { id: true, label: true, fullName: true, phone: true, line1: true, line2: true, city: true, state: true, pincode: true, isDefault: true },
  });
  return privateJson({ loggedIn: true, name: customer.name, email: customer.email, addresses });
}
