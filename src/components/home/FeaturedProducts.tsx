import Link from "next/link";
import { listCatalogProducts } from "@/lib/catalog";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRightIcon } from "@/components/ui/icons";

export default async function FeaturedProducts() {
  const featuredProducts = (await listCatalogProducts()).slice(0, 16);
  return (
    <section id="featured" className="scroll-mt-28 bg-night py-12 sm:py-16">
      <div className="container-page">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow-dark text-[10px] sm:text-xs">Shop the collection</p>
            <h2 className="mt-1 text-2xl text-white sm:text-3xl md:text-4xl">Best selling sets</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-night-ink sm:mt-3 sm:text-base">
              Two tees per set, printed to order with your names — previewed live before you buy.
            </p>
          </div>
          <Link
            href="/category"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-coral hover:text-coral-light sm:text-sm"
          >
            See all sets <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
