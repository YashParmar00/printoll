import { cookies } from "next/headers";
import { issueToken, verifyToken } from "@/lib/signed-token";
import type { NextResponse } from "next/server";

function cookieName(orderNumber: string) { return `receipt_${orderNumber}`; }
export function withReceipt(response: NextResponse, orderNumber: string) {
  response.cookies.set(cookieName(orderNumber), issueToken("receipt", orderNumber, 7 * 24 * 3600), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/thank-you", maxAge: 7 * 24 * 3600 });
  return response;
}
export async function hasReceipt(orderNumber: unknown) {
  if (typeof orderNumber !== "string" || !/^AM-\d{8}-[A-F0-9]{4,16}$/.test(orderNumber)) return false;
  return verifyToken((await cookies()).get(cookieName(orderNumber))?.value, "receipt", orderNumber);
}
