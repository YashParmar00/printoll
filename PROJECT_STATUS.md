# PROJECT_STATUS.md — AuraaMarts single source of truth

**What this file is:** the live "what exists right now vs. what doesn't" for this codebase.
Separate from `RESEARCH.md` (competitor + integration research) and `CLAUDE.md` (coding conventions).

**Update rule:** after *every* task/milestone, update this file immediately (before moving on) —
every new page, component, placeholder, env var, dependency, and blocker. Keep it as scannable
status tables, not paragraphs.

**Last updated:** after M2 baseline commit (before M3 work).

---

## 1. Milestone status (M1–M7)

| Milestone | Status | Missing |
|---|---|---|
| **M1** Research → RESEARCH.md + CLAUDE.md | ✅ Done | Exact Qikink create-order schema deferred to M5 (behind an adapter). |
| **M2** Scaffold + design system + homepage | ✅ Done | Imagery is placeholder; otherwise complete. Now committed locally. |
| **M3** Products + live personalization preview | ❌ Not started | Product pages, personalization studio, cart store. |
| **M4** Cart/checkout + Razorpay + COD | ❌ Not started | Cart page, checkout, payments, server price validation. |
| **M5** Supplier integration + admin | ❌ Not started | Supplier client (generic), order push/tracking, `/admin`. |
| **M6** Remaining pages + SEO | ❌ Not started | About/Contact/FAQ/Category/Track + 4 policies; sitemap/robots/JSON-LD. |
| **M7** QA + deploy | ❌ Not started | Tests, Lighthouse, deploy, handover doc. |

---

## 2. Page-by-page

| Page | Route/file | Content | Nav-linked | Mobile |
|---|---|---|---|---|
| Home | ✅ `src/app/page.tsx` | Real copy, placeholder imagery | ✅ | ✅ mobile-first |
| Product ×4 | ❌ | — | Links exist → 404 | — |
| Category | ❌ | — | Not linked | — |
| About | ❌ | — | Linked → 404 | — |
| Contact | ❌ | — | Not linked | — |
| FAQ | ❌ | — | Not linked | — |
| Shipping Policy | ❌ | — | Footer → 404 | — |
| Return & Refund | ❌ | — | Footer → 404 | — |
| Privacy Policy | ❌ | — | Footer → 404 | — |
| Terms | ❌ | — | Footer → 404 | — |
| Track Order | ❌ | — | Linked → 404 | — |
| Cart | ❌ | — | Not linked | — |
| Checkout | ❌ | — | Not linked | — |
| Admin | ❌ | — | Not linked | — |

Dead links degrade to the branded 404 (`src/app/not-found.tsx`).

---

## 3. Integrations

| System | Built | Tested | Credentials | Notes |
|---|---|---|---|---|
| Razorpay | ❌ | ❌ | none | Flow documented in RESEARCH §C. M4 will use **dummy/placeholder test keys** in `.env.local`. |
| Supplier (Qikink TBD) | ❌ | ❌ | none | **Supplier not chosen** — code stays generic (`supplierSku`), no Qikink hardcoding until decided. |
| Database (Postgres/Prisma) | ❌ | ❌ | none | No Prisma/schema/models. Catalogue is a static array in `src/lib/products.ts`. DB host (Neon/Supabase) not chosen. |
| Email (Resend) | ❌ | ❌ | none | Order email deferred to M4. |
| Analytics (GA4 / Meta Pixel) | ❌ | ❌ | none | Deferred (Phase 9 / M6–M7). |

---

## 4. Trust checklist (RESEARCH.md §B)

| # | Item | Status |
|---|---|---|
| 1 | Honest hero trust strip | ✅ Live (`TrustBadges`) |
| 2 | WhatsApp primary support | ✅ Live (FAB + header + footer + mobile nav) |
| 3 | Mobile bottom nav | ✅ Live (`MobileBottomNav`) |
| 4 | Strike-through anchor pricing | ✅ Live on home grid (`ProductCard`); not yet on PDP/category |
| 5 | Delivery-date promise before ATC | 🟡 Helper `deliveryBy()` exists, rendered nowhere (needs PDP, M3) |
| 6 | Occasion-first + Rakhi countdown | ✅ Live (`Occasions` + `RakhiCountdown`); relationship nav not built |
| 7 | Personalizable tag + live preview | 🟡 Tag ✅; live preview ❌ (M3) |
| 8 | Footer trust block | ✅ Live |
| 9 | Positive specific return policy | 🟡 Messaging ✅; policy page ❌ |
| 10 | Free-shipping + prepaid nudge | 🟡 Messaging ✅; cart toggle ❌ (M4) |

Live 5/10 · Partial 5/10.

---

## 5. Placeholder / fake content (must be real before launch)

| Placeholder | Location | Needs |
|---|---|---|
| Product images | `ProductCard.tsx`, `Hero.tsx` (`GiftIllustration`), `products.ts` `accent` | Real supplier mockups → phone photos |
| Testimonials | `src/components/home/Testimonials.tsx` (labelled placeholder) | Real reviews + photos |
| Catalogue + prices | `src/lib/products.ts` | Confirmed SKUs, real prices, supplier SKU codes |
| Ratings | `products.ts` `rating` (reviews:0 → shows "New arrival") | Real ratings when reviews exist |
| Public email | `site.ts` `email: hello@auraamarts.com` | Real, but **forwarding not set up → would bounce** |
| Instagram link | `site.ts` `social.instagram` | Confirm handle |
| Delivery window | `site.ts` `deliveryDays: 6` | Confirm real SLA |

Real now: phone, address, Rakhi date (9 Aug 2026), brand persona.

---

## 6. Blockers (need founder decision/credential)

| Blocker | Gates | Owner |
|---|---|---|
| Razorpay test keys (real) | M4 live testing (dummy keys unblock build) | Yash |
| Supplier choice + API creds | M5 | Yash |
| DB host (Neon/Supabase) + connection string | catalogue/orders in DB | Yash |
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
| Supplier | **Deferred** — generic `supplierSku: string`, no Qikink-specific hardcoding yet |
| GitHub push | **Deferred** — local commits only, no remote connected |
| Razorpay (M4) | Build now with **dummy/placeholder test keys** in `.env.local` (clearly labelled, swap for real test keys later; logic identical) |
| Database | Choice pending (Neon vs Supabase); catalogue static for now |
| Customer-facing identity | Brand persona **"Team AuraaMarts"** — founder's personal name never on storefront |
| Public email | `hello@auraamarts.com` (needs forwarding); private `ownerEmail` = Gmail for notifications |
| Guest checkout | No forced accounts (India conversion); admin-only auth later |

---

## 8. Dependencies & env vars

| Type | Present |
|---|---|
| Dependencies | `next@16.2.10`, `react@19.2.4`, `react-dom@19.2.4` (dev: tailwind v4, typescript, eslint) — nothing else installed yet |
| Env vars | none yet (no `.env.local`); added from M4 |

---

## 9. Commits (local only, no remote)

| Commit | Contents |
|---|---|
| `M2: scaffold, design system, homepage + real contact details` | M2 baseline + brand persona + real contacts + Rakhi date fix + this status file |
