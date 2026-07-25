# AuraaMarts — Project Conventions (CLAUDE.md)

Custom ecommerce store for **auraamarts.com** — personalized gifts (engraved necklace, photo mug,
photo frame) + one wellness SKU (acupressure mat), fulfilled by Qikink. India, mobile-first (~85%
mobile), Cash-on-Delivery heavy. Solo founder, free-tier budget.

**Read `RESEARCH.md` first** — its §B decisions are build requirements, not suggestions.

> ⚠️ This is **Next.js 16** (see `AGENTS.md`). APIs differ from older Next. When unsure, check
> `node_modules/next/dist/docs/` before writing framework code.

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript** — Server Components by default; add
  `"use client"` only for interactivity (e.g. `RakhiCountdown`).
- **Tailwind CSS v4** — design tokens live in `src/app/globals.css` under `@theme` (no
  `tailwind.config.js`). Add colors/fonts there; use generated utilities (`bg-plum`, `text-gold`).
- Planned (later milestones): Prisma + Postgres (Neon/Supabase), Razorpay, Qikink REST API,
  Resend email, GA4 + Meta Pixel. **Not installed yet.**

## Design system (non-negotiable — RESEARCH.md §B, PHASE 6)

- Colours: plum `#5B2A5E` (primary), gold `#D4A947` (accent — CTAs/highlights ONLY), charcoal
  `#2B2B2B` (text), cream `#FAF6EF` (section bg), white base.
- Type: Playfair Display (headings) + Poppins (body, ≥16px on mobile) via `next/font`.
- One CTA system: `.btn-primary` (gold), `.btn-secondary` (plum outline), `.btn-whatsapp` (green).
- Mobile-first always; generous whitespace; premium-warm, not discount-bazaar.

## Conventions

- **Path alias:** `@/*` → `src/*`.
- **Structure:** `src/app` (routes), `src/components/{site,home,ui}`, `src/lib` (config/data/helpers).
- **Config over hardcoding:** brand/contact/WhatsApp/dates live in `src/lib/site.ts`. Prices &
  formatting in `src/lib/format.ts`. Catalogue in `src/lib/products.ts` (moves to DB in M3).
- **Money:** whole rupees (integers) in seed data; format only via `inr()`. When checkout lands,
  **validate every price server-side** — never trust the client cart.
- **Trust rules (hard):** COD badge on products; delivery-date promise before add-to-cart; WhatsApp
  everywhere; **never fabricate reviews/ratings** — `Testimonials` is a clearly-marked placeholder to
  swap with real customer content.
- **Images:** local self-contained placeholders (CSS gradients / inline SVG) for now. Real images
  come from Qikink mockups + Pexels/Unsplash, served via `next/image` as WebP/AVIF (`next.config.ts`
  already allow-lists those hosts). Never copy competitor/marketplace images.
- **Secrets:** everything in `.env.local`, never committed. No secrets in client components.

## Commands

- `npm run dev` — dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build (use this to verify compilation)
- `npm run lint` — ESLint

## Milestones (checkpoint after each)

M1 Research ✅ · **M2 Scaffold + design system + homepage ✅ (current)** · M3 Products +
personalization live preview · M4 Cart/checkout + Razorpay + COD · M5 Qikink integration + admin ·
M6 Remaining pages (about, contact, FAQ, policies, track, category) + SEO · M7 QA + deploy.

Commit after each milestone so we can roll back.
