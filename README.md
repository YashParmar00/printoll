# AuraaMarts

Custom ecommerce store for **auraamarts.com** — personalized gifts (engraved name necklace, custom
photo mug & frame) plus a wellness SKU, fulfilled by a print-on-demand supplier. India, mobile-first,
Cash-on-Delivery heavy. Next.js 16 + React 19 + TypeScript + Tailwind v4.

- **`RESEARCH.md`** — competitor + integration research (the §B trust decisions are requirements).
- **`CLAUDE.md`** — coding conventions.
- **`PROJECT_STATUS.md`** — single source of truth for what exists vs. what doesn't (updated every task).

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit values (see below)
npm run dev                  # http://localhost:3000
npm run build                # production build / compile check
```

## Environment variables

Copy `.env.example` → `.env.local` (git-ignored) and fill values.

| Var | Purpose |
|---|---|
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Server: create + verify Razorpay orders |
| `RAZORPAY_WEBHOOK_SECRET` | Server: verify webhook signatures |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Browser: opens Razorpay Checkout |

### ⚠️ Razorpay keys are PLACEHOLDERS right now

`.env.local` ships with placeholder Razorpay keys (`rzp_test_PLACEHOLDER`). While they're placeholders:

- **Cash on Delivery works end-to-end** (no Razorpay needed).
- **Online payment (prepaid) is intentionally disabled** — the checkout shows "coming soon" for it.

To enable prepaid, get **Test Mode** keys from **Razorpay Dashboard → Settings → API Keys**, drop them
into `.env.local`, and restart. **No code changes** — only the key values change. For webhooks, set the
webhook URL to `/api/razorpay/webhook` in the dashboard and paste its secret into `RAZORPAY_WEBHOOK_SECRET`.

## How checkout works

1. **Cart** (`/cart`) → **Checkout** (`/checkout`): minimal fields, 10-digit phone + 6-digit pincode validated.
2. On submit, `POST /api/checkout` **recomputes every price server-side** from the catalogue — the client
   cart total is never trusted. Prepaid also applies the ₹50 discount server-side and creates a Razorpay order.
3. **COD** → order saved as `pending` (founder confirms via WhatsApp). **Prepaid** → Razorpay Checkout →
   `POST /api/razorpay/verify` checks the HMAC signature → order `paid`. The webhook is the source of truth.
4. **Thank-you** (`/thank-you`) shows the order + a WhatsApp confirmation link, and clears the cart.

Orders are stored in a local JSON file (`.data/orders.json`, git-ignored) until a hosted Postgres/Prisma
DB is added — the `src/lib/orders.ts` interface keeps that swap mechanical.

## Deploy

Vercel (hobby to start; note its commercial-use limits). Set all env vars in the Vercel project.
Note: the local file order store is ephemeral on serverless — moving to a hosted DB is required before
real launch (tracked in `PROJECT_STATUS.md`).
