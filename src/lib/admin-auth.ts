import "server-only";
import { cookies } from "next/headers";
import { adminSubject, issueToken, verifyToken } from "@/lib/signed-token";

export const ADMIN_SESSION_COOKIE = "pairwear_admin";

export function sessionValue(user = process.env.ADMIN_USER ?? "", password = process.env.ADMIN_PASSWORD ?? "") {
  return issueToken("admin", adminSubject(user, password), 60 * 60 * 12);
}

export async function isAdminSession() {
  const user = process.env.ADMIN_USER ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!user || !password) return false;
  return verifyToken((await cookies()).get(ADMIN_SESSION_COOKIE)?.value, "admin", adminSubject(user, password));
}
