import { checkoutProducts } from "@/lib/catalog";
import { CheckoutError, type CheckoutLineInput, type OrderLine, type OrderTotals, type PaymentMethod } from "@/lib/checkout";
import { garmentCount, validateItems } from "@/lib/checkout-input";
import { site } from "@/lib/site";
import { isRazorpayConfigured } from "@/lib/razorpay";

export async function checkoutSnapshot(input: unknown) {
  const items = validateItems(input);
  const products = new Map((await checkoutProducts([...new Set(items.map(item => item.slug))])).map(product => [product.slug, product]));
  const lines: OrderLine[] = items.map((item: CheckoutLineInput) => {
    const product = products.get(item.slug);
    if (!product) throw new CheckoutError("An item is no longer available. Please update your cart.");
    if (item.sizes?.length !== garmentCount(product)) throw new CheckoutError(`Please reselect sizes for ${product.name}.`);
    if (["photo", "both"].includes(product.personalization)) throw new CheckoutError("Photo orders are not available until secure photo delivery is configured. Please contact us.");
    if (product.personalization === "text" && !item.personalizationText) throw new CheckoutError(`Please enter print text for ${product.name}.`);
    if (product.personalization === "none" && item.personalizationText) throw new CheckoutError("This product does not support print personalization.");
    return { slug: product.slug, name: product.name, qty: item.qty, unitPrice: product.price, lineTotal: product.price * item.qty, requiresAdvance: product.requiresAdvance,
      personalizationText: [item.personalizationText, item.sizes?.length ? `Sizes: ${item.sizes.join(" + ")}` : ""].filter(Boolean).join(" · ") || undefined };
  });
  const requiresAdvance = lines.some(line => line.requiresAdvance);
  const methods: PaymentMethod[] = isRazorpayConfigured() ? requiresAdvance ? ["advance_cod", "prepaid"] : ["cod", "prepaid"] : requiresAdvance ? [] : ["cod"];
  const totals = (method: PaymentMethod): OrderTotals => {
    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const discount = method === "prepaid" ? Math.min(site.prepaidDiscount, subtotal) : 0;
    const total = subtotal - discount;
    const advancePaid = method === "prepaid" ? total : method === "advance_cod" && requiresAdvance ? Math.min(site.advanceAmount, total) : 0;
    return { lineItems: lines, subtotal, discount, shipping: 0, total, advancePaid, codDue: total - advancePaid, requiresAdvance, currency: "INR" };
  };
  return { items, methods, totals: { cod: totals("cod"), prepaid: totals("prepaid"), advance_cod: totals("advance_cod") } };
}
