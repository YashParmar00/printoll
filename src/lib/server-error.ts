/** Operational event only: never log request bodies, credentials or Prisma query arguments. */
export function reportServerError(event: string, error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : error instanceof Error ? error.name : "unknown";
  console.error(JSON.stringify({ event, code }));
}
