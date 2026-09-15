import "server-only";
import { cookies } from "next/headers";
import { customerSubject, issueToken, verifyToken } from "@/lib/signed-token";
import { prisma } from "@/lib/prisma";

export const CUSTOMER_SESSION_COOKIE = "pairwear_customer";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 24 * 30; // 30 days

// Cookie is "<customerId>:<signedToken>" — issueToken's own output only ever
// contains base64url + hex chars, so a plain ":" split is unambiguous.
export async function setCustomerSession(customer: { id: string; passwordHash: string }) {
  const token = issueToken("customer", customerSubject(customer.id, customer.passwordHash), SESSION_LIFETIME_SECONDS);
  (await cookies()).set(CUSTOMER_SESSION_COOKIE, `${customer.id}:${token}`, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_LIFETIME_SECONDS,
  });
}

export async function clearCustomerSession() {
  (await cookies()).delete(CUSTOMER_SESSION_COOKIE);
}

export async function getCurrentCustomer() {
  const raw = (await cookies()).get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!raw) return null;
  const sep = raw.indexOf(":");
  if (sep < 1) return null;
  const id = raw.slice(0, sep);
  const token = raw.slice(sep + 1);
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer || !verifyToken(token, "customer", customerSubject(customer.id, customer.passwordHash))) return null;
  return customer;
}
