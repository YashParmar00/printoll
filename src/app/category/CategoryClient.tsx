"use client";

import { useMemo, useState } from "react";
import type { HomeCollection } from "@/lib/home-collections";
import type { Product } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";

type Sort = "featured" | "low" | "high";

function categoryKey(value: string) {
  const key = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return key === "mens" ? "men" : key === "womens" ? "women" : key;
}
// Existing launch products were stored as "couple-sets". Keep them visible
// under Matching without needing a catalogue migration.
const productCategoryKey = (product: Product) => categoryKey(product.category) === "couple-sets" ? "matching" : categoryKey(product.category);

/** Shop grid, connected to the same categories that power the homepage cards. */
export default function CategoryClient({
  products,
  collections,
  initialCategory,
}: {
  products: Product[];
  collections: HomeCollection[];
  initialCategory?: string;
}) {
  const categories = useMemo(() => {
    const items = collections.map((collection) => ({ label: collection.title, key: categoryKey(collection.title) }));
    for (const product of products) {
      const key = productCategoryKey(product);
      if (key && !items.some((item) => item.key === key)) items.push({ label: product.category === "couple-sets" ? "Matching" : product.category, key });
    }
    return items.filter((item, index) => item.key && items.findIndex((candidate) => candidate.key === item.key) === index);
  }, [collections, products]);

  const requestedCategory = categoryKey(initialCategory ?? "");
  const validInitialCategory = categories.some((item) => item.key === requestedCategory) ? requestedCategory : "all";
  const [category, setCategory] = useState(validInitialCategory);
  const [sort, setSort] = useState<Sort>("featured");

  const list = useMemo(() => {
    let result = products;
    if (category !== "all") result = result.filter((product) => productCategoryKey(product) === category);
    if (sort === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [products, category, sort]);

  function chooseCategory(nextCategory: string) {
    setCategory(nextCategory);
    const query = nextCategory === "all" ? "" : `?category=${encodeURIComponent(nextCategory)}`;
    window.history.pushState(null, "", `/category${query}`);
  }

  const activeLabel = categories.find((item) => item.key === category)?.label;

  return (
    <div className="container-page py-12">
      <p className="eyebrow">Shop</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">{activeLabel ? activeLabel : "All collections"}</h1>
      <p className="mt-3 max-w-xl text-ink">
        Browse tees, matching styles and gifts. Select a collection to find a print that feels like you.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" aria-label="Shop categories">
          <button type="button" onClick={() => chooseCategory("all")} className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${category === "all" ? "border-coral bg-coral text-white" : "border-line bg-night-card text-noir hover:border-coral/40"}`}>All</button>
          {categories.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => chooseCategory(item.key)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${category === item.key ? "border-coral bg-coral text-white" : "border-line bg-night-card text-noir hover:border-coral/40"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-ink">
          Sort
          <span className="relative">
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="appearance-none rounded-lg border border-line bg-night-card py-1.5 pl-3 pr-10 text-sm text-noir">
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
            <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m5 7 5 5 5-5" /></svg>
          </span>
        </label>
      </div>

      {list.length ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {list.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      ) : (
        <p className="mt-10 rounded-2xl border border-line bg-sand p-10 text-center text-ink">
          No products in {activeLabel ?? "this collection"} yet. Add products to this category from the admin product editor.
        </p>
      )}
    </div>
  );
}
