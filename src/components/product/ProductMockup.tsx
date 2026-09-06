"use client";

import type { ReactNode } from "react";
import type { ProductShape } from "@/lib/products";
import { site } from "@/lib/site";

interface ProductMockupProps {
  shape: ProductShape;
  accent: [string, string];
  /** Print text (names / initials / date). */
  text?: string;
  /** Object URL of an uploaded photo, for photo-print products. */
  photoUrl?: string | null;
}

const SAND = "#fbf1e7";
const NOIR = "#141414";

/**
 * Live personalization preview. A CSS/SVG stand-in for the real supplier
 * mockup: it draws the pair of garments and overlays what the customer types
 * in the print area, updating as they type. (Real product photos replace this
 * once the Qikink mockups land — upload them from /admin/products.)
 */
export default function ProductMockup({ shape, accent, text, photoUrl }: ProductMockupProps) {
  const value = text?.trim();
  return (
    <div
      className="relative aspect-square w-full select-none overflow-hidden rounded-[1.75rem] shadow-sm ring-1 ring-black/5"
      style={{
        background: `linear-gradient(140deg, ${accent[0]}, ${accent[1]})`,
        containerType: "inline-size",
      }}
    >
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden>
        {renderPair(shape)}
      </svg>

      {/* Print overlay — same text on both garments, as it is printed. */}
      <PrintText value={value} left="26.5%" color={NOIR} />
      <PrintText value={value} left="73.5%" color={SAND} />

      {photoUrl && (
        <div className="absolute left-1/2 top-[74%] w-[36%] -translate-x-1/2 overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element -- user object URL, not a static asset */}
          <img src={photoUrl} alt="Your uploaded photo preview" className="h-full w-full object-cover" />
        </div>
      )}

      <span className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-[11px] font-medium uppercase tracking-[0.3em] text-white/55">
        {site.name} preview
      </span>
    </div>
  );
}

/** The typed text, sitting in each garment's print area. */
function PrintText({ value, left, color }: { value?: string; left: string; color: string }) {
  return (
    <div
      className="pointer-events-none absolute text-center"
      style={{ top: "48%", left, transform: "translate(-50%, -50%)", width: "28%" }}
    >
      <span
        className="font-display font-bold leading-tight"
        style={{
          color,
          opacity: value ? 1 : 0.45,
          fontSize: "clamp(9px, 4.2cqi, 20px)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          overflowWrap: "anywhere",
        }}
      >
        {value || "Your names"}
      </span>
    </div>
  );
}

/** Two garments side by side — the set, not a single item. */
function renderPair(shape: ProductShape): ReactNode {
  return (
    <>
      <ellipse cx="200" cy="352" rx="150" ry="16" fill="rgba(0,0,0,.14)" />
      <g transform="translate(20 70) scale(0.92)">{garment(shape, SAND, "rgba(0,0,0,.08)")}</g>
      <g transform="translate(200 70) scale(0.92)">{garment(shape, NOIR, "rgba(255,255,255,.10)")}</g>
    </>
  );
}

function garment(shape: ProductShape, fill: string, shade: string): ReactNode {
  switch (shape) {
    case "hoodie":
      return (
        <>
          <path
            d="M62 10 96 22 130 10l44 24-18 44-22-9v148H80V69l-22 9-18-44L62 10Z"
            fill={fill}
          />
          <path d="M84 12q28 30 56 0 6 26-28 30-34-4-28-30Z" fill={shade} />
          <rect x="86" y="150" width="52" height="10" rx="5" fill={shade} />
        </>
      );
    case "tote":
      return (
        <>
          <rect x="52" y="60" width="120" height="140" rx="10" fill={fill} />
          <path d="M82 60V40a30 30 0 0 1 60 0v20" fill="none" stroke={fill} strokeWidth={9} />
          <rect x="52" y="60" width="120" height="12" rx="6" fill={shade} />
        </>
      );
    case "tee":
    default:
      return (
        <>
          <path
            d="M66 8 96 20 126 8l46 24-19 44-21-9v150H85V67l-21 9-19-44L66 8Z"
            fill={fill}
          />
          <path d="M88 10q20 20 40 0 4 18-20 22-24-4-20-22Z" fill={shade} />
        </>
      );
  }
}
