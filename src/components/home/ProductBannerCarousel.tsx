"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HomeCollection } from "@/lib/home-collections";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/products";
import { ArrowRightIcon } from "@/components/ui/icons";

type Props = { collections: HomeCollection[] };

/** A touch-first three-card carousel for admin-managed homepage collections. */
export default function ProductBannerCarousel({ collections }: Props) {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);
  const count = collections.length;

  function goTo(index: number) {
    setActive((index + count) % count);
  }

  useEffect(() => {
    if (count < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % count), 5000);
    return () => window.clearInterval(timer);
  }, [count]);

  if (!count) return null;
  // Render precisely three slots, rather than scrolling a wider track. This
  // guarantees no partial fourth card can appear at either edge.
  const visibleProducts = Array.from(
    { length: Math.min(3, count) },
    (_, slot) => collections[(active + slot) % count],
  );

  function startSwipe(clientX: number) { touchStart.current = clientX; }
  function finishSwipe(clientX: number) {
    if (touchStart.current === null) return;
    const distance = clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(distance) < 40) return;
    goTo(active + (distance < 0 ? 1 : -1));
  }

  return (
    <section id="collections" aria-label="Featured collections" className="scroll-mt-28 overflow-hidden bg-night py-8 sm:py-10">
      <div className="container-page">
        <div className="mb-5 grid grid-cols-3 items-center gap-2 sm:gap-4">
          <div className="col-span-2">
            <p className="eyebrow-dark text-[10px] sm:text-xs">Explore collections</p>
            <h2 className="mt-1 text-xl text-white sm:text-2xl md:text-3xl">Shop your style</h2>
          </div>
          {count > 1 && (
            <div className="hidden justify-self-end gap-2 sm:flex">
              <button type="button" onClick={() => goTo(active - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-xl text-white transition hover:bg-white/15" aria-label="Previous banner">&#8249;</button>
              <button type="button" onClick={() => goTo(active + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-xl text-white transition hover:bg-white/15" aria-label="Next banner">&#8250;</button>
            </div>
          )}
        </div>
        <div
          className="grid touch-pan-y grid-cols-3 gap-2 sm:gap-4"
          onTouchStart={(event) => startSwipe(event.touches[0]?.clientX ?? 0)}
          onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}
        >
        {visibleProducts.map((collection, index) => {
          const image = collection.imageUrl ?? FALLBACK_PRODUCT_IMAGE;
          return (
            <article key={`${active}-${collection.id}`} className="relative h-[195px] min-w-0 overflow-hidden rounded-xl border border-white/10 bg-night-card sm:h-[300px] sm:rounded-2xl lg:h-[340px]">
              <Image src={image} alt={collection.title} fill sizes="(min-width: 1024px) 384px, 33vw" className="object-cover transition duration-500" priority={index < 3} />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-night via-night/65 to-transparent" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/55 via-transparent to-transparent" />
              <div className="relative flex h-full max-w-none flex-col justify-end p-3 sm:max-w-[78%] sm:justify-center sm:p-5 lg:p-7">
                <span className="hidden w-fit rounded-full border border-coral/30 bg-coral/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-coral-light sm:-ml-2.5 sm:inline-flex">Collection</span>
                <h3 className="mt-1 whitespace-nowrap text-[10px] leading-snug tracking-tight text-white sm:mt-3 sm:whitespace-normal sm:text-lg sm:tracking-normal md:text-2xl lg:text-3xl">{collection.title}</h3>
                <p className="mt-2 hidden line-clamp-2 text-sm text-white/75 lg:block">{collection.description}</p>
                <Link href={collection.href} className="mt-2 inline-flex w-fit items-center gap-1 text-[10px] font-bold text-coral-light hover:text-white sm:mt-4 sm:text-sm">Shop <ArrowRightIcon className="h-3.5 w-3.5" /></Link>
              </div>
            </article>
          );
        })}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {collections.map((collection, index) => <button key={collection.id} type="button" onClick={() => goTo(index)} aria-label={`Show ${collection.title}`} aria-current={active === index ? "true" : undefined} className={`h-1.5 rounded-full transition-all ${active === index ? "w-6 bg-coral" : "w-1.5 bg-white/30 hover:bg-white/60"}`} />)}
        </div>
      )}
    </section>
  );
}
