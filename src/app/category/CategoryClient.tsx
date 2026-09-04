"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";

type Sort = "featured" | "low" | "high";

export default function CategoryClient({ products }: { products: Product[] }) {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<Sort>("featured");
  const list = useMemo(() => {
    let result = products;
    if (category !== "All") result = result.filter((product) => product.category === category);
    if (sort === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [products, category, sort]);
  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];
  return <div className="container-page py-12"><p className="eyebrow">Shop</p><h1 className="mt-2 text-3xl sm:text-4xl">Shop all products</h1><p className="mt-3 max-w-xl text-ink">Find a thoughtful gift or something made for everyday wellbeing.</p><div className="mt-6 flex flex-wrap items-center justify-between gap-4"><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${category === item ? "border-plum bg-plum text-white" : "border-line bg-white text-charcoal hover:border-plum"}`}>{item}</button>)}</div><label className="flex items-center gap-2 text-sm text-ink">Sort<select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm text-charcoal"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div>{list.length ? <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">{list.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <p className="mt-10 rounded-2xl border border-line bg-cream p-10 text-center text-ink">No products match this filter yet.</p>}</div>;
}
