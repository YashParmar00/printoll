-- Additive schema change, separate from any database/provider migration.
-- Run on an isolated test schema first. Existing orders are not marked paid.
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "onlineAmount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "checkoutKey" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "requestHash" TEXT;
-- Legacy advancePaid recorded intended collection, not verified collection.
-- Legacy orders require reconciliation; do not infer capture from this column.
UPDATE "Order" SET "onlineAmount" = "advancePaid" WHERE "checkoutKey" IS NULL AND "onlineAmount" = 0;
CREATE UNIQUE INDEX IF NOT EXISTS "Order_checkoutKey_key" ON "Order"("checkoutKey");
-- Nonunique deliberately: legacy provider IDs must be checked before uniqueness.
-- Settlement refuses ambiguous matches, instead of selecting an arbitrary order.
CREATE INDEX IF NOT EXISTS "Order_razorpayOrderId_idx" ON "Order"("razorpayOrderId");
CREATE TABLE IF NOT EXISTS "RequestLimit" ("key" TEXT PRIMARY KEY, "count" INTEGER NOT NULL, "resetAt" TIMESTAMP(3) NOT NULL);
