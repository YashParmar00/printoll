"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { HomeCollection } from "@/lib/home-collections";
import type { CatalogCard as Product } from "@/lib/catalog-card";
import ProductCard from "@/components/ui/ProductCard";
import SortDropdown from "@/components/ui/SortDropdown";
import ShopFilters, { FilterOptions } from "@/components/ui/ShopFilters";

const budgets = [
  { value: "all", label: "Any price", min: 0, max: Infinity },
  { value: "under-700", label: "Under ₹700", min: 0, max: 699 },
  { value: "700-999", label: "₹700 – ₹999", min: 700, max: 999 },
  { value: "1000-plus", label: "₹1,000 & above", min: 1000, max: Infinity },
];
const edits = [
  { value: "all", label: "All prints" },
  { value: "bestsellers", label: "Best Sellers", badge: "Bestseller" },
  { value: "top-picks", label: "Top Picks", badge: "Top Pick" },
  { value: "trending", label: "Trending", badge: "Trending" },
];
const sorts = [{ value: "featured", label: "Recommended" }, { value: "low", label: "Price: low to high" }, { value: "high", label: "Price: high to low" }];
const filterGroups = [{ key: "budget" as const, title: "Your budget", options: budgets }, { key: "edit" as const, title: "Explore the edit", options: edits }];
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

function categoryKey(value: string) {
  const key = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return key === "mens" ? "men" : key === "womens" ? "women" : key === "couple-sets" ? "matching" : key;
}

function Icon({ kind, className = "h-4 w-4" }: { kind: "search" | "filter" | "close" | "arrow"; className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {kind === "search" ? <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></> : kind === "filter" ? <><path d="M4 7h7m4 0h5M4 17h3m4 0h9" /><circle cx="13" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></> : kind === "close" ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="m9 5 7 7-7 7" />}
  </svg>;
}

export default function CategoryClient({ products, collections }: { products: Product[]; collections: HomeCollection[] }) {
  const params = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const categories = useMemo(() => {
    const items = collections.map(collection => {
      const query = collection.href.split("?")[1] ?? "";
      return { label: collection.title, key: categoryKey(new URLSearchParams(query).get("category") ?? collection.title) };
    });
    for (const product of products) {
      const key = categoryKey(product.category);
      if (key && !items.some(item => item.key === key)) items.push({ label: key === "matching" ? "Matching" : product.category, key });
    }
    return items.filter((item, index) => item.key && items.findIndex(candidate => candidate.key === item.key) === index);
  }, [collections, products]);
  const category = categories.some(item => item.key === categoryKey(params.get("category") ?? "")) ? categoryKey(params.get("category")!) : "all";
  const budget = budgets.find(item => item.value === params.get("budget")) ?? budgets[0];
  const edit = edits.find(item => item.value === params.get("edit")) ?? edits[0];
  const sort = sorts.find(item => item.value === params.get("sort")) ?? sorts[0];
  const query = params.get("q") ?? "";
  const activeLabel = categories.find(item => item.key === category)?.label ?? "All prints";
  const filterCount = Number(budget.value !== "all") + Number(edit.value !== "all");

  function update(key: string, value: string, replace = false) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all" || value === "featured") next.delete(key);
    else next.set(key, value);
    const url = `/category${next.size ? `?${next}` : ""}`;
    if (replace) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
  }

  function previewCount(values: { budget: string; edit: string }) {
    const price = budgets.find(item => item.value === values.budget) ?? budgets[0];
    const pick = edits.find(item => item.value === values.edit) ?? edits[0];
    return products.filter(product => (category === "all" || categoryKey(product.category) === category) && product.price >= price.min && product.price <= price.max && (!pick.badge || product.badge === pick.badge) && (!query.trim() || `${product.name} ${product.tagline}`.toLowerCase().includes(query.trim().toLowerCase()))).length;
  }

  function applyFilters(values: { budget: string; edit: string }) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(values)) { if (value === "all") next.delete(key); else next.set(key, value); }
    window.history.pushState(null, "", `/category${next.size ? `?${next}` : ""}`);
  }

  const list = useMemo(() => {
    const search = query.trim().toLowerCase();
    const result = products.filter(product =>
      (category === "all" || categoryKey(product.category) === category) &&
      product.price >= budget.min && product.price <= budget.max &&
      (!edit.badge || product.badge === edit.badge) &&
      (!search || `${product.name} ${product.tagline}`.toLowerCase().includes(search)));
    if (sort.value !== "featured") result.sort((a, b) => sort.value === "low" ? a.price - b.price : b.price - a.price);
    return result;
  }, [products, category, budget, edit, query, sort]);

  return (
    <div className="container-page pb-12 pt-4 lg:pb-16 lg:pt-12">
      <div className="relative overflow-hidden py-2 lg:rounded-3xl lg:border lg:border-line lg:bg-gradient-to-br lg:from-blush lg:via-sand lg:to-paper lg:px-10 lg:py-10">
        <span aria-hidden="true" className="pointer-events-none absolute hidden lg:block -right-12 -top-24 h-72 w-72 rounded-full border border-coral/10 sm:right-10" />
        <span aria-hidden="true" className="pointer-events-none absolute hidden lg:block -right-4 -top-16 h-56 w-56 rounded-full border border-coral/10 sm:right-18" />
        <p className="eyebrow flex items-center gap-2 text-[10px] lg:text-xs"><span className="h-1.5 w-1.5 rounded-full bg-coral" /> The print collection</p>
        <h1 className="relative mt-2 text-[26px] lg:mt-3 lg:text-5xl">Find your kind of <span className="text-coral-light">print.</span></h1>
        <p className="relative mt-2 max-w-md text-xs leading-relaxed text-ink lg:mt-3 lg:text-sm">Printed tees, matching sets & everyday totes.</p>
      </div>

      <nav aria-label="Shop categories" className="mt-3 flex flex-wrap gap-1.5 border-b border-line pb-3 lg:mt-5 lg:gap-9 lg:pb-0">
        {[{ key: "all", label: "All prints" }, ...categories].map(item => {
          const count = item.key === "all" ? products.length : products.filter(product => categoryKey(product.category) === item.key).length;
          const selected = category === item.key;
          return <button key={item.key} type="button" aria-label={item.label} aria-pressed={selected} onClick={() => update("category", item.key)} className={`relative flex min-h-10 items-center justify-center gap-1 rounded-lg border px-2 text-[11px] font-semibold transition-colors lg:min-h-14 lg:justify-start lg:gap-2.5 lg:rounded-none lg:border-0 lg:border-b-2 lg:px-1 lg:text-sm ${focus} ${selected ? "border-coral/50 bg-coral/10 text-coral-light lg:border-coral lg:bg-transparent lg:text-white" : "border-line bg-sand text-ink hover:text-white lg:border-transparent lg:bg-transparent"}`}>
            <span className="sm:hidden">{item.key === "all" ? "All" : item.key === "gifts-more" ? "Gifts" : item.label}</span><span className="hidden sm:inline">{item.label}</span><span className={`hidden rounded-md px-1.5 py-0.5 text-[10px] tabular-nums sm:inline ${selected ? "bg-coral/15 text-coral-light" : "bg-white/5 text-ink"}`}>{count}</span>
          </button>;
        })}
      </nav>

      <div className="mt-3 lg:mt-6 lg:rounded-2xl lg:border lg:border-line lg:bg-sand">
        <div className="flex flex-wrap items-center gap-2 lg:gap-3 lg:p-4">
          <div className="relative min-w-0 flex-1">
            <Icon kind="search" className="pointer-events-none absolute left-2.5 top-2.5 lg:top-4 h-4 w-4 text-ink" />
            <input aria-label="Search prints" type="search" value={query} onChange={event => update("q", event.target.value, true)} placeholder="Search prints" className={`h-9 w-full rounded-lg border border-line bg-paper pl-8 pr-2 text-base lg:h-12 lg:rounded-xl lg:text-sm text-white placeholder:text-ink ${focus}`} />
          </div>
          <ShopFilters groups={filterGroups} values={{ budget: budget.value, edit: edit.value }} count={filterCount} desktopOpen={filtersOpen} onDesktopToggle={() => setFiltersOpen(!filtersOpen)} onApply={applyFilters} resultCount={previewCount} />
          <SortDropdown options={sorts} value={sort.value} onChange={value => update("sort", value)} />
        </div>
        <div id="shop-filters" className={`border-t border-line p-6 ${filtersOpen ? "hidden lg:block" : "hidden"}`}>
          {filtersOpen && <FilterOptions groups={filterGroups} values={{ budget: budget.value, edit: edit.value }} prefix="desktop" onChange={update} />}
        </div>
      </div>

      <div className="mb-4 mt-4 flex flex-wrap items-center justify-between gap-2 lg:mb-6 lg:mt-7 lg:gap-3">
        <h2 id="results-title" tabIndex={-1} className="text-lg outline-none lg:text-2xl">{activeLabel} <span role="status" aria-live="polite" className="ml-2 font-body text-xs font-normal text-ink">{list.length} {list.length === 1 ? "print" : "prints"}</span></h2>
        {(category !== "all" || filterCount > 0 || query || sort.value !== "featured") && <div className="flex flex-wrap items-center gap-2">
          {[...(category !== "all" ? [{ key: "category", label: activeLabel }] : []), ...(budget.value !== "all" ? [{ key: "budget", label: budget.label }] : []), ...(edit.value !== "all" ? [{ key: "edit", label: edit.label }] : []), ...(query ? [{ key: "q", label: `“${query}”` }] : [])].map(item => <button key={item.key} aria-label={`Remove ${item.label} filter`} onClick={() => update(item.key, "")} className={`flex min-h-9 max-w-60 items-center gap-2 rounded-full border border-coral/25 bg-coral/5 px-3 text-xs text-coral-light ${focus}`}><span className="truncate">{item.label}</span><Icon kind="close" className="h-3 w-3 shrink-0" /></button>)}
          <button onClick={() => window.history.pushState(null, "", "/category")} className={`min-h-10 rounded-md px-2 text-xs text-ink underline underline-offset-4 hover:text-white ${focus}`}>Clear all</button>
        </div>}
      </div>
      {list.length ? <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">{list.map(product => <ProductCard key={product.slug} product={product} />)}</div> : <div className="rounded-3xl border border-dashed border-line bg-sand/50 px-6 py-16 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-coral/10 text-coral"><Icon kind="search" className="h-6 w-6" /></div>
        <h3 className="text-2xl">Your print is still out there.</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink">No matches for this combination. Try another keyword or give your filters a little more room.</p>
        <button onClick={() => window.history.pushState(null, "", "/category")} className="btn-primary mt-6 text-sm">Explore all prints <Icon kind="arrow" /></button>
      </div>}
    </div>
  );
}
