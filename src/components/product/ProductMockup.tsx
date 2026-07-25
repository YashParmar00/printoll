"use client";

import type { ReactNode } from "react";
import type { ProductShape } from "@/lib/products";

interface ProductMockupProps {
  shape: ProductShape;
  accent: [string, string];
  /** Engraving text (pendant). */
  text?: string;
  /** Object URL of the uploaded photo (mug / frame). */
  photoUrl?: string | null;
}

const CREAM = "#faf6ef";

/**
 * Live personalization preview. A CSS/SVG stand-in for the real supplier
 * mockup: it draws a per-shape silhouette and overlays the customer's name or
 * photo in the product's print area, updating as they type / upload.
 * (Real product photos replace this in M6 — see IMAGES phase.)
 */
export default function ProductMockup({ shape, accent, text, photoUrl }: ProductMockupProps) {
  return (
    <div
      className="relative aspect-square w-full select-none overflow-hidden rounded-[1.75rem] shadow-sm ring-1 ring-black/5"
      style={{
        background: `linear-gradient(140deg, ${accent[0]}, ${accent[1]})`,
        containerType: "inline-size",
      }}
    >
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden>
        {renderSilhouette(shape)}
      </svg>
      {renderOverlay(shape, text, photoUrl)}
      <span className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-[11px] font-medium uppercase tracking-[0.3em] text-white/55">
        AuraaMarts preview
      </span>
    </div>
  );
}

function renderSilhouette(shape: ProductShape): ReactNode {
  switch (shape) {
    case "pendant":
      return (
        <>
          <path d="M118 92 Q200 214 282 92" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth={5} />
          <rect x="118" y="188" width="164" height="72" rx="20" fill={CREAM} />
          <rect x="118" y="188" width="164" height="72" rx="20" fill="none" stroke="rgba(0,0,0,.05)" strokeWidth={2} />
        </>
      );
    case "mug":
      return (
        <>
          <path d="M262 158 q58 14 0 92" fill="none" stroke={CREAM} strokeWidth={18} strokeLinecap="round" />
          <rect x="112" y="120" width="150" height="176" rx="20" fill={CREAM} />
          <ellipse cx="187" cy="122" rx="72" ry="12" fill="rgba(0,0,0,.06)" />
        </>
      );
    case "frame":
      return (
        <>
          <rect x="92" y="90" width="216" height="244" rx="14" fill="#e7cb82" />
          <rect x="102" y="100" width="196" height="224" rx="10" fill="rgba(0,0,0,.07)" />
          <rect x="112" y="110" width="176" height="204" rx="8" fill={CREAM} />
        </>
      );
    case "mat":
      return (
        <>
          <rect x="78" y="150" width="244" height="120" rx="18" fill="#6f4172" />
          <rect x="78" y="150" width="244" height="120" rx="18" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={2} />
          {Array.from({ length: 4 }).flatMap((_, r) =>
            Array.from({ length: 9 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={102 + c * 24} cy={172 + r * 28} r={4} fill="#e7cb82" opacity={0.85} />
            )),
          )}
        </>
      );
  }
}

function renderOverlay(shape: ProductShape, text?: string, photoUrl?: string | null): ReactNode {
  if (shape === "pendant") {
    const value = text?.trim();
    return (
      <div
        className="absolute text-center"
        style={{ top: "55.5%", left: "50%", transform: "translate(-50%, -50%)", width: "42%" }}
      >
        <span
          className={`font-script leading-none ${value ? "text-plum" : "text-plum/40"}`}
          style={{
            fontSize: "clamp(18px, 12cqi, 50px)",
            display: "inline-block",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "Your name"}
        </span>
      </div>
    );
  }

  if (shape === "mug" || shape === "frame") {
    const area =
      shape === "mug"
        ? { left: "32%", top: "37.5%", width: "30%", height: "28%", borderRadius: "10px" }
        : { left: "32.5%", top: "32%", width: "35%", height: "42%", borderRadius: "4px" };
    return (
      <div className="absolute overflow-hidden" style={{ position: "absolute", ...area }}>
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- user object URL, not a static asset
          <img src={photoUrl} alt="Your uploaded photo preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-white/70 bg-white/25 px-2 text-center text-[11px] font-semibold text-white">
            Your photo here
          </div>
        )}
      </div>
    );
  }

  return null; // mat: no personalization
}
