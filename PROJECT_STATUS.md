# PROJECT_STATUS.md — AuraaMarts single source of truth

**What this file is:** the live "what exists right now vs. what doesn't" for this codebase.
Separate from `RESEARCH.md` (competitor + integration research) and `CLAUDE.md` (coding conventions).

**Update rule:** after *every* task/milestone, update this file immediately (before moving on) —
every new page, component, placeholder, env var, dependency, and blocker. Keep it as scannable
status tables, not paragraphs.

**Last updated:** after M5 admin + **partial-advance payment model** (₹99 advance on personalized items,
rest COD) — committed & **pushed to GitHub** (`ca8652b`). Supplier auto-push deferred (stubbed). Next: M6.

---

## 1. Milestone status (M1–M7)

| Milestone | Status | Missing |
|---|---|---|
| **M1** Research → RESEARCH.md + CLAUDE.md | ✅ Done | Exact supplier create-order schema deferred to when a supplier is chosen. |
| **M2** Scaffold + design system + homepage | ✅ Done · committed `553ee31` | Imagery placeholder. |
| **M3** Products + live personalization preview | ✅ Done · committed `a8fa7da` | Photo-upload persistence (preview-only). |
| **M4** Cart/checkout + Razorpay + COD | ✅ Done · committed `fbd487f` | Prepaid needs real Razorpay test keys; orders in local file. COD smoke-tested ✓. |
| **M5** Supplier + admin | ✅ Admin done · committed `ca8652b` | **Supplier auto-push deferred** (no supplier chosen) — stubbed in `lib/supplier.ts`. Admin panel built + auth-verified. |
| **M6** Remaining pages + SEO | ❌ Not started | About/Contact/FAQ/Category/Track + 4 policies; sitemap/robots/JSON-LD. **FAQ + Return/Refund policy MUST carry matching ₹advance wording** (founder to supply exact copy). |
| **M7** QA + deploy | ❌ Not started | Tests, Lighthouse, deploy, handover doc. |

---

## 2. Page-by-page

| Page | Route/file | Content | Nav-linked | Mobile |
|---|---|---|---|---|
| Home | ✅ `app/page.tsx` | Real copy, placeholder imagery | ✅ | ✅ |
| Product ×4 | ✅ `app/product/[slug]/page.tsx` (SSG) | Real copy + live preview | ✅ | ✅ + sticky ATC |
| Cart | ✅ `app/cart/page.tsx` | Real (localStorage) | ✅ header badge | ✅ |
| Checkout | ✅ `app/checkout/page.tsx` | Real form + payment toggle | ✅ from cart | ✅ |
| Thank-you | ✅ `app/thank-you/page.tsx` | Real order summary | ✅ post-order | ✅ |
| **Admin** | ✅ `app/admin/page.tsx` (basic-auth) | Real orders + stats + manual status | intentionally NOT linked | table scrolls on mobile |
| Category | ❌ | — | Not linked | — |
| About / Contact / FAQ | ❌ | — | About linked → 404 | — |
| Shipping / Return / Privacy / Terms | ❌ | — | Footer → 404 | — |
| Track Order | ❌ | — | Linked → 404 | — |

Built: Home, 4 Product, Cart, Checkout, Thank-you, Admin (9 pages).

---

## 3. Integrations

| System | Built | Tested | Credentials | Notes |
|---|---|---|---|---|
| Razorpay | 🟡 Built | COD path ✓ | **placeholder** | Order create + signature + webhook verify. Full prepaid **and the ₹99 advance** gated until real `rzp_test_` keys. |
| Server-side price validation | ✅ | ✓ (COD smoke) | n/a | `/api/checkout` recomputes from catalogue; client sends only slug+qty. |
| Admin auth | ✅ | ✓ (401/200) | dev password in `.env.local` | HTTP Basic via `src/proxy.ts` (`ADMIN_USER`/`ADMIN_PASSWORD`). |
| Supplier (TBD) | ❌ (stub) | ❌ | none | `lib/supplier.ts` interface + disabled admin "Push to supplier" button. No supplier hardcoded. |
| Database (Postgres/Prisma) | ❌ | ❌ | none | Orders in `.data/orders.json` (local file). |
| Email (Resend) / Analytics | ❌ | ❌ | none | M6–M7. |

---

## 4. Trust checklist (RESEARCH.md §B)

| # | Item | Status |
|---|---|---|
| 1–8 | trust strip · WhatsApp · mobile nav · anchor pricing · delivery promise · occasions+countdown · personalizable+live preview · footer trust | ✅ Live |
| 9 | Positive specific return policy | 🟡 Messaging ✅; policy page ❌ (M6) |
| 10 | Free-shipping + prepaid nudge | ✅ Live (checkout ₹50-off prepaid) |

Live 9/10 · Partial 1/10 (#9 needs the policy page).

---

## 5. Placeholder / fake content (must be real before launch)

| Placeholder | Location | Needs |
|---|---|---|
| Product mockups / gallery / home imagery | `product/ProductMockup.tsx`, `PersonalizationStudio.tsx`, `ProductCard.tsx`, `Hero.tsx` | Real supplier images |
| Testimonials | `home/Testimonials.tsx` (labelled) | Real reviews + photos |
| Catalogue + prices + supplier SKUs | `src/lib/products.ts` | Confirmed real data |
| Uploaded photo | preview-only; cart stores filename | Real upload/persistence |
| Razorpay keys | `.env.local` | Real test keys |
| **Admin password** | `.env.local` `ADMIN_PASSWORD=auraa-admin-2026` | **Set a strong one before deploy** |
| Order store | `.data/orders.json` | Hosted Postgres/Prisma |
| Public email · Instagram · SLA | `site.ts` | Confirm / forwarding |

Real now: phone, address, Rakhi date, brand persona, product copy, checkout math.

---

## 6. Blockers (need founder decision/credential)

| Blocker | Gates | Owner |
|---|---|---|
| **Supplier choice + API creds** | Automatic order push (admin push button + `lib/supplier.ts`) | Yash |
| Razorpay real test keys + webhook secret | Online payment: full prepaid **AND the ₹99 advance for personalized items** (mat full-COD works now) | Yash |
| DB host (Neon/Supabase) + `DATABASE_URL` | Order persistence (file is ephemeral on serverless), photo upload | Yash |
| Strong `ADMIN_PASSWORD` | before deploy | Yash |
| Resend API key | order emails | Yash |
| Final SKUs/prices/supplier SKU codes · supplier images | real product data/imagery | Yash |
| Policy facts (returns, GST, jurisdiction) | M6 policies | Yash |
| Domain + `hello@` forwarding · Deploy target | pre-launch / M7 | Yash |

---

## 7. Decisions made so far

| Decision | Choice |
|---|---|
| Framework | Next.js 16 + React 19 + TypeScript + Tailwind v4 |
| Supplier | **Deferred** — generic `supplierSku`; auto-push stubbed in `lib/supplier.ts`, no hardcoding |
| GitHub push | **Connected** → https://github.com/YashParmar00/AuraaMarts — full history pushed to `origin/main`. `.env.local` + `.data/` git-ignored (never pushed). |
| Razorpay | Placeholder test keys; prepaid gated until real keys (COD works). Logic identical when swapped. |
| **Payment model** | Personalized items (`requiresAdvance`) → **₹99 online advance + rest COD**; acupressure mat → full COD. Per-product flag (default true for personalized), flip-able. Full-prepaid (−₹50) still offered. **Once real Razorpay keys are added, the full-COD option AUTO-DISAPPEARS for personalized carts** — only `advance_cod` + `prepaid` remain (enforced client-side in `app/checkout/page.tsx` and server-side via the `ADVANCE_REQUIRED` guard in `/api/checkout`). The full-COD fallback for personalized carts is **TEMPORARY / dev-only** while keys are placeholders — not permanent. |
| Database | Choice pending; orders in local JSON file |
| Admin auth | **HTTP Basic** (single founder login) via `src/proxy.ts` |
| Middleware convention | Uses Next 16 **`proxy.ts`** (renamed from deprecated `middleware.ts`) |
| Customer-facing identity | Brand persona **"Team AuraaMarts"** |
| Guest checkout | No forced accounts |

---

## 8. Dependencies & env vars

| Type | Present |
|---|---|
| Dependencies | `next@16.2.10`, `react@19.2.4`, `react-dom@19.2.4` (dev: tailwind v4, typescript, eslint). **No new npm deps** (Razorpay via fetch + `node:crypto`; auth via `proxy.ts`). |
| Env vars | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, **`ADMIN_USER`, `ADMIN_PASSWORD`** — placeholders in `.env.local` (git-ignored); template in `.env.example`. |

Note: `proxy.ts` reads `ADMIN_*` from env — in dev it's live; for production, env must be set at build/deploy time.

---

## 9. Components & modules inventory

| Area | Files |
|---|---|
| `src/app` | `layout.tsx`, `page.tsx`, `not-found.tsx`, `product/[slug]/page.tsx`, `cart/page.tsx`, `checkout/page.tsx`, `thank-you/page.tsx`, `admin/page.tsx`, `admin/actions.ts` |
| `src/app/api` | `checkout/route.ts`, `razorpay/verify/route.ts`, `razorpay/webhook/route.ts` |
| `src` | `proxy.ts` (admin basic-auth) |
| `src/lib` | `site.ts`, `format.ts`, `products.ts`, `cart.tsx`, `checkout.ts`, `orders.ts` (store), `razorpay.ts`, `supplier.ts` (stub) |
| `components/site` | Header, Footer, MobileBottomNav, WhatsAppFab, TrustBadges, CartBadge |
| `components/home` | Hero, FeaturedProducts, HowItWorks, Occasions, RakhiCountdown, Testimonials, AboutTeaser |
| `components/ui` | icons, ProductCard |
| `components/product` | ProductMockup, PersonalizationStudio, Breadcrumbs, ProductFAQ, ProductReviews, RelatedProducts |
| `components/cart` | ClearCart |

Server-only (node APIs): `lib/orders.ts`, `lib/razorpay.ts`, `lib/supplier.ts`, `proxy.ts`.

---

## 10. Commits & remote

**Remote:** `origin` → https://github.com/YashParmar00/AuraaMarts — full history pushed to `origin/main`.
`.env.local` and `.data/` are git-ignored and are **NOT** on GitHub.

| Commit | Contents |
|---|---|
| `553ee31` M2 | scaffold + design system + homepage + contacts |
| `a8fa7da` M3 | product pages + live personalization preview + cart store |
| `d4ef837` docs | record M3 commit |
| `fbd487f` M4 | cart + checkout + Razorpay + COD + server-side price validation |
| `9f5cee3` docs | record M4 commit; ignore local .claude settings |
| `ca8652b` feat | partial ₹99 advance payment + M5 admin panel + supplier stub + proxy auth |

---

## 11. Changelog

- **Payment model — partial advance (personalized items)** — added `requiresAdvance` per-product config
  + `site.advanceAmount` (₹99). New `advance_cod` method: ₹99 online now + rest COD. Server
  `computeTotals` splits into `advancePaid`/`codDue` (added to `Order`); `/api/checkout` gates it
  (advance needs Razorpay; full COD blocked for personalized carts once keys are live; COD fallback
  while keys are placeholders). Checkout renders the exact trust explanation + refund reassurance beside
  the advance amount. Thank-you + admin show the prepaid-vs-COD split. **M6 FAQ + Return/Refund policy
  must carry matching ₹advance wording (founder to supply exact copy).**
- **M5 (partial — admin)** — `/admin` page (HTTP Basic auth via `src/proxy.ts`, `ADMIN_*` env): orders
  table, stats (today / total / revenue / needs-action), manual status actions (Confirm / Ship /
  Delivered / Cancel) via server actions. Extended `OrderStatus` (confirmed / pushed_to_supplier /
  shipped / delivered). `lib/supplier.ts` STUB — the single isolated place auto-push will live; admin
  "Push to supplier" button disabled until a supplier is chosen. Migrated `middleware.ts` → `proxy.ts`
  (Next 16). No new npm deps. Verified live: 401 without/with wrong auth, 200 with correct auth, renders orders.
- **M4** — Cart + checkout + Razorpay/COD + server-side price validation. `fbd487f`.
- **M3** — Product pages + live personalization + cart store. `a8fa7da`.
- **M2** — Scaffold + design system + homepage. `553ee31`.
- **M1** — RESEARCH.md + CLAUDE.md.
