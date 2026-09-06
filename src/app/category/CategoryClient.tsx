"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";

type Sort = "featured" | "low" | "high";

/** Shop-all grid, filtered by occasion (every product is a couple set). */
export default function CategoryClient({ products }: { products: Product[] }) {
  const [occasion, setOccasion] = useState("All");
  const [sort, setSort] = useState<Sort>("featured");

  const occasions = useMemo(
    () => ["All", ...Array.from(new Set(products.flatMap((product) => product.occasions)))],
    [products],
  );

  const list = useMemo(() => {
    let result = products;
    if (occasion !== "All") result = result.filter((p) => p.occasions.includes(occasion));
    if (sort === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [products, occasion, sort]);

  return (
    <div className="container-page py-12">
      <p className="eyebrow">Shop</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">All couple sets</h1>
      <p className="mt-3 max-w-xl text-ink">
        Two tees per set, printed with your names. Filter by the occasion you&apos;re buying for.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {occasions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setOccasion(item)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                occasion === item
                  ? "border-coral bg-coral text-white"
                  : "border-line bg-night-card text-noir hover:border-coral/40"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-ink">
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="rounded-lg border border-line bg-night-card px-3 py-1.5 text-sm text-noir"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>

      {list.length ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {list.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-2xl border border-line bg-sand p-10 text-center text-ink">
          No sets match this filter yet.
        </p>
      )}
    </div>
  );
}
