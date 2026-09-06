"use client";

import { useEffect, useState } from "react";

/**
 * Hero centrepiece: two holographic tee outlines with a print head sweeping
 * over them, cycling through couple names so visitors see the personalization
 * happen instead of reading about it.
 *
 * Pure SVG + CSS keyframes — no motion library, and every animation is disabled
 * under prefers-reduced-motion (see globals.css).
 */
/**
 * Placeholder prompts only — never invented customer names. Each pair shows
 * the *kind* of thing that gets printed, so the demo stays honest.
 */
const PAIRS = [
  ["YOUR NAME", "THEIR NAME"],
  ["INITIALS", "INITIALS"],
  ["YOUR DATE", "YOUR DATE"],
  ["CUSTOM TEXT", "CUSTOM TEXT"],
];

const CORAL = "#d2603f";

export default function HeroTeeAnimation() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % PAIRS.length), 2800);
    return () => clearInterval(id);
  }, []);

  const [left, right] = PAIRS[i];

  return (
    <div
      className="relative mx-auto mt-10 w-full max-w-2xl select-none"
      role="img"
      aria-label="Two matching tees with names being printed on them"
    >
      {/* rotating glow behind the stage */}
      <div
        aria-hidden
        className="anim-spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${CORAL}33 70deg, transparent 150deg, ${CORAL}22 250deg, transparent 360deg)`,
          filter: "blur(42px)",
        }}
      />
      <div
        aria-hidden
        className="anim-pulse pointer-events-none absolute left-1/2 top-1/2 h-56 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, ${CORAL}55 0%, transparent 70%)` }}
      />

      {/* floating spec particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {[12, 28, 46, 63, 78, 90].map((leftPct, n) => (
          <span
            key={leftPct}
            className="anim-drift absolute bottom-6 h-1 w-1 rounded-full bg-coral"
            style={{ left: `${leftPct}%`, animationDelay: `${n * 0.8}s` }}
          />
        ))}
      </div>

      <div className="anim-float relative">
        <svg viewBox="0 0 420 260" className="w-full" fill="none" aria-hidden>
          <defs>
            {/* holographic grid inside the garments */}
            <pattern id="pw-grid" width="11" height="11" patternUnits="userSpaceOnUse">
              <path d="M11 0H0v11" stroke={CORAL} strokeOpacity="0.22" strokeWidth="0.6" />
            </pattern>
            {/* the sweeping print head */}
            <linearGradient id="pw-beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CORAL} stopOpacity="0" />
              <stop offset="45%" stopColor={CORAL} stopOpacity="0.55" />
              <stop offset="55%" stopColor="#ffd9c9" stopOpacity="0.9" />
              <stop offset="100%" stopColor={CORAL} stopOpacity="0" />
            </linearGradient>
            <filter id="pw-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="pw-clip-l">
              <path d={TEE} transform="translate(28 24)" />
            </clipPath>
            <clipPath id="pw-clip-r">
              <path d={TEE} transform="translate(228 24)" />
            </clipPath>
          </defs>

          <Garment x={28} clip="pw-clip-l" name={left} delay="0s" />
          <Garment x={228} clip="pw-clip-r" name={right} delay="0.25s" />

          {/* baseline + HUD readout */}
          <line
            x1="24"
            y1="244"
            x2="396"
            y2="244"
            stroke={CORAL}
            strokeOpacity="0.25"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
        </svg>

        {/* HUD label under the pair */}
        <p className="anim-flicker mt-3 text-center font-mono text-[11px] uppercase tracking-[0.35em] text-coral/80">
          Print ready · 2 tees
        </p>
      </div>
    </div>
  );
}

/** Shared tee outline path, drawn at the origin. */
const TEE =
  "M52 0 74 9 96 0l38 20-15 38-19-8v140H33V50l-19 8L-1 20 52 0Z";

function Garment({
  x,
  clip,
  name,
  delay,
}: {
  x: number;
  clip: string;
  name: string;
  delay: string;
}) {
  return (
    <g transform={`translate(${x} 24)`}>
      {/* body fill + holo grid, clipped to the garment */}
      <g clipPath={`url(#${clip})`} transform={`translate(${-x} -24)`}>
        <g transform={`translate(${x} 24)`}>
          <path d={TEE} fill={CORAL} fillOpacity="0.07" />
          <rect x="-10" y="-10" width="180" height="220" fill="url(#pw-grid)" />
          {/* sweeping print head */}
          <rect
            className="anim-scan"
            x="-10"
            y="-10"
            width="180"
            height="34"
            fill="url(#pw-beam)"
            style={{ animationDelay: delay }}
          />
        </g>
      </g>

      {/* glowing outline that draws itself in */}
      <path
        className="anim-draw"
        d={TEE}
        stroke={CORAL}
        strokeWidth="1.6"
        strokeLinejoin="round"
        filter="url(#pw-glow)"
        style={{ animationDelay: delay }}
      />

      {/* HUD corner brackets around the print area */}
      <g stroke={CORAL} strokeOpacity="0.55" strokeWidth="1.2">
        <path d="M40 74h-8v-8M100 74h8v-8M40 118h-8v8M100 118h8v8" />
      </g>

      {/* the personalization itself, re-mounted on each name so it re-animates */}
      <text
        key={name}
        className="anim-rise"
        x="70"
        y="102"
        textAnchor="middle"
        fill="#fff"
        fontSize="13"
        fontWeight="700"
        letterSpacing="1.5"
        style={{ fontFamily: "var(--font-display), sans-serif" }}
      >
        {name}
      </text>
    </g>
  );
}
