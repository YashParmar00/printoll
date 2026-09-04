import "server-only";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "auraamarts_admin";

export function sessionValue(user = process.env.ADMIN_USER ?? "", password = process.env.ADMIN_PASSWORD ?? "") {
  return Buffer.from(`${user}:${password}`, "utf8").toString("base64");
}

export async function isAdminSession() {
  const user = process.env.ADMIN_USER ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!user || !password) return false;
  return (await cookies()).get(ADMIN_SESSION_COOKIE)?.value === sessionValue(user, password);
}
