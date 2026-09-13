import { checkoutSnapshot } from "@/lib/checkout-server";
import { CheckoutError } from "@/lib/checkout";
import { boundedText, privateJson } from "@/lib/private-response";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    let body;
    try { body = JSON.parse(await boundedText(request)); } catch { return privateJson({ error: "Invalid request." }, 400); }
    if (!await rateLimit(request.headers, "quote", 60)) return privateJson({ error: "Please wait before refreshing your quote." }, 429);
    const snapshot = await checkoutSnapshot(body?.items);
    return privateJson({ methods: snapshot.methods, totals: snapshot.totals });
  } catch (error) {
    return privateJson({ error: error instanceof CheckoutError ? error.message : "Could not refresh prices. Please try again." }, error instanceof CheckoutError ? 400 : 503);
  }
}
