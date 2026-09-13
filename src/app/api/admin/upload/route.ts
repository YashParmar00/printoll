import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import sharp from "sharp";
import { boundedBytes } from "@/lib/private-response";

export const runtime = "nodejs";

const fileTypes: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
const STORAGE_BUCKET = "product-images";

export async function POST(request: NextRequest) {
  if (!await isAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const parsed = new URL(origin);
      if (!["http:", "https:"].includes(parsed.protocol) || parsed.host !== request.headers.get("host")) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
    } catch { return NextResponse.json({ error: "Invalid origin." }, { status: 403 }); }
  }
  if (Number(request.headers.get("content-length")) > 4_000_000) return NextResponse.json({ error: "Image must be 3 MB or smaller." }, { status: 413 });
  let formData;
  try { const body = await boundedBytes(request, 4_000_000); formData = await new Response(new Uint8Array(body), { headers: { "Content-Type": request.headers.get("content-type") ?? "" } }).formData(); } catch { return NextResponse.json({ error: "Invalid or oversized multipart request." }, { status: 400 }); }
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Select an image first." }, { status: 400 });
  const extension = fileTypes[file.type];
  if (!extension) return NextResponse.json({ error: "Only JPG, PNG and WebP images are supported." }, { status: 400 });
  if (file.size > 3_000_000) return NextResponse.json({ error: "Image must be 3 MB or smaller." }, { status: 400 });
  const filename = `${randomUUID()}${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  try {
    const metadata = await sharp(bytes, { limitInputPixels: 40_000_000 }).metadata();
    const mime = ({ jpeg: "image/jpeg", png: "image/png", webp: "image/webp" } as Record<string, string>)[metadata.format ?? ""];
    if (mime !== file.type || !metadata.width || !metadata.height || (metadata.pages ?? 1) > 1) throw new Error("Unsupported image.");
  } catch { return NextResponse.json({ error: "The file is not a supported image." }, { status: 400 }); }
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Vercel's filesystem is read-only. Production uploads must use object storage.
  if (supabaseUrl && serviceRoleKey) {
    const objectPath = `products/${filename}`;
    // Legacy service_role keys are JWTs and go in Authorization as well. New
    // `sb_secret_` keys are not JWTs: Storage rejects them as a Bearer token.
    const authHeaders: Record<string, string> = serviceRoleKey.startsWith("eyJ")
      ? { Authorization: `Bearer ${serviceRoleKey}`, apikey: serviceRoleKey }
      : { apikey: serviceRoleKey };
    let failure = "";
    const response = await fetch(`${supabaseUrl}/storage/v1/object/${STORAGE_BUCKET}/${objectPath}`, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": file.type, "x-upsert": "false" },
      body: bytes,
      signal: AbortSignal.timeout(15_000),
    }).catch((error: unknown) => { failure = error instanceof Error ? error.message : "network error"; return null; });
    if (!response?.ok) {
      // Admin-only route: surface Supabase's reason (never the key) so setup
      // problems like a wrong key or missing bucket are diagnosable.
      if (response) failure = `${response.status} ${(await response.text().catch(() => "")).slice(0, 200)}`;
      console.error("Supabase storage upload failed:", failure);
      return NextResponse.json({ error: `Image storage upload failed (${failure}). Check the Supabase bucket and server key.` }, { status: 502 });
    }
    return NextResponse.json({ url: `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${objectPath}` });
  }

  // Local development fallback only.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Image storage is not configured. Add Supabase Storage settings in Vercel." }, { status: 503 });
  }
  const folder = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, filename), bytes);
  return NextResponse.json({ url: `/uploads/products/${filename}` });
}
