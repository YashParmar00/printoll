import { CheckoutError, MAX_QTY, type CheckoutLineInput } from "@/lib/checkout";

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export function garmentCount(product: { category: string; shape: string }) {
  return product.shape === "tote" ? 0 : ["couple-sets", "matching"].includes(product.category.toLowerCase()) ? 2 : 1;
}

export function validateItems(value: unknown): CheckoutLineInput[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 30) throw new CheckoutError("Your cart must contain between 1 and 30 items.");
  const keys = new Set<string>();
  return value.map(item => {
    if (!item || typeof item !== "object" || typeof item.slug !== "string" || !/^[a-z0-9-]{1,120}$/.test(item.slug)) throw new CheckoutError("Invalid product.");
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > MAX_QTY) throw new CheckoutError(`Quantity must be between 1 and ${MAX_QTY}.`);
    if (item.personalizationText !== undefined && (typeof item.personalizationText !== "string" || item.personalizationText.length > 24)) throw new CheckoutError("Print text must contain at most 24 characters.");
    if (item.personalizationPhotoName !== undefined && (typeof item.personalizationPhotoName !== "string" || item.personalizationPhotoName.length > 120)) throw new CheckoutError("Invalid photo reference.");
    if (item.sizes !== undefined && (!Array.isArray(item.sizes) || item.sizes.length > 2 || item.sizes.some((size: unknown) => typeof size !== "string" || !SIZES.includes(size as typeof SIZES[number])))) throw new CheckoutError("Please select valid garment sizes.");
    const line: CheckoutLineInput = { slug: item.slug, qty: item.qty, sizes: item.sizes ?? [], personalizationText: item.personalizationText?.trim(), personalizationPhotoName: item.personalizationPhotoName };
    const key = JSON.stringify([line.slug, line.sizes, line.personalizationText ?? "", line.personalizationPhotoName ?? ""]);
    if (keys.has(key)) throw new CheckoutError("Duplicate cart lines. Please combine their quantities.");
    keys.add(key);
    return line;
  });
}
