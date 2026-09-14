import Link from "next/link";
import { listCatalogCards } from "@/lib/catalog";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRightIcon } from "@/components/ui/icons";

const sections = [
  { title: "Best Sellers", badge: "Bestseller", description: "Printed favourites for your everyday rotation." },
  { title: "Top Picks", badge: "Top Pick", description: "Graphic tees and matching prints, picked for you." },
  { title: "Trending", badge: "Trending", description: "Streetwear graphics, playful prints and everyday totes." },
];

export default async function FeaturedProducts() {
  const products = await listCatalogCards();
  return (
    <section id="featured" className="scroll-mt-28 bg-night py-12 sm:py-16">
      <div className="container-page space-y-14 sm:space-y-20">
        {sections.map(section => {
          const selected = products.filter(product => product.badge === section.badge).slice(0, 3);
          if (!selected.length) return null;
          return (
            <div key={section.badge}>
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow-dark text-[10px] sm:text-xs">The Printoll edit</p>
                  <h2 className="mt-1 text-2xl text-white sm:text-3xl md:text-4xl">{section.title}</h2>
                  <p className="mt-2 text-sm text-night-ink sm:text-base">{section.description}</p>
                </div>
                <Link href="/category" className="inline-flex items-center gap-1.5 text-xs font-semibold text-coral hover:text-coral-light sm:text-sm">
                  Explore collections <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
                {selected.map(product => <ProductCard key={product.slug} product={product} sizes="(min-width: 1280px) 384px, (min-width: 768px) 30vw, 46vw" />)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
