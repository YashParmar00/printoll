import Link from "next/link";
import { listCatalogProducts } from "@/lib/catalog";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRightIcon } from "@/components/ui/icons";

export default async function FeaturedProducts() {
  const featuredProducts = (await listCatalogProducts()).slice(0, 3);
  return (
    <section id="featured" className="scroll-mt-28 bg-night py-20">
      <div className="container-page">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow-dark">Picked for right now</p>
            <h2 className="mt-2 text-3xl text-white sm:text-4xl">Best-loved sets</h2>
            <p className="mt-3 max-w-lg text-night-ink">
              Two tees per set, printed to order with your names — previewed live before you buy.
            </p>
          </div>
          <Link
            href="/category"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-coral hover:text-coral-light"
          >
            See all sets <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
