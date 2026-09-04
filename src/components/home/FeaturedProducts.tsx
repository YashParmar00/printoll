import { listCatalogProducts } from "@/lib/catalog";
import ProductCard from "@/components/ui/ProductCard";

export default async function FeaturedProducts() {
  const featuredProducts = (await listCatalogProducts()).filter((product) => product.category === "personalized");
  return (
    <section id="featured" className="scroll-mt-28 py-16">
      <div className="container-page">
        <div className="mb-8 text-center">
          <p className="eyebrow">Bestselling Gifts</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">Made for the people you love</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink">
            Add a name or photo and preview it before you buy. Every order is Cash-on-Delivery
            friendly and backed by our 7-day damage replacement.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
