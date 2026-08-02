import { NextResponse, type NextRequest } from "next/server";

/**
 * Protect the admin area with HTTP Basic auth (single founder login).
 * Next 16 renamed the `middleware` file convention to `proxy`.
 */
export const config = { matcher: ["/admin/:path*"] };

export function proxy(req: NextRequest) {
  const expectedUser = process.env.ADMIN_USER ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  const header = req.headers.get("authorization") ?? "";

  if (expectedPass.length > 0 && header.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(header.slice(6));
    } catch {
      decoded = "";
    }
    const sep = decoded.indexOf(":");
    const user = sep >= 0 ? decoded.slice(0, sep) : "";
    const pass = sep >= 0 ? decoded.slice(sep + 1) : "";
    if (user === expectedUser && pass === expectedPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="AuraaMarts Admin", charset="UTF-8"' },
  });
}
