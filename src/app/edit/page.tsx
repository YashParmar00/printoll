import Link from "next/link";
import type { Metadata } from "next";
import { listCatalogCards } from "@/lib/catalog";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "The Printoll Edit",
  description: "Best Sellers, Top Picks and Trending — everything the home page spotlights, all in one place.",
};

export default async function EditPage() {
  const products = await listCatalogCards();
  const selected = [...products.filter(product => product.badge === "Bestseller"), ...products.filter(product => product.badge !== "Bestseller")].slice(0, 6);

  return (
    <div className="bg-night py-12 sm:py-16">
      <div className="container-page">
        <p className="eyebrow-dark text-[10px] sm:text-xs">Curated by Printoll</p>
        <h1 className="mt-2 text-3xl text-white sm:text-4xl md:text-5xl">The Printoll Edit</h1>
        <p className="mt-2 max-w-xl text-sm text-night-ink sm:text-base">Best Sellers, Top Picks and what&apos;s Trending right now — everything we spotlight, in one place.</p>
      </div>

      <div className="container-page mt-10 sm:mt-14">
        <div id="best-sellers" className="scroll-mt-28">
          <div className="mb-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl text-white sm:text-3xl md:text-4xl">Best Sellers</h2>
              <Link href="/category" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-coral hover:text-coral-light sm:text-sm">
              View all <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-2 text-sm text-night-ink sm:text-base">Printed favourites for your everyday rotation.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
            {selected.map(product => <ProductCard key={product.slug} product={product} sizes="(min-width: 1280px) 384px, (min-width: 768px) 30vw, 46vw" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
