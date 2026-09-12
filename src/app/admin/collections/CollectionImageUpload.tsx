"use client";

import { useState, type ChangeEvent } from "react";

export default function CollectionImageUpload({ initialUrl }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [message, setMessage] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage("Uploading photo…");
    try {
      const data = new FormData();
      data.append("image", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: data });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? "Upload failed.");
      setUrl(result.url);
      setMessage("Photo uploaded. Save collection to publish it.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed. Please try again.");
    }
    event.target.value = "";
  }

  return <div className="mt-1">
    {/* eslint-disable-next-line @next/next/no-img-element -- accepts admin-uploaded URLs outside the Image allow-list */}
    {url && <img src={url} alt="Collection preview" className="mb-3 aspect-[4/5] w-40 rounded-xl border border-line object-cover" />}
    <input name="imageUrl" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://… or upload below" className="field" />
    <label className="mt-3 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-line px-4 py-3 text-sm font-semibold text-plum hover:border-plum">Upload collection photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} className="sr-only" /></label>
    {message && <p className="mt-2 text-xs text-ink">{message}</p>}
  </div>;
}
