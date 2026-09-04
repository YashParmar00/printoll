import { listCatalogProducts } from "@/lib/catalog";
import { clampQty, CheckoutError, type CheckoutLineInput, type OrderLine, type OrderTotals, type PaymentMethod } from "@/lib/checkout";
import { site } from "@/lib/site";

/** Database-backed checkout calculation. This is the server source of truth for admin-edited pricing. */
export async function computeDatabaseTotals(items: CheckoutLineInput[], paymentMethod: PaymentMethod): Promise<OrderTotals> {
  if (!Array.isArray(items) || items.length === 0) throw new CheckoutError("Your cart is empty.");
  const catalogue = new Map((await listCatalogProducts()).map((product) => [product.slug, product]));
  const lineItems: OrderLine[] = items.map((item) => {
    const product = catalogue.get(item.slug);
    if (!product) throw new CheckoutError(`This item is no longer available: ${item.slug}`);
    const qty = clampQty(item.qty);
    return { slug: product.slug, name: product.name, qty, unitPrice: product.price, lineTotal: product.price * qty, requiresAdvance: product.requiresAdvance, personalizationText: item.personalizationText?.slice(0, 40), personalizationPhotoName: item.personalizationPhotoName?.slice(0, 120) };
  });
  const subtotal = lineItems.reduce((sum, line) => sum + line.lineTotal, 0);
  const requiresAdvance = lineItems.some((line) => line.requiresAdvance);
  const discount = paymentMethod === "prepaid" ? Math.min(site.prepaidDiscount, subtotal) : 0;
  const total = subtotal - discount;
  const advancePaid = paymentMethod === "prepaid" ? total : paymentMethod === "advance_cod" && requiresAdvance ? Math.min(site.advanceAmount, total) : 0;
  return { lineItems, subtotal, discount, shipping: 0, total, advancePaid, codDue: total - advancePaid, requiresAdvance, currency: "INR" };
}

export async function catalogItemsRequireAdvance(items: CheckoutLineInput[]) {
  const catalogue = new Map((await listCatalogProducts()).map((product) => [product.slug, product]));
  return items.some((item) => catalogue.get(item.slug)?.requiresAdvance ?? false);
}
