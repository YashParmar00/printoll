/**
 * Supplier fulfilment adapter — STUB (no supplier chosen yet).
 *
 * This is the SINGLE, isolated place the automatic order-push will live. When a
 * supplier is picked (e.g. Qikink), everything supplier-specific goes behind
 * this interface — nothing else in the app imports a supplier SDK or hardcodes
 * a supplier's field names. The admin panel calls `pushOrderToSupplier`; today
 * it throws, so the admin's "Push to supplier" action stays disabled.
 *
 * TODO(M5 — once a supplier is selected):
 *   1. authenticate (e.g. client id/secret → access token; cache + refresh)
 *   2. map our Order → supplier create-order payload:
 *        - line items keyed by `product.supplierSku`
 *        - personalization (engraving text / uploaded photo URL)
 *        - shipping address + COD vs prepaid flag + order value
 *   3. POST create-order; on success store { supplierOrderId, trackingUrl } on the Order
 *   4. on failure: DO NOT lose the order — keep it `confirmed` and surface an
 *      alert in /admin so it can be retried manually.
 *   Build + test against the supplier's SANDBOX first (see RESEARCH.md §C).
 */
import type { Order } from "@/lib/orders";

export interface SupplierPushResult {
  supplierOrderId: string;
  trackingUrl?: string;
}

/** No supplier configured yet — gates the admin "Push to supplier" action. */
export function isSupplierConfigured(): boolean {
  return false;
}

export async function pushOrderToSupplier(_order: Order): Promise<SupplierPushResult> {
  throw new Error(
    "Supplier push is not implemented yet — no supplier has been selected. " +
      "Wire it up in src/lib/supplier.ts once a supplier is chosen.",
  );
}
