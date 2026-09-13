"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, sessionValue } from "@/lib/admin-auth";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const expectedUser = process.env.ADMIN_USER ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedUser || !expectedPassword || username !== expectedUser || password !== expectedPassword) {
    redirect("/admin/login?error=invalid");
  }
  let token: string;
  try {
    token = sessionValue(expectedUser, expectedPassword);
  } catch {
    redirect("/admin/login?error=config"); // SESSION_SECRET missing or too short
  }
  (await cookies()).set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}
