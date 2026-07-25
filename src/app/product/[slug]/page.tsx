import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, products, relatedProducts } from "@/lib/products";
import { inr } from "@/lib/format";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import PersonalizationStudio from "@/components/product/PersonalizationStudio";
import ProductFAQ from "@/components/product/ProductFAQ";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import { CheckIcon } from "@/components/ui/icons";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — ${inr(product.price)}`,
    description: `${product.tagline} ${product.description[0]}`.slice(0, 155),
    openGraph: { title: product.name, description: product.tagline, type: "website" },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedProducts(product.slug, 3);

  return (
    <div className="pb-24 lg:pb-0">
      <div className="container-page pt-6">
        <Breadcrumbs name={product.name} />
      </div>

      <section className="container-page mt-4">
        <PersonalizationStudio product={product} />
      </section>

      {/* Description + highlights */}
      <section className="container-page mt-14 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-2xl sm:text-3xl">Why you&apos;ll love it</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-ink">
            {product.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <ProductFAQ faqs={product.faqs} />
        </div>
        <aside>
          <div className="rounded-2xl border border-line bg-cream p-6">
            <h3 className="text-lg">What&apos;s included</h3>
            <ul className="mt-3 space-y-2.5">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-sm text-charcoal">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-plum" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <div className="mt-14">
        <ProductReviews product={product} />
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}
