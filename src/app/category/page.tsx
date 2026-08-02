"use client";

import { useMemo, useState } from "react";
import { products } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";

const OCCASIONS = ["All", "Rakhi", "Birthday", "Anniversary"] as const;
type Occasion = (typeof OCCASIONS)[number];
type Sort = "featured" | "low" | "high";

export default function CategoryPage() {
  const [occasion, setOccasion] = useState<Occasion>("All");
  const [sort, setSort] = useState<Sort>("featured");

  // "Personalized Gifts" category. Future categories (e.g. Wellness) become new
  // menu items filtering on `category` — no rebuild needed.
  const list = useMemo(() => {
    let out = products.filter((p) => p.category === "personalized");
    if (occasion !== "All") out = out.filter((p) => p.occasions.includes(occasion));
    if (sort === "low") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "high") out = [...out].sort((a, b) => b.price - a.price);
    return out;
  }, [occasion, sort]);

  return (
    <div className="container-page py-12">
      <p className="eyebrow">Shop</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Personalized Gifts</h1>
      <p className="mt-3 max-w-xl text-ink">
        Made just for them — add a name or photo and preview it before you buy.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOccasion(o)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                occasion === o
                  ? "border-plum bg-plum text-white"
                  : "border-line bg-white text-charcoal hover:border-plum"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-ink">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm text-charcoal"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>

      {list.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-line bg-cream p-10 text-center text-ink">
          No gifts match this filter yet.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
