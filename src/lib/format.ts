/** Formatting + pricing helpers. Prices are whole rupees (integers). */

/** ₹1,299 with Indian digit grouping. */
export function inr(rupees: number): string {
  return `₹${rupees.toLocaleString("en-IN")}`;
}

/** Whole-number discount percentage off the anchor (compareAt) price. */
export function savingsPct(price: number, compareAtPrice: number): number {
  if (compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/**
 * Delivery-date promise, e.g. "Fri, 25 Jul". Computed as today + N days.
 * Rendered on the client where "today" is the customer's date.
 */
export function deliveryBy(daysFromNow: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
