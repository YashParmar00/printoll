/**
 * Checkout math + validation — the SERVER's source of truth.
 *
 * `computeTotals` recomputes every price from the catalogue and IGNORES any
 * price the client sends. The client may import it for a live preview, but the
 * API re-runs it on submit so a tampered cart total can never be trusted.
 */
import { getProduct } from "@/lib/products";
import { site } from "@/lib/site";

export type PaymentMethod = "cod" | "prepaid";

export interface CheckoutLineInput {
  slug: string;
  qty: number;
  personalizationText?: string;
  personalizationPhotoName?: string;
}

export interface OrderLine {
  slug: string;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  personalizationText?: string;
  personalizationPhotoName?: string;
}

export interface OrderTotals {
  lineItems: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: "INR";
}

export class CheckoutError extends Error {}

const MAX_QTY = 10;

export function clampQty(n: unknown): number {
  const q = Math.floor(Number(n));
  if (!Number.isFinite(q) || q < 1) return 1;
  return Math.min(MAX_QTY, q);
}

/** Authoritative totals. Prices come from the catalogue, never the client. */
export function computeTotals(items: CheckoutLineInput[], paymentMethod: PaymentMethod): OrderTotals {
  if (!Array.isArray(items) || items.length === 0) {
    throw new CheckoutError("Your cart is empty.");
  }

  const lineItems: OrderLine[] = items.map((it) => {
    const product = getProduct(it.slug);
    if (!product) throw new CheckoutError(`This item is no longer available: ${it.slug}`);
    const qty = clampQty(it.qty);
    return {
      slug: product.slug,
      name: product.name,
      qty,
      unitPrice: product.price, // authoritative
      lineTotal: product.price * qty,
      personalizationText: it.personalizationText?.slice(0, 40),
      personalizationPhotoName: it.personalizationPhotoName?.slice(0, 120),
    };
  });

  const subtotal = lineItems.reduce((s, li) => s + li.lineTotal, 0);
  const shipping = 0; // free shipping baked into price (RESEARCH §B10)
  const discount = paymentMethod === "prepaid" ? Math.min(site.prepaidDiscount, subtotal) : 0;
  const total = subtotal - discount + shipping;

  return { lineItems, subtotal, discount, shipping, total, currency: "INR" };
}

// ---- Customer validation ----------------------------------------------------

export interface CustomerInput {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export function validatePhone(v: string): boolean {
  return /^[6-9]\d{9}$/.test((v ?? "").trim());
}

export function validatePincode(v: string): boolean {
  return /^\d{6}$/.test((v ?? "").trim());
}

/** Returns an error message, or null if the customer is valid. */
export function validateCustomer(c: Partial<CustomerInput> | undefined): string | null {
  if (!c) return "Missing delivery details.";
  if (!c.name || c.name.trim().length < 2) return "Please enter your full name.";
  if (!validatePhone(c.phone ?? "")) return "Enter a valid 10-digit mobile number.";
  if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) return "Enter a valid email, or leave it blank.";
  if (!c.address || c.address.trim().length < 8) return "Please enter your full address.";
  if (!c.city || c.city.trim().length < 2) return "Please enter your city.";
  if (!c.state || c.state.trim().length < 2) return "Please enter your state.";
  if (!validatePincode(c.pincode ?? "")) return "Enter a valid 6-digit pincode.";
  return null;
}
