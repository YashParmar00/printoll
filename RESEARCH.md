# RESEARCH.md — AuraaMarts Build Decisions

Competitor research done by co-founder (Claude), 19 Jul 2026. Sources: bigsmall.in, oyehappy.com, igp.com live-site analysis + Qikink API docs. Claude Code: treat the decisions below as REQUIREMENTS — Milestone 1 is done; verify only the Qikink API field details (Section C) against the Postman docs, then proceed to Milestone 2.

## A. What winning Indian gift stores actually do (observed)

**Oye Happy** (closest to our model): leads with social proof numbers — "4.2/5 from 85,000 reviews", "750,000+ Happy Customers", "1M+ Gifts Delivered" — right on the homepage; WhatsApp chat is central ("Chat with us 10AM–8PM" deep link); mobile bottom-nav bar (Home / Categories / Occasion / Chat); free-shipping threshold banner ("Free shipping above ₹999"); navigation by Occasion, Relationship, and Type; sale price + struck regular price on every card.

**Bigsmall.in**: "Easy 7 Days Return & Exchange" as a top trust line; visible review counts on every product; strike-through pricing with "Save 35%" labels; real phone number + physical Delhi address in footer (COD trust); paid gift-wrap add-on (₹45) as an AOV booster.

**IGP**: longevity + scale claims ("15 years", "5M+ gifts delivered"); delivery-urgency badges on product tiles ("Same Day", "90-Min Delivery"); occasion-first merchandising (Rakhi/Diwali sections); "Personalizable" tags on product cards; photo upload for photo cakes/frames.

## B. The 10 design/trust decisions for AuraaMarts (build these)

1. **Social proof strip on homepage hero** — we have no volume yet, so use honest early-stage proof: "COD Available | Made in India | 5–7 Day Delivery | 7-Day Damage Replacement". Add review counts as real ones accumulate. Never fake numbers.
2. **WhatsApp is the primary support channel** — floating button on every page + "Chat with us (10AM–8PM)" in header/footer, wa.me deep link. This is both trust and our RTO-reduction tool.
3. **Mobile bottom navigation bar** (Home / Shop / Occasions / WhatsApp) like Oye Happy — assume 85% mobile.
4. **Strike-through anchor pricing on every product card** (₹799 ~₹1,299~ + "Save 38%") — universal pattern across all three competitors.
5. **Delivery-date promise on product page before add-to-cart** ("Order today, delivery by Fri 24 Jul") — computed as order date + 6 days; IGP-style urgency badges only when true.
6. **Occasion-first merchandising** — homepage occasion row with Rakhi first + countdown timer; navigation by Occasion and Relationship (For Sister, For Him/Her), not just product type.
7. **"Personalizable" tag on product cards + live preview on product page** — name/photo overlaid on mockup before purchase; IGP-style photo upload for the frame/mug.
8. **Footer trust block**: support email, phone number, business address, response-time promise — Bigsmall shows a real address; COD customers check this.
9. **Return policy framed positively and specifically**: "7-Day Damage Replacement Guarantee" (personalized items: replacement for damage/defect, not change-of-mind refunds — state plainly, like Bigsmall's "Easy Returns" framing).
10. **Free-shipping + prepaid nudge at cart**: "Free shipping on all orders" (we bake it into price) + "₹50 off if you pay online" toggle — converts COD to prepaid, cutting RTO risk.

## C. Integration flows (verified)

**Qikink API** (docs: https://documenter.getpostman.com/view/26157218/2sB3QKqpma): Auth = ClientId + client_secret → access_token (keys from dashboard → Integration → Custom API). Sandbox at https://sandbox.qikink.com/, live at https://api.qikink.com/. Rate limit: 30 requests/minute — add retry with backoff and queue order pushes. HTTPS only. → Claude Code: pull the create-order request schema and tracking endpoints from the full Postman collection during Milestone 5; build against SANDBOX first.

**Razorpay**: create Order server-side (Orders API) → open Standard Checkout on client → verify payment signature server-side (HMAC-SHA256 of order_id|payment_id with key secret) → also consume webhooks (payment.captured) with webhook-secret verification as source of truth. COD bypasses Razorpay entirely: order goes to `pending` for founder confirmation via WhatsApp before Qikink push.

**RTO mitigation stack** (India COD standard practice): mandatory 10-digit phone validation at checkout → WhatsApp confirmation message after COD order → ₹50 prepaid discount → accurate delivery dates → address + pincode validation.

### Verification note — Claude Code, 19 Jul 2026

Cross-checked Section C against public Qikink and Razorpay sources. Confirmed:

- **Qikink auth model** — ClientId + client_secret exchanged for an `access_token`; keys issued from dashboard → Integration → Custom API. Live API access is gated and requested from the dashboard. ✅
- **Qikink base URLs** — Sandbox `https://sandbox.qikink.com/`, Live `https://api.qikink.com/`. ✅ Build and test against **sandbox** first.
- **Qikink COD model** — Qikink runs on a prepaid-credit wallet; the order amount (and COD handling) is deducted from account credits when an order is processed, and COD remittance is settled back in ~5–7 working days. Implication: our COD orders still require Qikink credits to fulfil. ✅
- **Razorpay flow** — server-side Orders API → Standard Checkout → HMAC-SHA256 signature verification (`order_id|payment_id`, keyed by key-secret) → `payment.captured` webhook with `x-razorpay-signature` over the raw body as source of truth. ✅

Could **not** fully verify from public docs (Postman collection is a JS-rendered SPA; the create-order JSON schema and the exact per-minute rate limit are behind it / the authenticated dashboard):

- Exact **create-order request body** field names (line items, `print_type_id`, design/mockup fields, gateway/COD flag, address shape).
- The precise **rate limit** number (Section C says 30 req/min — treat as a working assumption; implement backoff + a push queue regardless).
- The **order status / tracking** endpoint shape.

→ Per Section C's own instruction, the full create-order schema + tracking endpoints will be pulled from the live Postman collection / authenticated dashboard during **Milestone 5**, building against sandbox. The M5 Qikink client will be written behind an interface so the exact field mapping is isolated to one adapter file.

## D. Open items for founder (Yash)

- Create Qikink account → Integration → Custom API → get ClientId/secret (sandbox first).
- Create Razorpay account in test mode → keys for .env.local. Policy pages must be live before requesting live-mode approval.
- Decide final launch SKUs (3 gifts + acupressure mat) so product seed data is real.
