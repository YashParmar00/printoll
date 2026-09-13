import { test } from "node:test";
import assert from "node:assert/strict";
import { Prisma } from "@prisma/client";
import { createHmac, randomUUID } from "node:crypto";
import { issueToken, verifyToken, adminSubject } from "../src/lib/signed-token";
import { validateCustomer } from "../src/lib/checkout";
import { validateItems } from "../src/lib/checkout-input";
import { paymentMatches, settledStatus } from "../src/lib/payment-state";
import { prisma } from "../src/lib/prisma";
import { checkoutSnapshot } from "../src/lib/checkout-server";
import { POST as checkout } from "../src/app/api/checkout/route";
import { POST as verify } from "../src/app/api/razorpay/verify/route";
import { POST as webhook } from "../src/app/api/razorpay/webhook/route";

const database = new URL(process.env.DATABASE_URL!);
assert.match(database.searchParams.get("schema") ?? "", /^audit_test_[a-f0-9]+$/, "Tests must use an isolated audit schema.");
assert.equal(process.env.RAZORPAY_KEY_ID, "rzp_test_audit", "This suite only uses synthetic provider credentials.");
const customer = { name: "Audit Customer", phone: "9999999999", address: "Synthetic test address", city: "Mumbai", state: "Maharashtra", pincode: "400001" };
const request = (url: string, body: unknown, headers: Record<string, string> = {}) => new Request(`http://localhost${url}`, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });

test("signed receipts and admin tokens reject tampering, wrong scope, other orders and expiry", () => {
  const token = issueToken("receipt", "order-A", 60, 1000);
  assert(verifyToken(token, "receipt", "order-A", 2000));
  for (const value of [undefined, "", token + "x", token.replace(/^./, "x")]) assert(!verifyToken(value, "receipt", "order-A", 2000));
  assert(!verifyToken(token, "receipt", "order-B", 2000));
  assert(!verifyToken(token, "admin", "order-A", 2000));
  assert(!verifyToken(token, "receipt", "order-A", 61000));
  const admin = issueToken("admin", adminSubject("u", "p"), 60);
  assert(!Buffer.from(admin.split(".")[0], "base64url").toString().includes('"p"'));
  assert(!verifyToken(admin, "admin", adminSubject("u", "rotated")));
});

test("runtime input validation rejects malformed types and bounds", () => {
  for (const value of [null, [], 1, "x", { ...customer, name: 1 }, { ...customer, address: "x".repeat(501) }]) assert(validateCustomer(value));
  assert.equal(validateCustomer(customer), null);
  for (const value of [null, {}, [], [{ slug: "valid", qty: 0 }], [{ slug: "valid", qty: -1 }], [{ slug: "valid", qty: 11 }], [{ slug: "valid", qty: 1.5 }], [{ slug: "valid", qty: "1" }], [{ slug: "valid", qty: 1, sizes: ["BAD"] }], [{ slug: "valid", qty: 1, personalizationText: "x".repeat(25) }], Array.from({ length: 31 }, () => ({ slug: "valid", qty: 1 }))]) assert.throws(() => validateItems(value));
  assert.throws(() => validateItems([{ slug: "valid", qty: 1 }, { slug: "valid", qty: 1 }]));
});

test("capture checks validate ID, amount, currency and state, preserving fulfilment", () => {
  const order = { razorpayOrderId: "order_test", onlineAmount: 99, currency: "INR", paymentMethod: "advance_cod" };
  const payment = { id: "pay_test", order_id: "order_test", amount: 9900, currency: "INR", status: "captured", captured: true };
  assert(paymentMatches(order, payment));
  for (const patch of [{ amount: 1 }, { currency: "USD" }, { status: "authorized" }, { captured: false }, { order_id: "order_wrong" }]) assert(!paymentMatches(order, { ...payment, ...patch }));
  assert.equal(settledStatus("awaiting_payment", "advance_cod"), "confirmed");
  assert.equal(settledStatus("awaiting_payment", "prepaid"), "paid");
  for (const state of ["shipped", "delivered", "cancelled", "confirmed"]) assert.equal(settledStatus(state, "prepaid"), state);
});

test("isolated database: checkout retries, authoritative prices, callback/webhook ordering", async () => {
  const source = await prisma.product.findFirstOrThrow({ where: { active: true } });
  const slug = `audit-${randomUUID()}`;
  await prisma.product.create({ data: { ...source, faqs: source.faqs as Prisma.InputJsonValue, id: undefined, slug, category: "women", personalization: "none", requiresAdvance: false, shape: "tee", price: 700 } });
  const items = [{ slug, qty: 1, sizes: ["M"] }];
  const originalFetch = globalThis.fetch;
  const originalTransaction = prisma.$transaction;
  let creates = 0;
  let amount = 0;
  const providerId = `order_${randomUUID().replaceAll("-", "")}`;
  const payment = () => ({ id: "pay_audittest", order_id: providerId, amount, currency: "INR", captured: true, status: "captured" });
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    assert(url.startsWith("https://api.razorpay.com/v1/"), "Unexpected network request in payment mock.");
    if (url.endsWith("/orders")) { creates++; amount = JSON.parse(String(init?.body)).amount; return Response.json({ id: providerId, amount, currency: "INR" }); }
    return Response.json(payment());
  };
  try {
    const snapshot = await checkoutSnapshot(items);
    assert.equal(snapshot.totals.cod.total, 700);
    await assert.rejects(checkoutSnapshot([{ slug: "missing-audit-product", qty: 1, sizes: ["M"] }]));
    await assert.rejects(checkoutSnapshot([{ slug, qty: 1, sizes: ["M", "L"] }]));
    const key = randomUUID();
    const body = { customer, items, paymentMethod: "prepaid", expectedTotal: snapshot.totals.prepaid.total };
    const first = await checkout(request("/api/checkout", body, { "idempotency-key": key }));
    assert.equal(first.status, 200, await first.clone().text());
    assert.match(first.headers.get("cache-control")!, /no-store/);
    assert.match(first.headers.get("set-cookie")!, /HttpOnly/);
    const placed = await first.json();
    const retry = await checkout(request("/api/checkout", body, { "idempotency-key": key }));
    assert.equal((await retry.json()).orderNumber, placed.orderNumber);
    assert.equal(creates, 1);
    assert.equal(await prisma.order.count({ where: { checkoutKey: key } }), 1);
    let stored = await prisma.order.findUniqueOrThrow({ where: { orderNumber: placed.orderNumber } });
    assert.equal(stored.advancePaid, 0);
    const callback = { orderNumber: placed.orderNumber, razorpay_order_id: providerId, razorpay_payment_id: "pay_audittest", razorpay_signature: "0".repeat(64) };
    assert.equal((await verify(request("/api/razorpay/verify", callback))).status, 400);
    assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: stored.id } })).status, "awaiting_payment");
    callback.razorpay_signature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(`${providerId}|pay_audittest`).digest("hex");
    assert.equal((await verify(request("/api/razorpay/verify", callback))).status, 200);
    assert.equal((await verify(request("/api/razorpay/verify", callback))).status, 200);
    const raw = JSON.stringify({ event: "payment.captured", payload: { payment: { entity: payment() } } });
    const signature = createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!).update(raw).digest("hex");
    const sendWebhook = () => webhook(new Request("http://localhost/api/razorpay/webhook", { method: "POST", body: raw, headers: { "x-razorpay-signature": signature } }));
    assert.equal((await sendWebhook()).status, 200);
    await prisma.order.update({ where: { id: stored.id }, data: { status: "shipped" } });
    assert.equal((await sendWebhook()).status, 200);
    stored = await prisma.order.findUniqueOrThrow({ where: { id: stored.id } });
    assert.equal(stored.status, "shipped");
    assert.equal(stored.paymentStatus, "captured");
    assert.equal(stored.advancePaid, 650);
    const cod = await checkout(request("/api/checkout", { ...body, paymentMethod: "cod", expectedTotal: 700 }, { "idempotency-key": randomUUID() }));
    assert.equal(cod.status, 200);
    await prisma.product.update({ where: { slug }, data: { price: 800 } });
    assert.equal((await checkoutSnapshot(items)).totals.cod.total, 800);
    assert.equal((await checkout(request("/api/checkout", { ...body, paymentMethod: "cod", expectedTotal: 700 }, { "idempotency-key": randomUUID() }))).status, 409);
    await prisma.product.update({ where: { slug }, data: { active: false } });
    await assert.rejects(checkoutSnapshot(items));
    // Reverse delivery order: webhook first, callback second, same payment.
    await prisma.order.update({ where: { id: stored.id }, data: { status: "awaiting_payment", paymentStatus: "unpaid", razorpayPaymentId: null, advancePaid: 0 } });
    assert.equal((await sendWebhook()).status, 200);
    assert.equal((await verify(request("/api/razorpay/verify", callback))).status, 200);
    prisma.$transaction = async () => { throw new Error("Synthetic persistence failure"); };
    assert.equal((await verify(request("/api/razorpay/verify", callback))).status, 503);
    assert.equal((await sendWebhook()).status, 503);
    prisma.$transaction = originalTransaction;
  } finally { prisma.$transaction = originalTransaction; globalThis.fetch = originalFetch; await prisma.product.update({ where: { slug }, data: { active: false } }); await prisma.$disconnect(); }
});
