"use client";

import { useEffect, useRef, useState } from "react";
import { StarIcon } from "@/components/ui/icons";

/* These remain intentionally marked as placeholders until genuine customer reviews arrive. */
const testimonials = [
  {
    names: "Customer name",
    city: "City, State",
    quote: "Replace this with a real review in the customer’s own words. Keep their product photo and never invent a rating.",
    initials: "01",
    accent: "from-[#d2603f] via-[#8e3e28] to-[#241a17]",
  },
  {
    names: "Customer name",
    city: "City, State",
    quote: "Photo reviews are the single biggest trust builder for COD shoppers. Seed this section only with genuine ones.",
    initials: "02",
    accent: "from-[#70625b] via-[#3d3a38] to-[#1d1715]",
  },
  {
    names: "Customer name",
    city: "City, State",
    quote: "Until real reviews arrive, consider hiding this section rather than filling it with invented praise.",
    initials: "03",
    accent: "from-[#f0b49b] via-[#b0472a] to-[#241a17]",
  },
  {
    names: "Customer name",
    city: "City, State",
    quote: "Add a genuine customer photo and their own words here once a verified review is available.",
    initials: "04",
    accent: "from-[#4f6179] via-[#29384a] to-[#1d1715]",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);
  const count = testimonials.length;

  const goTo = (index: number) => setActive((index + count) % count);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % count), 6000);
    return () => window.clearInterval(timer);
  }, [count]);

  function startSwipe(clientX: number) { touchStart.current = clientX; }
  function finishSwipe(clientX: number) {
    if (touchStart.current === null) return;
    const distance = clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(distance) < 40) return;
    goTo(active + (distance < 0 ? 1 : -1));
  }

  const visibleTestimonials = Array.from(
    { length: Math.min(4, count) },
    (_, slot) => testimonials[(active + slot) % count],
  );

  return (
    <section className="relative py-14 sm:py-16 md:py-20" aria-labelledby="testimonial-heading">
      <div className="container-page relative">
        <div className="grid items-end gap-5 sm:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <p className="eyebrow-dark text-[10px] sm:text-xs">Loved in the wild</p>
            <h2 id="testimonial-heading" className="mt-2 text-2xl text-white text-wrap sm:text-3xl md:text-4xl">
              Small matching moments. Big feelings.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-night-ink sm:text-base">
              A rotating spotlight for genuine customer stories, photos and feedback as they arrive.
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="mr-1 hidden text-xs font-medium text-night-ink sm:inline">Swipe through stories</span>
            <button type="button" onClick={() => goTo(active - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.05] text-white transition hover:border-coral/50 hover:bg-coral/15" aria-label="Previous testimonial">‹</button>
            <button type="button" onClick={() => goTo(active + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.05] text-white transition hover:border-coral/50 hover:bg-coral/15" aria-label="Next testimonial">›</button>
          </div>
        </div>

        <div className="mt-7 grid touch-pan-y grid-cols-2 gap-3 sm:mt-9 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6" onTouchStart={(event) => startSwipe(event.touches[0]?.clientX ?? 0)} onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}>
          {visibleTestimonials.map((testimonial, slot) => (
            <figure
              key={`${active}-${testimonial.initials}`}
              className={`relative min-h-[285px] overflow-hidden rounded-2xl border border-night-line bg-night-card/65 p-3 transition duration-500 sm:min-h-[330px] sm:p-5 md:min-h-[360px] lg:min-h-[385px] lg:rounded-3xl lg:p-6 ${slot === 2 ? "hidden md:block" : ""} ${slot === 3 ? "hidden lg:block" : ""}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="rounded-full border border-coral/25 bg-coral/10 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-coral-light sm:px-2.5 sm:text-[10px]"><span className="sm:hidden">Review</span><span className="hidden sm:inline">Review placeholder</span></span>
                <span className="h-px flex-1 bg-white/10" aria-hidden />
                <span className="text-sm text-coral" aria-hidden>✦</span>
              </div>

              <blockquote className="mt-4 min-h-28 text-xs leading-relaxed text-white sm:text-sm lg:min-h-32 lg:text-base">
                {testimonial.quote}
              </blockquote>

              <span className="mt-4 flex justify-center gap-1 text-[#f7bd4a]" aria-label="Customer rating">
                {Array.from({ length: 5 }).map((_, star) => (
                  <StarIcon key={star} className="h-4 w-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                ))}
              </span>

              <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3 sm:mt-4 sm:gap-3 sm:pt-4">
                <figcaption className="flex min-w-0 items-center gap-2.5">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white ${testimonial.accent}`}>
                    {testimonial.initials}
                  </span>
                  <span className="min-w-0 text-xs leading-tight sm:text-sm">
                    <span className="block truncate font-semibold text-white">{testimonial.names}</span>
                    <span className="block truncate text-night-ink">{testimonial.city}</span>
                  </span>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
