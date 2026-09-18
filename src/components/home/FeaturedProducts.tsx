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
        <div className="relative mb-7 sm:mb-9">
          <div>
           <div className="flex items-baseline">
             <p className="eyebrow-dark text-[9px] sm:text-xs">The Printoll edit</p>
              <div>
                <Link href="/edit" className="absolute right-0 top-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-coral hover:text-coral-light sm:text-sm">
            <span className="sm:hidden">See all</span><span className="hidden sm:inline">See the full edit</span> <ArrowRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
              </div>
           </div>
            <h2 className="mt-1 text-[22px] text-white sm:text-3xl md:text-4xl">Best Sellers, Top Picks &amp; Trending</h2>
          </div>
         
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
