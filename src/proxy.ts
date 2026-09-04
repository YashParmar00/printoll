import { NextResponse, type NextRequest } from "next/server";

/**
 * Protect the admin area with HTTP Basic auth (single founder login).
 * Next 16 renamed the `middleware` file convention to `proxy`.
 */
export const config = { matcher: ["/admin/:path*"] };

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
  const expectedUser = process.env.ADMIN_USER ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  const session = req.cookies.get("auraamarts_admin")?.value ?? "";
  const sessionValue = btoa(`${expectedUser}:${expectedPass}`);

  if (expectedUser && expectedPass && session === sessionValue) return NextResponse.next();

  if (req.nextUrl.pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.redirect(new URL("/admin/login", req.url));
}
