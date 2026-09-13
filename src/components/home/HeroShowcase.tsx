"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import TeePoster from "@/components/home/TeePoster";
import type { TeeVariant } from "@/components/home/TeeCanvas";

// three.js stays out of the initial bundle — fetched once the hero nears the viewport.
const TeeCanvas = dynamic(() => import("@/components/home/TeeCanvas"), { ssr: false });

const SLIDES: (TeeVariant & { title: string })[] = [
  {
    id: "ivory",
    title: "Ivory floral",
    color: "#efe7da",
    print: "/uploads/hero/versioned/heart-print.297dfffc5c066804.webp",
    printWidth: 0.25,
    printY: 0.04,
  },
  {
    id: "noir",
    title: "Constellation",
    color: "#1f1d1f",
    print: "/uploads/hero/versioned/constellation-print.fcaa8bd292dd002b.webp",
    printWidth: 0.23,
    printY: 0.01,
  },
  {
    id: "terracotta",
    title: "Terracotta",
    color: "#b65f3f",
    print: "/uploads/hero/versioned/eclipse-print.d87a589df0082d8a.webp",
    printWidth: 0.11,
    printY: 0.09,
  },
];

/**
 * Hero centrepiece: one interactive 3D tee that switches between prints.
 * Dragging / swiping spins the tee, so variants change via arrows and dots.
 */
export default function HeroShowcase() {
  const [index, setIndex] = useState(0);
  const [load3d, setLoad3d] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!load3d || ready || failed) return;
    const timeout = window.setTimeout(() => { setFailed(true); setLoad3d(false); }, 30_000);
    return () => window.clearTimeout(timeout);
  }, [load3d, ready, failed]);
  const handleError = useCallback(() => { setFailed(true); setReady(false); setLoad3d(false); }, []);
  function start3d() { setFailed(false); setReady(false); setAttempt(value => value + 1); setLoad3d(true); performance.mark("hero-3d-requested"); }

  const handleReady = useCallback(() => { setReady(true); performance.mark("hero-3d-ready"); }, []);
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
        {/* quiet placeholder while the 3D model loads */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
        >
          <TeePoster variant={slide} />
        </div>

        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          {load3d && <TeeCanvas key={attempt} variants={SLIDES} index={index} onReady={handleReady} onError={handleError} />}
        </div>

        <ArrowButton side="left" onClick={() => go(index - 1)} />
        <ArrowButton side="right" onClick={() => go(index + 1)} />
      </div>

      {!ready && <div className="relative z-10 text-center"><button type="button" onClick={start3d} disabled={load3d} className="rounded-full border border-white/25 px-5 py-2 text-sm text-white disabled:opacity-60">{load3d ? "Opening interactive preview..." : failed ? "Retry 3D preview" : "Explore in 3D"}</button>{failed && <p role="status" className="mt-2 text-sm text-night-ink">3D is unavailable. The design preview is still available.</p>}</div>}

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
