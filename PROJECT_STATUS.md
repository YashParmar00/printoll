# PROJECT_STATUS.md — AuraaMarts single source of truth

**What this file is:** the live "what exists right now vs. what doesn't" for this codebase.
Separate from `RESEARCH.md` (competitor + integration research) and `CLAUDE.md` (coding conventions).

**Update rule:** after *every* task/milestone, update this file immediately (before moving on) —
every new page, component, placeholder, env var, dependency, and blocker. Keep it as scannable
status tables, not paragraphs.

**Last updated:** real Qikink catalog + **curated homepage grid** (4 personalized gifts) + **Razorpay
TEST keys live & verified** (advance order created, invalid-signature reject, ADVANCE_REQUIRED all pass).
FAQ/Return product lists updated. Committed & pushed (`1ab4cbe`). Supplier auto-push deferred (stubbed). M7 not started.

---

## 1. Milestone status (M1–M7)

| Milestone | Status | Missing |
|---|---|---|
| **M1** Research → RESEARCH.md + CLAUDE.md | ✅ Done | — |
| **M2** Scaffold + design system + homepage | ✅ Done · `553ee31` | Imagery placeholder. |
| **M3** Products + live personalization preview | ✅ Done · `a8fa7da` | Photo-upload persistence (preview-only). |
| **M4** Cart/checkout + Razorpay + COD | ✅ Done · `fbd487f` | Prepaid/advance need real Razorpay keys; orders in local file. |
| **M5** Supplier + admin | ✅ Admin done · `ca8652b` | **Supplier auto-push deferred** (stubbed in `lib/supplier.ts`). |
| **Payment** partial ₹99 advance | ✅ Done · `ca8652b` | Advance charge needs real Razorpay keys (COD fallback in dev). |
| **M6** Remaining pages + SEO | ✅ **Done** | FAQ + Return/Refund advance copy **finalized** (founder's wording). Category/Track are client pages → default metadata. Policy pages still worth a final legal review. |
| **M7** QA + deploy | ❌ Not started | Tests, Lighthouse, deploy, handover doc. |

---

## 2. Page-by-page

| Page | Route | Content | Nav-linked | Mobile |
|---|---|---|---|---|
| Home | ✅ `app/page.tsx` | Real copy, placeholder imagery | ✅ | ✅ |
| Product ×5 | ✅ `app/product/[slug]` (SSG) | Real Qikink products + live preview + JSON-LD | ✅ | ✅ sticky ATC |
| Category | ✅ `app/category` | Personalized grid + occasion/price filter | ✅ Shop | ✅ |
| Cart | ✅ `app/cart` | localStorage cart | ✅ badge | ✅ |
| Checkout | ✅ `app/checkout` | Form + COD/advance/prepaid | ✅ | ✅ |
| Thank-you | ✅ `app/thank-you` | Order summary + advance split | ✅ | ✅ |
| About | ✅ `app/about` | Brand-voice story ("Team AuraaMarts") | ✅ | ✅ |
| Contact | ✅ `app/contact` | WhatsApp-composing form + details | ✅ footer | ✅ |
| FAQ | ✅ `app/faq` | ~10 Qs incl. ₹99 advance (final copy) | ✅ footer | ✅ |
| Track Order | ✅ `app/track` + `/api/track` | Lookup by order # + phone | ✅ | ✅ |
| Policies ×4 | ✅ `shipping-policy` `return-policy` `privacy-policy` `terms` | India-appropriate; Return has final advance copy | ✅ footer | ✅ |
| Admin | ✅ `app/admin` (basic-auth) | Orders + stats + manual status | not linked (intentional) | scrolls |

**All customer pages + admin built.** SEO: `sitemap.xml`, `robots.txt`, Product JSON-LD — verified 200 live.

---

## 3. Integrations

| System | Built | Tested | Credentials | Notes |
|---|---|---|---|---|
| Razorpay | ✅ Built | **✓ live (test keys)** | test keys in `.env.local` | Advance ₹99 order creation, invalid-signature reject, and ADVANCE_REQUIRED **verified live**. Webhook verify code ready; webhook secret pending (needs public URL, M7). |
| Server-side price validation | ✅ | ✓ (COD smoke) | n/a | `/api/checkout` recomputes from catalogue; client sends only slug+qty. |
| Admin auth | ✅ | ✓ (401/200) | dev pw in `.env.local` | HTTP Basic via `src/proxy.ts`. |
| Track order | ✅ | ✓ (200 live) | n/a | `/api/track` looks up by order # + phone (order store). |
| Supplier (TBD) | ❌ (stub) | ❌ | none | `lib/supplier.ts` + disabled admin push button. |
| Database (Postgres/Prisma) | ❌ | ❌ | none | Orders in `.data/orders.json` (local file). |
| Email (Resend) / Analytics (GA4/Pixel) | ❌ | ❌ | none | M7 / not started. |

---

## 4. Trust checklist (RESEARCH.md §B)

| # | Item | Status |
|---|---|---|
| 1–8 | trust strip · WhatsApp · mobile nav · anchor pricing · delivery promise · occasions+countdown · personalizable+live preview · footer trust | ✅ Live |
| 9 | Positive specific return policy | ✅ Live — Return & Refund page (7-day damage replacement; advance copy DRAFT) |
| 10 | Free-shipping + prepaid/advance nudge | ✅ Live |

**Live 10/10.**

---

## 5. Placeholder / fake content (must be real before launch)

| Placeholder | Location | Needs |
|---|---|---|
| Product mockups / gallery / home imagery | `product/ProductMockup.tsx`, `PersonalizationStudio.tsx`, `ProductCard.tsx`, `Hero.tsx` | Real supplier images |
| Testimonials | `home/Testimonials.tsx` (labelled) | Real reviews + photos |
| ✅ RESOLVED — real catalogue | `src/lib/products.ts` | Real Qikink products + prices. Necklace `UP11` + Frame `AF22` confirmed; **mug SKUs `MAGIC-MUG`/`WHITE-MUG` are placeholders** pending sample order |
| **Policy copy** | `app/*-policy`, `app/terms` | Final legal review before launch |
| Uploaded photo | preview-only; cart stores filename | Real upload/persistence |
| Admin password · Razorpay **live** keys · webhook secret | `.env.local` | Test keys set; production/live values + webhook secret before launch |
| Order store | `.data/orders.json` | Hosted Postgres/Prisma |
| Public email · Instagram · SLA | `site.ts` | Confirm / forwarding |

Real now: phone, address, Rakhi date, brand persona, **real Qikink catalogue + prices**, product copy, checkout math, page structure.

---

## 6. Blockers (need founder decision/credential)

| Blocker | Gates | Owner |
|---|---|---|
| Razorpay **webhook secret** (needs public URL) | webhook confirmation (payment signature verify already works) | Yash / M7 |
| Supplier choice + API creds | supplier auto-push (M5 remainder) | Yash |
| DB host (Neon/Supabase) + `DATABASE_URL` | order persistence, photo upload | Yash |
| Resend API key | order emails | Yash |
| Final SKUs/prices/supplier SKUs · supplier images | real product data/imagery | Yash |
| Strong `ADMIN_PASSWORD` · Domain + `hello@` forwarding · Deploy target | pre-launch / M7 | Yash |

---

## 7. Decisions made so far

| Decision | Choice |
|---|---|
| Framework | Next.js 16 + React 19 + TypeScript + Tailwind v4 |
| Supplier | **Qikink** for product sourcing (real SKUs `UP11`/`AF22`; mug SKUs pending sample order). Auto-push integration still **stubbed** in `lib/supplier.ts` |
| GitHub push | **Connected** → https://github.com/YashParmar00/AuraaMarts — full history pushed. `.env.local` + `.data/` git-ignored. |
| Razorpay | **TEST keys live** in `.env.local` — prepaid + ₹99 advance enabled & verified. Webhook secret pending (M7/deploy). |
| **Payment model** | Personalized items → **₹99 online advance + rest COD**; mat → full COD. Per-product `requiresAdvance` flag. **Once real keys added, full-COD AUTO-DISAPPEARS for personalized carts** (client + `ADVANCE_REQUIRED` server guard); the dev COD fallback is TEMPORARY. |
| Database | Choice pending; orders in local JSON file |
| Admin auth | HTTP Basic (single founder login) via `src/proxy.ts` |
| Middleware | Next 16 `proxy.ts` (renamed from deprecated `middleware.ts`) |
| Customer-facing identity | Brand persona "Team AuraaMarts" |
| Guest checkout | No forced accounts |

---

## 8. Dependencies & env vars

| Type | Present |
|---|---|
| Dependencies | `next@16.2.10`, `react@19.2.4`, `react-dom@19.2.4` (dev: tailwind v4, typescript, eslint). **No new npm deps.** |
| Fonts | Playfair Display, Poppins, Dancing Script (engraving) — `next/font/google` |
| Env vars | `RAZORPAY_KEY_ID/_SECRET/_WEBHOOK_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `ADMIN_USER/_PASSWORD` — placeholders in `.env.local` (ignored); template `.env.example`. |

---

## 9. Components & modules inventory

| Area | Files |
|---|---|
| `src/app` | `layout`, `page`, `not-found`, `product/[slug]`, `category`, `cart`, `checkout`, `thank-you`, `about`, `contact`, `faq`, `track`, `shipping-policy`, `return-policy`, `privacy-policy`, `terms`, `admin` (+`admin/actions.ts`), `sitemap.ts`, `robots.ts` |
| `src/app/api` | `checkout`, `razorpay/verify`, `razorpay/webhook`, `track` |
| `src` | `proxy.ts` (admin basic-auth) |
| `src/lib` | `site`, `format`, `products`, `cart.tsx`, `checkout`, `orders` (store), `razorpay`, `supplier` (stub) |
| `components/site` | Header, Footer, MobileBottomNav, WhatsAppFab, TrustBadges, CartBadge, **PageShell** |
| `components/home` | Hero, FeaturedProducts, HowItWorks, Occasions, RakhiCountdown, Testimonials, AboutTeaser |
| `components/ui` | icons, ProductCard |
| `components/product` | ProductMockup, PersonalizationStudio, Breadcrumbs, ProductFAQ, ProductReviews, RelatedProducts |
| `components/cart` | ClearCart · `components/contact` | ContactForm |

Server-only (node APIs): `lib/orders.ts`, `lib/razorpay.ts`, `lib/supplier.ts`, `proxy.ts`, `api/*`.

---

## 10. Commits & remote

**Remote:** `origin` → https://github.com/YashParmar00/AuraaMarts — pushed through `1ab4cbe`.
`.env.local` and `.data/` are git-ignored and **NOT** on GitHub.

| Commit | Contents |
|---|---|
| `553ee31` M2 | scaffold + design system + homepage + contacts |
| `a8fa7da` M3 | product pages + live personalization preview + cart store |
| `d4ef837` docs | record M3 commit |
| `fbd487f` M4 | cart + checkout + Razorpay + COD + server-side price validation |
| `9f5cee3` docs | record M4 commit; ignore local .claude settings |
| `ca8652b` feat | partial ₹99 advance payment + M5 admin panel + supplier stub + proxy auth |
| `e674fe8` docs | record GitHub remote connected |
| `0b4abdb` M6 | about/contact/faq/category/track + 4 policies + SEO + final advance wording |
| `41dd754` docs | record M6 commit |
| `1ab4cbe` feat | real Qikink catalog (necklace/frame/magic mug/white mug) + curated homepage grid |

---

## 11. Changelog

- **Real catalog** — replaced placeholder catalogue with 4 real Qikink products: Engraved Name Necklace
  (Bar Pendant `UP11`, silver, ₹549/₹899), Custom Photo Frame (Acrylic w/ stand `AF22`, ₹649/₹999),
  **Magic Photo Mug** (colour-changing reveal, ₹649/₹999), Custom Photo Mug (White, ₹429/₹699) — all
  `requiresAdvance: true`. Mat unchanged. FAQ + Return/Refund product lists updated to match. Mug SKUs
  (`MAGIC-MUG`/`WHITE-MUG`) are placeholders pending sample order. Curated the homepage "Bestselling
  Gifts" grid to the 4 personalized gifts (mat excluded). **Razorpay TEST keys added + verified** —
  advance ₹99 order created (real `order_…`), invalid signature rejected, full-COD blocked on
  personalized carts.
- **M6 — remaining pages + SEO** — Category (occasion/price filter), About (brand voice), Contact
  (WhatsApp-composing form), FAQ (~10 Qs incl. DRAFT advance), Track Order (`/api/track` lookup by
  order # + phone), 4 policy pages (Shipping, Return & Refund [DRAFT advance copy], Privacy, Terms).
  SEO: `sitemap.ts`, `robots.ts` (disallow /admin,/api,/cart,/checkout,/thank-you), Product JSON-LD
  (no fake ratings). FAQ + Return/Refund carry the founder's final ₹99 advance wording. Added
  `PageShell` + `ContactForm` + `.content` styles + `Order.trackingUrl`.
  Nav wired (Shop → /category, footer FAQ/Contact). All routes verified 200 live; /admin still 401.
- **Payment model — partial ₹99 advance** for personalized items (advance_cod). `ca8652b`.
- **M5 (admin)** — /admin (orders + status + basic-auth proxy) + supplier stub. `ca8652b`.
- **M4** — cart + checkout + Razorpay/COD + server price validation. `fbd487f`.
- **M3** — product pages + live personalization + cart store. `a8fa7da`.
- **M2** — scaffold + design system + homepage. `553ee31`.
- **M1** — RESEARCH.md + CLAUDE.md.
