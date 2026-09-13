# Ecommerce remediation checklist and change log

Baseline: `tmp/perf-audit/PERFORMANCE-AUDIT.md` (13 September 2026).
No hosting or database technology migration. Production customer records must not be used for destructive tests.

| Recommendation | Files / functions | Plan / status |
| --- | --- | --- |
| R01 | admin-auth, proxy, login actions, thank-you, API helpers | Signed expiring admin/receipt tokens; private responses; abuse controls |
| R02 | checkout API, orders, razorpay, verify/webhook, ClearCart | Durable idempotency, guarded payment settlement, explicit errors, authorized confirmation |
| R03 | checkout validation/server, cart, checkout page, PersonalizationStudio | One authoritative snapshot, typed sizes/options, validated local storage, current server quote |
| R04 | PersonalizationStudio, ProductCard, ProductBannerCarousel | Optimized responsive gallery/thumbnails and appropriate priority |
| R05 | HeroShowcase, TeeCanvas | Immediate poster, intent loading, selected texture first, errors/retry/cleanup |
| R06 | catalog, PDP, checkout-server | Memoized PDP lookup, nonblocking related section, single bounded checkout read |
| R07 | catalog, home-collections, admin/actions, sitemap | Public tagged cache, immediate admin invalidation; private data uncached |
| R08 | cart/checkout, CartProvider, admin forms | Stable hydration geometry, pending states, safe submitted-cart clearing |
| R09 | catalog, FeaturedProducts, admin pages | Projections, bounded featured and admin reads |
| R10 | schema, orders/payment service, webhook | Targeted provider lookup; duplicate inspection before unique index |
| R11 | schema/query plans | Conditional growth indexes deferred unless current plans justify |
| R12 | deployment metadata | Verify if accessible; do not assume production region |
| R13 | checkout page, browser payment loader | One script promise; overlap with checkout request |
| R14 | layout/fonts | Inspect glyphs; change only after validation |
| R15 | carousel hooks / viewer | Pause hidden/offscreen work; avoid speculative UI rewrite |
| R16 | upload handler/media | Bounded body, magic-byte/type/size checks, object storage, versioned URLs |
| R17 | browser metrics, server timing, validation scripts | Privacy-preserving metrics and repeatable lab runs; field access conditional |
| R18 | product options | Typed size validation applies; finite-stock/search systems not currently justified |

Validation: build, TypeScript, source ESLint, unit/integration scenarios, production browser runs, fresh audit and before/after report. Record tests that cannot run explicitly.

## Progress

- Re-read baseline, commerce/auth/database routes and installed Next 16 cache/image guides. Working tree initially clean.
- Implementation in progress. The original audit remains unchanged.
