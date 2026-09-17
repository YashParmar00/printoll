import Link from "next/link";
import { listCatalogCards } from "@/lib/catalog";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { ArrowRightIcon } from "@/components/ui/icons";

// Same tile at every index would look flat with photo-only cards, so a few
// grow to 2 columns / 2 rows from the md breakpoint up. Mobile stays a plain
// 2-up grid — jumping straight to the bento layout at md avoids an awkward
// uniform-3-column step at tablet widths that doesn't match either design.
const SPAN = ["md:col-span-2 md:row-span-2", "", "", "md:row-span-2", "", "md:col-span-2", "", "md:col-span-4"];
const BADGE_ORDER = ["Bestseller", "Top Pick", "Trending"];

export default async function FeaturedProducts() {
  const products = await listCatalogCards();
  // Round-robin across the three badges so the 8 spotlighted products don't
  // all come from one merchandising bucket.
  const byBadge = new Map(BADGE_ORDER.map(badge => [badge, products.filter(p => p.badge === badge)]));
  const spotlight: typeof products = [];
  for (let round = 0; spotlight.length < 8 && round < 4; round++) {
    for (const badge of BADGE_ORDER) {
      const item = byBadge.get(badge)?.[round];
      if (item) spotlight.push(item);
      if (spotlight.length === 8) break;
    }
  }
  if (!spotlight.length) return null;

  return (
    <section id="featured" className="scroll-mt-28 bg-night py-12 sm:py-16">
      <div className="container-page">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-9">
          <div>
            <p className="eyebrow-dark text-[10px] sm:text-xs">The Printoll edit</p>
            <h2 className="mt-1 text-2xl text-white sm:text-3xl md:text-4xl">Best Sellers, Top Picks &amp; Trending</h2>
          </div>
          <Link href="/edit" className="inline-flex items-center gap-1.5 text-xs font-semibold text-coral hover:text-coral-light sm:text-sm">
            See the full edit <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4 md:auto-rows-55 md:gap-5">
          {spotlight.map((product, i) => (
            <SpotlightCard key={product.slug} product={product} className={`aspect-3/4 md:aspect-auto md:h-full ${SPAN[i] ?? ""}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
