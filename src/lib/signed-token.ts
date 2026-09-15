import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

type Claims = { purpose: string; subject: string; expires: number; nonce: string };

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32 || /REPLACE|PLACEHOLDER/.test(value)) throw new Error("SESSION_SECRET must contain at least 32 random characters.");
  return value;
}

export function issueToken(purpose: string, subject: string, lifetimeSeconds: number, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ purpose, subject, expires: now + lifetimeSeconds * 1000, nonce: randomBytes(16).toString("hex") } satisfies Claims)).toString("base64url");
  return `${payload}.${createHmac("sha256", secret()).update(payload).digest("base64url")}`;
}

export function verifyToken(token: unknown, purpose: string, subject: string, now = Date.now()): boolean {
  if (typeof token !== "string" || token.length > 2048) return false;
  try {
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra !== undefined) return false;
    const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
    const received = Buffer.from(signature);
    if (received.length !== expected.length || !timingSafeEqual(received, Buffer.from(expected))) return false;
    const claims: Claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return claims.purpose === purpose && claims.subject === subject && Number.isSafeInteger(claims.expires) && claims.expires > now;
  } catch { return false; }
}

export function adminSubject(user = process.env.ADMIN_USER ?? "", password = process.env.ADMIN_PASSWORD ?? "") {
  // Rotation of either credential invalidates existing sessions without putting credentials in the cookie.
  return createHmac("sha256", secret()).update(JSON.stringify([user, password])).digest("hex");
}

export function customerSubject(id: string, passwordHash: string) {
  // A password change invalidates existing sessions without putting the hash in the cookie.
  return createHmac("sha256", secret()).update(JSON.stringify([id, passwordHash])).digest("hex");
}
