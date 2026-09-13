"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TeeVariant } from "@/components/home/TeeCanvas";

// three.js stays out of the initial bundle — fetched only once the hero is in
// view and the browser is idle. The poster photo covers the gap.
const TeeCanvas = dynamic(() => import("@/components/home/TeeCanvas"), { ssr: false });

const SLIDES: (TeeVariant & { title: string; poster: string })[] = [
  {
    id: "ivory",
    title: "Ivory floral",
    color: "#efe7da",
    print: "/uploads/hero/heart-print.webp",
    printWidth: 0.25,
    printY: 0.04,
    poster: "/uploads/hero/ivory-poster.webp",
  },
  {
    id: "noir",
    title: "Constellation",
    color: "#1f1d1f",
    print: "/uploads/hero/constellation-print.webp",
    printWidth: 0.23,
    printY: 0.01,
    poster: "/uploads/hero/noir-poster.webp",
  },
  {
    id: "terracotta",
    title: "Terracotta",
    color: "#b65f3f",
    print: "/uploads/hero/eclipse-print.webp",
    printWidth: 0.11,
    printY: 0.09,
    poster: "/uploads/hero/terracotta-poster.webp",
  },
];

// Fades the stage edges into the hero background so the tee floats freely.
const EDGE_FADE =
  "radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%)";

/**
 * Hero centrepiece: one interactive 3D tee that switches between prints.
 * Dragging / swiping spins the tee, so variants change via arrows and dots.
 */
export default function HeroShowcase() {
  const [index, setIndex] = useState(0);
  const [load3d, setLoad3d] = useState(false);
  const [ready, setReady] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // start fetching three.js once the stage is near the viewport and idle
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let idleId: number | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = () => setLoad3d(true);
        if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(start, { timeout: 1500 });
        else start();
      },
      { rootMargin: "200px" },
    );
    io.observe(stage);
    return () => {
      io.disconnect();
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
    };
  }, []);

  const handleReady = useCallback(() => setReady(true), []);
  const go = (next: number) => setIndex((next + SLIDES.length) % SLIDES.length);
  const slide = SLIDES[index];

  return (
    <div
      className="relative mx-auto mt-6 w-full max-w-2xl sm:mt-8"
      role="region"
      aria-roledescription="carousel"
      aria-label="3D tee preview"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      {/* coral bloom behind the tee */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[45%] h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral/20 blur-3xl"
      />

      <div
        ref={stageRef}
        className="relative aspect-square sm:aspect-5/4"
        role="img"
        aria-label={`3D ${slide.title} tee. Drag or swipe to rotate.`}
      >
        {/* instant poster while the 3D model loads */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
          style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
        >
          <Image
            src={slide.poster}
            alt=""
            fill
            priority
            sizes="(min-width: 640px) 42rem, 100vw"
            className="object-contain"
          />
        </div>

        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          {load3d && <TeeCanvas variants={SLIDES} index={index} onReady={handleReady} />}
        </div>

        <ArrowButton side="left" onClick={() => go(index - 1)} />
        <ArrowButton side="right" onClick={() => go(index + 1)} />
      </div>

      <div className="mt-1 flex items-center justify-center gap-3">
        <div className="flex gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${s.title}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-coral" : "w-2 bg-white/25 hover:bg-white/40"}`}
            />
          ))}
        </div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-night-ink" aria-live="polite">
          {slide.title} · <span className="sm:hidden">swipe</span>
          <span className="hidden sm:inline">drag</span> to rotate
        </p>
      </div>
    </div>
  );
}

function ArrowButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous tee" : "Next tee"}
      className={`absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white ${side === "left" ? "left-0 sm:left-2" : "right-0 sm:right-2"}`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
