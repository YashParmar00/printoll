import { getCurrentCustomer } from "@/lib/customer-auth";
import { privateJson } from "@/lib/private-response";

export const runtime = "nodejs";

export async function GET() {
  const customer = await getCurrentCustomer();
  return privateJson(customer ? { loggedIn: true, name: customer.name } : { loggedIn: false });
}
