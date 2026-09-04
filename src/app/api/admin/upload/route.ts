import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, sessionValue } from "@/lib/admin-auth";

export const runtime = "nodejs";

const fileTypes: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

function authorized(request: Request) {
  const user = process.env.ADMIN_USER ?? "";
  const pass = process.env.ADMIN_PASSWORD ?? "";
  if (!user || !pass) return false;
  const cookie = request.headers.get("cookie") ?? "";
  return cookie.split(";").some((part) => part.trim() === `${ADMIN_SESSION_COOKIE}=${sessionValue(user, pass)}`);
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const formData = await request.formData();
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Select an image first." }, { status: 400 });
  const extension = fileTypes[file.type];
  if (!extension) return NextResponse.json({ error: "Only JPG, PNG and WebP images are supported." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Image must be 5 MB or smaller." }, { status: 400 });
  const folder = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(folder, { recursive: true });
  const filename = `${randomUUID()}${extension}`;
  await writeFile(path.join(folder, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/products/${filename}` });
}
