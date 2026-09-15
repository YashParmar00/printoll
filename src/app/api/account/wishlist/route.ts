import { getCurrentCustomer } from "@/lib/customer-auth";
import { listWishlistSlugs, toggleWishlist } from "@/lib/wishlist";
import { boundedText, privateJson } from "@/lib/private-response";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET() {
  const customer = await getCurrentCustomer();
  if (!customer) return privateJson({ loggedIn: false, slugs: [] });
  return privateJson({ loggedIn: true, slugs: await listWishlistSlugs(customer.id) });
}

export async function POST(request: Request) {
  const customer = await getCurrentCustomer();
  if (!customer) return privateJson({ error: "Please sign in." }, 401);
  if (!(await rateLimit(request.headers, "wishlist-toggle", 60))) return privateJson({ error: "Please wait before trying again." }, 429);
  let body;
  try { body = JSON.parse(await boundedText(request, 2048)); } catch { return privateJson({ error: "Invalid request." }, 400); }
  if (!body || typeof body.slug !== "string" || !/^[a-z0-9-]{1,120}$/.test(body.slug)) return privateJson({ error: "Invalid product." }, 400);
  const wishlisted = await toggleWishlist(customer.id, body.slug);
  return privateJson({ wishlisted });
}
