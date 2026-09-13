import { NextResponse, type NextRequest } from "next/server";
import { adminSubject, verifyToken } from "@/lib/signed-token";

/**
 * Protect the admin area with HTTP Basic auth (single founder login).
 * Next 16 renamed the `middleware` file convention to `proxy`.
 */
export const config = { matcher: ["/admin/:path*"] };

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
  const expectedUser = process.env.ADMIN_USER ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  const session = req.cookies.get("pairwear_admin")?.value ?? "";
  let configured = Boolean(expectedUser && expectedPass);
  try {
    if (configured && verifyToken(session, "admin", adminSubject(expectedUser, expectedPass))) return NextResponse.next();
  } catch {
    // adminSubject throws when SESSION_SECRET is missing or too short. Send the
    // admin to a readable config message instead of a bare 500.
    configured = false;
  }

  if (req.nextUrl.pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.redirect(new URL(configured ? "/admin/login" : "/admin/login?error=config", req.url));
}
