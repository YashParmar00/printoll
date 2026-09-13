"use server";

import { cookies, headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, sessionValue } from "@/lib/admin-auth";

export async function loginAction(formData: FormData) {
  if (!await rateLimit(await headers(), "admin-login", 5, 300)) redirect("/admin/login?error=limited");
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const expectedUser = process.env.ADMIN_USER ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedUser || !expectedPassword || username !== expectedUser || password !== expectedPassword) {
    redirect("/admin/login?error=invalid");
  }
  (await cookies()).set(ADMIN_SESSION_COOKIE, sessionValue(expectedUser, expectedPassword), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}
