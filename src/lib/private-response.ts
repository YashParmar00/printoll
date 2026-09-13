import { NextResponse } from "next/server";

export function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" } });
}

export async function boundedText(request: Request, limit = 32_768) {
  return (await boundedBytes(request, limit)).toString("utf8");
}

export async function boundedBytes(request: Request, limit: number) {
  if (Number(request.headers.get("content-length")) > limit) throw new Error("Request too large.");
  const reader = request.body?.getReader();
  if (!reader) return Buffer.alloc(0);
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > limit) { await reader.cancel(); throw new Error("Request too large."); }
      chunks.push(value);
    }
    return Buffer.concat(chunks);
  } finally { reader.releaseLock(); }
}
