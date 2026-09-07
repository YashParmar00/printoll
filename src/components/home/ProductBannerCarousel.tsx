"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/products";
import { ArrowRightIcon } from "@/components/ui/icons";

type Props = { products: Product[] };

/** A fixed three-card carousel with no clipped cards at either edge. */
export default function ProductBannerCarousel({ products }: Props) {
  const [active, setActive] = useState(0);
  const count = products.length;

  function goTo(index: number) {
    setActive((index + count) % count);
  }

  useEffect(() => {
    if (count < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % count), 5000);
    return () => window.clearInterval(timer);
  }, [active, count]);

  if (!count) return null;
  // Render precisely three slots, rather than scrolling a wider track. This
  // guarantees no partial fourth card can appear at either edge.
  const visibleProducts = Array.from(
    { length: Math.min(3, count) },
    (_, slot) => products[(active + slot) % count],
  );

  return (
    <section aria-label="Featured collections" className="overflow-hidden bg-night py-8 sm:py-10">
      <div className="container-page">
        <div className="mb-5 grid grid-cols-3 items-center gap-2 sm:gap-4">
          <div className="col-span-2">
            <p className="eyebrow-dark text-[10px] sm:text-xs">Explore our collection</p>
            <h2 className="mt-1 text-xl text-white sm:text-2xl md:text-3xl">Made to match</h2>
          </div>
          {count > 1 && (
            <div className="flex justify-self-end gap-2">
              <button type="button" onClick={() => goTo(active - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-xl text-white transition hover:bg-white/15" aria-label="Previous banner">&#8249;</button>
              <button type="button" onClick={() => goTo(active + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-xl text-white transition hover:bg-white/15" aria-label="Next banner">&#8250;</button>
            </div>
          )}
        </div>
        {/* A three-column viewport: all three banners are complete at every size. */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {visibleProducts.map((product, index) => {
          const image = product.imageUrls?.[0] ?? product.imageUrl ?? FALLBACK_PRODUCT_IMAGE;
          return (
            <article key={`${active}-${product.slug}`} className="relative min-w-0 h-[145px] overflow-hidden rounded-xl border border-white/10 bg-night-card sm:h-[220px] sm:rounded-2xl lg:h-[285px]">
              <Image src={image} alt={product.name} fill sizes="(min-width: 1024px) 384px, 33vw" className="object-cover transition duration-500" priority={index < 3} />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-night via-night/65 to-transparent" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/55 via-transparent to-transparent" />
              <div className="relative flex h-full max-w-[78%] flex-col justify-end p-3 sm:justify-center sm:p-5 lg:p-7">
                <span className="hidden w-fit rounded-full border border-coral/30 bg-coral/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-coral-light sm:inline-flex">{product.badge ?? "Couple collection"}</span>
                <h3 className="mt-1 line-clamp-2 text-[11px] leading-snug text-white sm:mt-3 sm:text-base md:text-xl lg:text-2xl">{product.name}</h3>
                <p className="mt-2 hidden line-clamp-2 text-sm text-white/75 lg:block">{product.tagline}</p>
                <Link href={`/product/${product.slug}`} className="mt-2 inline-flex w-fit items-center gap-1 text-[10px] font-bold text-coral-light hover:text-white sm:mt-4 sm:text-sm">Shop <ArrowRightIcon className="h-3.5 w-3.5" /></Link>
              </div>
            </article>
          );
        })}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {products.map((product, index) => <button key={product.slug} type="button" onClick={() => goTo(index)} aria-label={`Show ${product.name}`} aria-current={active === index ? "true" : undefined} className={`h-1.5 rounded-full transition-all ${active === index ? "w-6 bg-coral" : "w-1.5 bg-white/30 hover:bg-white/60"}`} />)}
        </div>
      )}
    </section>
  );
}
