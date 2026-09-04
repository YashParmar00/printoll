"use client";

import { useState, type ChangeEvent } from "react";

const MAX_IMAGES = 5;

export default function ProductImageUpload({ initialUrls }: { initialUrls: string[] }) {
  const [urls, setUrls] = useState(initialUrls.slice(0, MAX_IMAGES));
  const [message, setMessage] = useState("");
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, MAX_IMAGES - urls.length);
    if (!files.length) return;
    setMessage("Uploading images…");
    try {
      const uploaded = await Promise.all(files.map(async (file) => {
        const data = new FormData(); data.append("image", file);
        const response = await fetch("/api/admin/upload", { method: "POST", body: data });
        const result = await response.json() as { url?: string; error?: string };
        if (!response.ok || !result.url) throw new Error(result.error ?? "Upload failed.");
        return result.url;
      }));
      setUrls((current) => [...current, ...uploaded].slice(0, MAX_IMAGES));
      setMessage("Images uploaded. Save product to publish them.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed. Please try again."); }
    event.target.value = "";
  }
  function updateUrl(index: number, value: string) { setUrls((current) => current.map((url, i) => i === index ? value : url)); }
  function remove(index: number) { setUrls((current) => current.filter((_, i) => i !== index)); }
  return <div className="mt-1"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{urls.map((url, index) => <div key={`${url}-${index}`} className="relative overflow-hidden rounded-xl border border-line bg-cream p-2"><img src={url} alt={`Product image ${index + 1}`} className="aspect-square w-full rounded-lg object-cover" /><span className="mt-1 block text-xs font-semibold text-plum">{index === 0 ? "Main photo" : `Photo ${index + 1}`}</span><input name="imageUrls" value={url} onChange={(event) => updateUrl(index, event.target.value)} className="mt-1 w-full rounded border border-line px-1 py-0.5 text-[10px]" /><button type="button" onClick={() => remove(index)} className="mt-1 text-xs font-semibold text-red-600">Remove</button></div>)}</div>{urls.length < MAX_IMAGES && <label className="mt-3 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-line px-4 py-3 text-sm font-semibold text-plum hover:border-plum">Upload photo {urls.length + 1} of {MAX_IMAGES}<input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={upload} className="sr-only" /></label>}{message && <p className="mt-2 text-xs text-ink">{message}</p>}<p className="mt-2 text-xs text-ink">First photo is the main image. Upload 1–5 photos; only uploaded photos appear on the product page.</p></div>;
}
