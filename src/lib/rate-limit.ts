import { createHmac } from "node:crypto";
import { prisma } from "@/lib/prisma";

/** Shared across function instances. The fixed bucket is reused; no per-window rows. */
export async function rateLimit(requestHeaders: Headers, scope: string, maximum: number, seconds = 60) {
  // Vercel overwrites this header at its trusted ingress. Other deployments use a
  // conservative shared bucket rather than trusting a spoofable forwarded IP.
  const identity = process.env.VERCEL ? requestHeaders.get("x-vercel-forwarded-for") ?? "unknown" : "local";
  const key = createHmac("sha256", process.env.SESSION_SECRET ?? "local-rate-limit").update(`${scope}:${identity}`).digest("hex");
  const result = await prisma.$queryRaw<Array<{ count: number }>>`
    INSERT INTO "RequestLimit" ("key", "count", "resetAt") VALUES (${key}, 1, NOW() + ${seconds} * INTERVAL '1 second')
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "RequestLimit"."resetAt" <= NOW() THEN 1 ELSE "RequestLimit"."count" + 1 END,
      "resetAt" = CASE WHEN "RequestLimit"."resetAt" <= NOW() THEN NOW() + ${seconds} * INTERVAL '1 second' ELSE "RequestLimit"."resetAt" END
    RETURNING "count"`;
  return result[0].count <= maximum;
}
