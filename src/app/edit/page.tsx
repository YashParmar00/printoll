import Link from "next/link";
import type { Metadata } from "next";
import { listCatalogCards } from "@/lib/catalog";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "The Printoll Edit",
  description: "Best Sellers, Top Picks and Trending — everything the home page spotlights, all in one place.",
};

const sections = [
  { title: "Best Sellers", badge: "Bestseller", description: "Printed favourites for your everyday rotation." },
  { title: "Top Picks", badge: "Top Pick", description: "Graphic tees and matching prints, picked for you." },
  { title: "Trending", badge: "Trending", description: "Streetwear graphics, playful prints and everyday totes." },
];

export default async function EditPage() {
  const products = await listCatalogCards();
  const used = new Set<string>();

  return (
    <div className="bg-night py-12 sm:py-16">
      <div className="container-page">
        <p className="eyebrow-dark text-[10px] sm:text-xs">Curated by Printoll</p>
        <h1 className="mt-2 text-3xl text-white sm:text-4xl md:text-5xl">The Printoll Edit</h1>
        <p className="mt-2 max-w-xl text-sm text-night-ink sm:text-base">Best Sellers, Top Picks and what&apos;s Trending right now — everything we spotlight, in one place.</p>
      </div>

      <div className="container-page mt-10 space-y-14 sm:mt-14 sm:space-y-20">
        {sections.map(section => {
          const selected = products.filter(product => product.badge === section.badge && !used.has(product.slug));
          selected.forEach(product => used.add(product.slug));
          if (!selected.length) return null;
          return (
            <div key={section.badge} id={section.badge.toLowerCase().replace(" ", "-")} className="scroll-mt-28">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl text-white sm:text-3xl md:text-4xl">{section.title}</h2>
                  <p className="mt-2 text-sm text-night-ink sm:text-base">{section.description}</p>
                </div>
                <Link href="/category" className="inline-flex items-center gap-1.5 text-xs font-semibold text-coral hover:text-coral-light sm:text-sm">
                  Explore the full shop <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                {selected.map(product => <ProductCard key={product.slug} product={product} sizes="(min-width: 1280px) 288px, (min-width: 768px) 22vw, 46vw" />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
