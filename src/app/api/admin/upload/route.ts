import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, sessionValue } from "@/lib/admin-auth";

export const runtime = "nodejs";

const fileTypes: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
const STORAGE_BUCKET = "product-images";

function authorized(request: NextRequest) {
  const user = process.env.ADMIN_USER ?? "";
  const pass = process.env.ADMIN_PASSWORD ?? "";
  if (!user || !pass) return false;
  return request.cookies.get(ADMIN_SESSION_COOKIE)?.value === sessionValue(user, pass);
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const formData = await request.formData();
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Select an image first." }, { status: 400 });
  const extension = fileTypes[file.type];
  if (!extension) return NextResponse.json({ error: "Only JPG, PNG and WebP images are supported." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Image must be 5 MB or smaller." }, { status: 400 });
  const filename = `${randomUUID()}${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Vercel's filesystem is read-only. Production uploads must use object storage.
  if (supabaseUrl && serviceRoleKey) {
    const objectPath = `products/${filename}`;
    const response = await fetch(`${supabaseUrl}/storage/v1/object/${STORAGE_BUCKET}/${objectPath}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${serviceRoleKey}`, apikey: serviceRoleKey, "Content-Type": file.type, "x-upsert": "false" },
      body: bytes,
    });
    if (!response.ok) {
      return NextResponse.json({ error: "Image storage upload failed. Check the Supabase bucket and server key." }, { status: 502 });
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
