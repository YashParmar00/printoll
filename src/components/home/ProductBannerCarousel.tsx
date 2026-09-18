"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useVisibleRotation } from "@/lib/use-visible-rotation";
import type { HomeCollection } from "@/lib/home-collections";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/products";
import { ArrowRightIcon } from "@/components/ui/icons";

type Props = { collections: HomeCollection[] };

/**
 * A native horizontally-scrolling, scroll-snap carousel — the browser owns
 * the swipe (momentum, rubber-banding, mid-drag tracking), so it's always
 * smooth on touch. The old version computed "3 visible slots" from a JS
 * touch-delta and swapped them on release, which felt like a hard jump
 * instead of a swipe.
 */
export default function ProductBannerCarousel({ collections }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = collections.length;

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    const card = track?.children[(index + count) % count] as HTMLElement | undefined;
    if (track && card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }

  // Keep the active dot synced to whichever card the shopper actually swiped
  // to, not just button clicks.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!track) return;
        let closest = 0;
        let closestDistance = Infinity;
        Array.from(track.children).forEach((child, i) => {
          const distance = Math.abs((child as HTMLElement).offsetLeft - track.offsetLeft - track.scrollLeft);
          if (distance < closestDistance) { closestDistance = distance; closest = i; }
        });
        setActive(closest);
      });
    }
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => { track.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const sectionRef = useVisibleRotation(() => scrollToIndex(active + 1), 5000, count > 1);

  if (!count) return null;

  return (
    <section ref={sectionRef} id="collections" aria-label="Featured collections" className="scroll-mt-28 bg-night py-8 sm:py-10">
      <div className="container-page mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow-dark text-[10px] sm:text-xs">Explore collections</p>
          <h2 className="mt-1 text-xl text-white sm:text-2xl md:text-3xl">Shop your style</h2>
        </div>
        {count > 1 && (
          <div className="hidden gap-2 sm:flex">
            <button type="button" onClick={() => scrollToIndex(active - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-xl text-white transition hover:bg-white/15" aria-label="Previous collection">&#8249;</button>
            <button type="button" onClick={() => scrollToIndex(active + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-xl text-white transition hover:bg-white/15" aria-label="Next collection">&#8250;</button>
          </div>
        )}
      </div>

      {/* overflow-hidden here clips the native scrollbar the inner track
          pushes below its own visible box (pb-[17px] -mb-[17px]) — more
          reliable across browsers than the vendor-prefixed hide-scrollbar
          properties, which some builds render as a thin bar anyway. */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-5 pb-4.25 -mb-4.25 [touch-action:pan-x] sm:gap-4 sm:px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]"
        >
          {collections.map((collection) => {
            const image = collection.imageUrl ?? FALLBACK_PRODUCT_IMAGE;
            return (
              <Link
                key={collection.id}
                href={collection.href}
                className="group relative h-60 w-[calc(100%+2rem)] shrink-0 snap-start rounded-2xl bg-night p-px sm:h-75 sm:w-[calc(50%-0.5rem)] lg:h-85 lg:w-[calc(33.333%-0.67rem)]"
              >
                {/* 1px bg-night margin around the clipped box: any rendering
                    seam at the rounded corners blends into it instead of
                    showing against a mismatched background — see SpotlightCard. */}
                <div className="relative h-full w-full overflow-hidden rounded-[15px] bg-sand">
                  <Image src={image} alt={collection.title} fill sizes="(min-width: 1024px) 500px, 90vw" className="object-cover" />
                  <div aria-hidden className="absolute inset-0 bg-linear-to-t from-night via-night/45 to-night/20" />
                  <span className="absolute left-3 top-3 w-fit rounded-full bg-night/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-white">Collection</span>
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <h3 className="text-lg font-bold leading-snug text-white sm:text-xl md:text-2xl">{collection.title}</h3>
                    <p className="mt-1 hidden max-w-[85%] text-sm text-white/75 lg:line-clamp-2 lg:block">{collection.description}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-coral-light group-hover:text-white">Shop <ArrowRightIcon className="h-3.5 w-3.5" /></span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {collections.map((collection, index) => (
            <button key={collection.id} type="button" onClick={() => scrollToIndex(index)} aria-label={`Show ${collection.title}`} aria-current={active === index ? "true" : undefined} className={`h-1.5 rounded-full transition-all ${active === index ? "w-6 bg-coral" : "w-1.5 bg-white/30 hover:bg-white/60"}`} />
          ))}
        </div>
      )}
    </section>
  );
}
