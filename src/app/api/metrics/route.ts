import { boundedText, privateJson } from "@/lib/private-response";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_PERF_TELEMETRY !== "true") return new Response(null, { status: 204 });
  try {
    const data = JSON.parse(await boundedText(request, 512));
    if (!["TTFB", "FCP", "LCP", "INP", "CLS"].includes(data?.name) || !["home", "product", "category", "cart", "checkout"].includes(data?.route) || typeof data.value !== "number" || !Number.isFinite(data.value) || data.value < 0 || data.value > 300_000) return privateJson({ error: "Invalid metric." }, 400);
    console.info(JSON.stringify({ event: "web-vital", route: data.route, name: data.name, value: data.value }));
    return new Response(null, { status: 204 });
  } catch { return privateJson({ error: "Invalid metric." }, 400); }
}
