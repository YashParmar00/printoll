# PROJECT_STATUS.md — AuraaMarts single source of truth

**What this file is:** the live "what exists right now vs. what doesn't" for this codebase.
Separate from `RESEARCH.md` (competitor + integration research) and `CLAUDE.md` (coding conventions).

**Update rule:** after *every* task/milestone, update this file immediately (before moving on) —
every new page, component, placeholder, env var, dependency, and blocker. Keep it as scannable
status tables, not paragraphs.

**Last updated:** after M4 commit (`fbd487f`) + COD smoke-test; M5 admin panel in progress.

---

## 1. Milestone status (M1–M7)

| Milestone | Status | Missing |
|---|---|---|
| **M1** Research → RESEARCH.md + CLAUDE.md | ✅ Done | Exact supplier create-order schema deferred to M5. |
| **M2** Scaffold + design system + homepage | ✅ Done · committed `553ee31` | Imagery placeholder. |
| **M3** Products + live personalization preview | ✅ Done · committed `a8fa7da` | Photo-upload persistence (preview-only). |
| **M4** Cart/checkout + Razorpay + COD | ✅ Done · committed `fbd487f` | Prepaid needs real Razorpay test keys; orders in local file (not DB). **COD smoke-tested ✓** (order landed, server total correct). |
| **M5** Supplier integration + admin | 🟡 In progress | Admin panel being built now. **Supplier auto-push deferred** (no supplier chosen) — stubbed behind `lib/supplier.ts`. |
| **M6** Remaining pages + SEO | ❌ Not started | About/Contact/FAQ/Category/Track + 4 policies; sitemap/robots/JSON-LD. |
| **M7** QA + deploy | ❌ Not started | Tests, Lighthouse, deploy, handover doc. |

---

## 2. Page-by-page

| Page | Route/file | Content | Nav-linked | Mobile |
|---|---|---|---|---|
| Home | ✅ `app/page.tsx` | Real copy, placeholder imagery | ✅ | ✅ |
| Product ×4 | ✅ `app/product/[slug]/page.tsx` (SSG) | Real copy + live preview | ✅ | ✅ + sticky ATC |
| Cart | ✅ `app/cart/page.tsx` | Real (localStorage cart) | ✅ header badge | ✅ |
| Checkout | ✅ `app/checkout/page.tsx` | Real form + payment toggle | ✅ from cart | ✅ |
| Thank-you | ✅ `app/thank-you/page.tsx` | Real order summary | ✅ post-order | ✅ |
| Category | ❌ | — | Not linked | — |
| About | ❌ | — | Linked → 404 | — |
| Contact | ❌ | — | Not linked | — |
| FAQ | ❌ | — | Not linked | — |
| Shipping / Return / Privacy / Terms | ❌ | — | Footer → 404 | — |
| Track Order | ❌ | — | Linked → 404 | — |
| Admin | ❌ | — | Not linked | — |

Built: Home, 4 Product, Cart, Checkout, Thank-you (8 pages).

---

## 3. Integrations

| System | Built | Tested | Credentials | Notes |
|---|---|---|---|---|
| Razorpay | 🟡 Built | ❌ | **placeholder** | Order create (fetch) + payment signature verify + webhook verify done. Prepaid disabled until real `rzp_test_` keys added. |
| Server-side price validation | ✅ Built | ❌ live | n/a | `/api/checkout` recomputes all prices from catalogue; client sends only slug+qty (price tampering not possible). |
| Supplier (TBD) | ❌ | ❌ | none | Generic `supplierSku` only. M5. |
| Database (Postgres/Prisma) | ❌ | ❌ | none | **Orders in local JSON file** (`.data/orders.json`) — placeholder until hosted DB. Interface in `lib/orders.ts`. |
| Email (Resend) | ❌ | ❌ | none | M4/M6. |
| Analytics (GA4 / Meta Pixel) | ❌ | ❌ | none | M6–M7. |

---

## 4. Trust checklist (RESEARCH.md §B)

| # | Item | Status |
|---|---|---|
| 1 | Honest hero trust strip | ✅ Live |
| 2 | WhatsApp primary support | ✅ Live (everywhere incl. thank-you) |
| 3 | Mobile bottom nav | ✅ Live |
| 4 | Strike-through anchor pricing | ✅ Live (home + PDP) |
| 5 | Delivery-date promise before ATC | ✅ Live (PDP) |
| 6 | Occasion-first + Rakhi countdown | ✅ Live |
| 7 | Personalizable tag + live preview | ✅ Live |
| 8 | Footer trust block | ✅ Live |
| 9 | Positive specific return policy | 🟡 Messaging ✅; policy page ❌ (M6) |
| 10 | Free-shipping + **prepaid nudge** | ✅ Live (checkout ₹50-off prepaid toggle + free shipping) |

Live 9/10 · Partial 1/10 (#9 needs the policy page).

---

## 5. Placeholder / fake content (must be real before launch)

| Placeholder | Location | Needs |
|---|---|---|
| Product mockups / gallery | `product/ProductMockup.tsx`, `PersonalizationStudio.tsx` | Real supplier images |
| Home imagery | `ProductCard.tsx`, `Hero.tsx` | Real images |
| Testimonials | `home/Testimonials.tsx` (labelled) | Real reviews + photos |
| Catalogue + prices + supplier SKUs | `src/lib/products.ts` | Confirmed real data |
| Ratings | `products.ts` `rating` (reviews:0) | Real ratings |
| Uploaded photo | preview-only; cart stores filename | Real upload/persistence (M5) |
| **Razorpay keys** | `.env.local` (`rzp_test_PLACEHOLDER`) | Real Razorpay **test** keys |
| **Order store** | `.data/orders.json` (local file) | Hosted Postgres/Prisma |
| Public email · Instagram · SLA | `site.ts` | Confirm / forwarding |

Real now: phone, address, Rakhi date, brand persona, product copy, checkout math.

---

## 6. Blockers (need founder decision/credential)

| Blocker | Gates | Owner |
|---|---|---|
| **Razorpay real test keys** | Prepaid/online payment (COD works without) | Yash |
| Razorpay webhook secret | webhook verification live | Yash |
| DB host (Neon/Supabase) + `DATABASE_URL` | order persistence (file is ephemeral on serverless), photo upload | Yash |
| Supplier choice + API creds | M5 | Yash |
| Resend API key | order emails | Yash |
| Final SKUs/prices/supplier SKU codes | real product data | Yash |
| Supplier mockup images | real imagery | Yash |
| Policy facts (returns, GST, jurisdiction) | M6 policies | Yash |
| Domain + `hello@` forwarding | pre-launch email | Yash |
| Deploy target confirm (Vercel) | M7 | Yash |

---

## 7. Decisions made so far

| Decision | Choice |
|---|---|
| Framework | Next.js 16 + React 19 + TypeScript + Tailwind v4 |
| Supplier | **Deferred** — generic `supplierSku`, no Qikink hardcoding |
| GitHub push | **Deferred** — local commits only |
| Razorpay (M4) | Built with **placeholder test keys**; prepaid gated until real keys (COD works now). Logic identical when keys swapped. |
| Database | Choice pending; orders in local JSON file for now |
| Order storage | `lib/orders.ts` interface → file now, DB later |
| Customer-facing identity | Brand persona **"Team AuraaMarts"** |
| Public email | `hello@auraamarts.com` (needs forwarding); `ownerEmail` = Gmail |
| Guest checkout | No forced accounts |

---

## 8. Dependencies & env vars

| Type | Present |
|---|---|
| Dependencies | `next@16.2.10`, `react@19.2.4`, `react-dom@19.2.4` (dev: tailwind v4, typescript, eslint). **No new npm deps in M4** (Razorpay via fetch + `node:crypto`). |
| Env vars | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` — placeholders in `.env.local` (git-ignored); template in `.env.example` (committed). |

---

## 9. Components & modules inventory

| Area | Files |
|---|---|
| `src/app` | `layout.tsx`, `page.tsx`, `not-found.tsx`, `product/[slug]/page.tsx`, `cart/page.tsx`, `checkout/page.tsx`, `thank-you/page.tsx` |
| `src/app/api` | `checkout/route.ts`, `razorpay/verify/route.ts`, `razorpay/webhook/route.ts` |
| `src/lib` | `site.ts`, `format.ts`, `products.ts`, `cart.tsx`, `checkout.ts` (pricing+validation), `orders.ts` (store, server-only), `razorpay.ts` (server-only) |
| `components/site` | Header, Footer, MobileBottomNav, WhatsAppFab, TrustBadges, CartBadge |
| `components/home` | Hero, FeaturedProducts, HowItWorks, Occasions, RakhiCountdown, Testimonials, AboutTeaser |
| `components/ui` | icons, ProductCard |
| `components/product` | ProductMockup, PersonalizationStudio, Breadcrumbs, ProductFAQ, ProductReviews, RelatedProducts |
| `components/cart` | ClearCart |

Client components: `RakhiCountdown`, `cart` provider, `CartBadge`, `ProductMockup`, `PersonalizationStudio`, `cart/page`, `checkout/page`, `ClearCart`. Everything else is a Server Component. `lib/orders.ts` + `lib/razorpay.ts` are server-only (node APIs).

---

## 10. Commits (local only, no remote)

| Commit | Contents |
|---|---|
| `553ee31` M2: scaffold, design system, homepage + real contact details | M2 baseline + contacts + status file |
| `a8fa7da` M3: product pages + live personalization preview + cart store | 4 SSG product pages, studio, cart store |
| `d4ef837` docs: record M3 commit | status doc update |
| `fbd487f` M4: cart + checkout + Razorpay + COD + server-side price validation | cart/checkout/thank-you, 3 API routes, order store, Razorpay verify/webhook |
| *(pending)* M5 (partial) | Admin panel — **building now, awaiting review** |

---

## 11. Changelog

- **M4** — Cart page, single-page checkout (validated name/phone/pincode), COD + prepaid toggle with
  server-side ₹50 prepaid discount. `/api/checkout` recomputes all prices server-side (client sends
  only slug+qty). Razorpay: order creation (fetch), payment signature verification, webhook verification
  (`node:crypto`, no SDK). Order store (`lib/orders.ts`, local JSON file). Thank-you page + WhatsApp
  confirmation + cart clear. Env: `.env.local` placeholder keys + `.env.example`; `.gitignore` updated
  (`!.env.example`, `/.data`). README rewritten with setup + placeholder-keys note. No new npm deps.
- **M3** — Product model + `/product/[slug]` (SSG), live personalization studio, cart store, header badge. `a8fa7da`.
- **M2** — Scaffold + design system + homepage + chrome + 404. `553ee31`.
- **M1** — RESEARCH.md + CLAUDE.md.
