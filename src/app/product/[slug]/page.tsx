import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findCatalogProduct, listCatalogProducts, relatedCatalogProducts } from "@/lib/catalog";
import { inr } from "@/lib/format";
import { site } from "@/lib/site";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import PersonalizationStudio from "@/components/product/PersonalizationStudio";
import ProductFAQ from "@/components/product/ProductFAQ";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import { CheckIcon } from "@/components/ui/icons";

export const revalidate = 300;
// Prebuild every product page at deploy time so the first visitor after a deploy
// gets a cached page instead of a cold ~2s server render. New slugs still render
// on demand; if the catalogue can't be read at build, fall back to that.
export async function generateStaticParams() {
  try {
    return (await listCatalogProducts()).map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await findCatalogProduct(slug);
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
  const product = await findCatalogProduct(slug);
  if (!product) notFound();



  // Product structured data. No aggregateRating — we never fabricate reviews.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      url: `${site.url}/product/${product.slug}`,
    },
  };

  return (
    <div className="pb-24 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="container-page pt-6">
        <Breadcrumbs name={product.name} />
      </div>

      <section className="container-page mt-4">
        <PersonalizationStudio product={product} />
      </section>

      {/* Description + highlights */}
      <section className="container-page mt-14 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-2xl text-white sm:text-3xl">Why you&apos;ll love it</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-ink">
            {product.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <ProductFAQ faqs={product.faqs} />
        </div>
        <aside>
          <div className="rounded-2xl border border-line bg-night-card p-6">
            <h3 className="text-lg text-white">What&apos;s included</h3>
            <ul className="mt-3 space-y-2.5">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-sm text-ink">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
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

      <Suspense fallback={<div className="container-page min-h-80 py-10">More designs...</div>}><RelatedSection slug={product.slug} /></Suspense>
    </div>
  );
}

async function RelatedSection({ slug }: { slug: string }) { return <RelatedProducts products={await relatedCatalogProducts(slug, 3)} />; }
