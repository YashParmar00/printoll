# PROJECT_STATUS.md — AuraaMarts single source of truth

**What this file is:** the live "what exists right now vs. what doesn't" for this codebase.
Separate from `RESEARCH.md` (competitor + integration research) and `CLAUDE.md` (coding conventions).

**Update rule:** after *every* task/milestone, update this file immediately (before moving on) —
every new page, component, placeholder, env var, dependency, and blocker. Keep it as scannable
status tables, not paragraphs.

**Last updated:** after M3 build (product pages + live personalization preview). M3 not yet committed.

---

## 1. Milestone status (M1–M7)

| Milestone | Status | Missing |
|---|---|---|
| **M1** Research → RESEARCH.md + CLAUDE.md | ✅ Done | Exact supplier create-order schema deferred to M5. |
| **M2** Scaffold + design system + homepage | ✅ Done · committed | Imagery placeholder. Commit `553ee31`. |
| **M3** Products + live personalization preview | ✅ Done · **uncommitted** | Real images; photo-upload *persistence* (preview-only for now). |
| **M4** Cart/checkout + Razorpay + COD | ❌ Not started | Cart page, checkout, payments (dummy keys), server price validation. |
| **M5** Supplier integration + admin | ❌ Not started | Supplier client (generic), order push/tracking, `/admin`. |
| **M6** Remaining pages + SEO | ❌ Not started | About/Contact/FAQ/Category/Track + 4 policies; sitemap/robots/JSON-LD. |
| **M7** QA + deploy | ❌ Not started | Tests, Lighthouse, deploy, handover doc. |

---

## 2. Page-by-page

| Page | Route/file | Content | Nav-linked | Mobile |
|---|---|---|---|---|
| Home | ✅ `src/app/page.tsx` | Real copy, placeholder imagery | ✅ | ✅ |
| Product ×4 | ✅ `src/app/product/[slug]/page.tsx` (SSG) | Real copy + live preview; placeholder imagery | ✅ from home grid + related | ✅ + sticky ATC bar |
| Category | ❌ | — | Not linked | — |
| About | ❌ | — | Linked → 404 | — |
| Contact | ❌ | — | Not linked | — |
| FAQ | ❌ | — | Not linked | — |
| Shipping / Return / Privacy / Terms | ❌ | — | Footer → 404 | — |
| Track Order | ❌ | — | Linked → 404 | — |
| Cart | ❌ | — | **Now linked** (header badge, "View cart") → 404 | — |
| Checkout | ❌ | — | Not linked | — |
| Admin | ❌ | — | Not linked | — |

Built: Home + 4 Product pages. Dead links degrade to branded 404.

---

## 3. Integrations

| System | Built | Tested | Credentials | Notes |
|---|---|---|---|---|
| Razorpay | ❌ | ❌ | none | M4 with **dummy/placeholder test keys** in `.env.local`. |
| Supplier (TBD) | ❌ | ❌ | none | Generic `supplierSku` only; no Qikink hardcoding. |
| Database (Postgres/Prisma) | ❌ | ❌ | none | Catalogue still static array; cart is localStorage. |
| Email (Resend) | ❌ | ❌ | none | M4. |
| Analytics (GA4 / Meta Pixel) | ❌ | ❌ | none | M6–M7. |

---

## 4. Trust checklist (RESEARCH.md §B)

| # | Item | Status |
|---|---|---|
| 1 | Honest hero trust strip | ✅ Live |
| 2 | WhatsApp primary support | ✅ Live (FAB + header + footer + mobile nav + PDP) |
| 3 | Mobile bottom nav | ✅ Live |
| 4 | Strike-through anchor pricing | ✅ Live on home **and PDP** |
| 5 | Delivery-date promise before ATC | ✅ **Live on PDP** ("Order today, delivery by <date>") |
| 6 | Occasion-first + Rakhi countdown | ✅ Live |
| 7 | Personalizable tag + **live preview** | ✅ **Live** (text engraving + photo overlay) |
| 8 | Footer trust block | ✅ Live |
| 9 | Positive specific return policy | 🟡 Messaging ✅ (badge on PDP); policy page ❌ |
| 10 | Free-shipping + prepaid nudge | 🟡 Messaging ✅; cart toggle ❌ (M4) |

Live 8/10 · Partial 2/10.

---

## 5. Placeholder / fake content (must be real before launch)

| Placeholder | Location | Needs |
|---|---|---|
| Product mockups (live preview) | `src/components/product/ProductMockup.tsx` (CSS/SVG per `shape`) | Real supplier mockups → phone photos |
| Product gallery thumbnails | `PersonalizationStudio.tsx` (Main/Detail/Packaging/Lifestyle tiles) | Real secondary shots |
| Home imagery | `ProductCard.tsx`, `Hero.tsx` | Real images |
| Testimonials | `home/Testimonials.tsx` (labelled) | Real reviews + photos |
| Catalogue + prices + supplier SKUs | `src/lib/products.ts` | Confirmed real data |
| Ratings | `products.ts` `rating` (reviews:0 → "New arrival") | Real ratings |
| Public email | `site.ts` `email` = hello@auraamarts.com | Forwarding setup (else bounces) |
| Instagram link · delivery SLA | `site.ts` | Confirm |
| **Uploaded photo** | preview-only (in-memory object URL); cart stores **filename only** | Real upload/persistence (M4/M5) |

Real now: phone, address, Rakhi date (9 Aug 2026), brand persona, product copy.

---

## 6. Blockers (need founder decision/credential)

| Blocker | Gates | Owner |
|---|---|---|
| Razorpay test keys (real) | M4 live testing (dummy keys unblock build) | Yash |
| Supplier choice + API creds | M5 | Yash |
| DB host (Neon/Supabase) + connection string | catalogue/orders/photo upload in DB | Yash |
| Resend API key | M4 email | Yash |
| Final SKUs/prices/supplier SKU codes | real product data | Yash |
| Supplier mockup images | real imagery | Yash |
| Policy facts (returns, GST, jurisdiction) | M6 policies | Yash |
| Domain + `hello@` forwarding | pre-launch (email bounce) | Yash |
| Deploy target confirm (Vercel) | M7 | Yash |

---

## 7. Decisions made so far

| Decision | Choice |
|---|---|
| Framework | Next.js 16 + React 19 + TypeScript + Tailwind v4 |
| Supplier | **Deferred** — generic `supplierSku: string`, no Qikink-specific hardcoding |
| GitHub push | **Deferred** — local commits only, no remote |
| Razorpay (M4) | Build now with **dummy/placeholder test keys** (swap for real later; logic identical) |
| Database | Choice pending; catalogue static, cart in localStorage |
| Customer-facing identity | Brand persona **"Team AuraaMarts"** — personal name never on storefront |
| Public email | `hello@auraamarts.com` (needs forwarding); private `ownerEmail` = Gmail |
| Guest checkout | No forced accounts; admin-only auth later |
| Cart | M3 = client store (localStorage); cart page + checkout = M4 |

---

## 8. Dependencies & env vars

| Type | Present |
|---|---|
| Dependencies | `next@16.2.10`, `react@19.2.4`, `react-dom@19.2.4` (dev: tailwind v4, typescript, eslint). **No new npm deps in M3** (Dancing Script loads via `next/font`). |
| Fonts | Playfair Display, Poppins, **Dancing Script** (engraving preview) — all via `next/font/google` |
| Env vars | none yet (no `.env.local`); added from M4 |

---

## 9. Components & modules inventory

| Area | Files |
|---|---|
| `src/app` | `layout.tsx` (fonts + CartProvider), `page.tsx` (home), `not-found.tsx`, `product/[slug]/page.tsx` |
| `src/lib` | `site.ts`, `format.ts`, `products.ts` (extended), `cart.tsx` (CartProvider/useCart) |
| `components/site` | `Header.tsx`, `Footer.tsx`, `MobileBottomNav.tsx`, `WhatsAppFab.tsx`, `TrustBadges.tsx`, `CartBadge.tsx` |
| `components/home` | `Hero.tsx`, `FeaturedProducts.tsx`, `HowItWorks.tsx`, `Occasions.tsx`, `RakhiCountdown.tsx`, `Testimonials.tsx`, `AboutTeaser.tsx` |
| `components/ui` | `icons.tsx` (+Upload/Plus/Minus), `ProductCard.tsx` |
| `components/product` | `ProductMockup.tsx` (client), `PersonalizationStudio.tsx` (client), `Breadcrumbs.tsx`, `ProductFAQ.tsx`, `ProductReviews.tsx`, `RelatedProducts.tsx` |

Client components (`"use client"`): `RakhiCountdown`, `cart` provider, `CartBadge`, `ProductMockup`, `PersonalizationStudio`. Everything else is a Server Component.

---

## 10. Commits (local only, no remote)

| Commit | Contents |
|---|---|
| `553ee31` M2: scaffold, design system, homepage + real contact details | M2 baseline + brand persona + real contacts + Rakhi fix + PROJECT_STATUS.md |
| *(pending)* M3 | Product pages + live personalization preview + cart store — **built, awaiting review before commit** |

---

## 11. Changelog

- **M3** — Extended product model (`supplierSku`, `shape`, `description[]`, `highlights`, `faqs`).
  Added `/product/[slug]` (SSG, 4 pages) with: breadcrumb, live personalization studio (text
  engraving + photo-upload overlay, live preview), anchor pricing, delivery-date widget, quantity,
  add-to-cart, sticky mobile ATC bar, description, highlights, native-details FAQs, honest reviews
  empty-state, "people also bought". Added client cart store (localStorage) + header cart badge.
  New fonts token (Dancing Script). No new npm deps, no env vars.
- **M2** — Scaffold + design system + homepage + site chrome + branded 404. Committed `553ee31`.
- **M1** — RESEARCH.md + CLAUDE.md.
