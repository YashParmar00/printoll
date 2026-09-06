"use server";

import { revalidatePath } from "next/cache";
import { isAdminSession } from "@/lib/admin-auth";
import { updateOrder, type OrderStatus } from "@/lib/orders";
import { saveCatalogProduct } from "@/lib/catalog";

// Statuses a founder can set by hand from the admin table.
const MANUAL_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

async function requireAdmin() {
  if (!await isAdminSession()) throw new Error("Unauthorized");
}

export async function updateStatusAction(formData: FormData) {
  await requireAdmin();
  const orderNumber = String(formData.get("orderNumber") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  if (orderNumber && MANUAL_STATUSES.includes(status)) {
    await updateOrder(orderNumber, { status });
    revalidatePath("/admin");
  }
}

const lines = (value: FormDataEntryValue | null) => String(value ?? "").split(/\r?\n/).map((v) => v.trim()).filter(Boolean);
const text = (formData: FormData, key: string, max = 4000) => String(formData.get(key) ?? "").trim().slice(0, max);
const integer = (formData: FormData, key: string, fallback = 0) => {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : fallback;
};

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const slug = text(formData, "slug", 90).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, "");
  const personalization = text(formData, "personalization");
  const shape = text(formData, "shape");
  const category = text(formData, "category");
  if (!slug || !text(formData, "name", 160) || !category || !["none", "text", "photo", "both"].includes(personalization) || !["tee", "hoodie", "tote"].includes(shape)) {
    throw new Error("Please fill all required product details.");
  }
  const faqLines = lines(formData.get("faqs"));
  const faqs = faqLines.flatMap((line) => {
    const [q, ...answer] = line.split("|");
    return q?.trim() && answer.join("|").trim() ? [{ q: q.trim(), a: answer.join("|").trim() }] : [];
  });
  await saveCatalogProduct({
    slug, name: text(formData, "name", 160), tagline: text(formData, "tagline", 240),
    price: integer(formData, "price"), compareAtPrice: integer(formData, "compareAtPrice"),
    category, personalization: personalization as "none" | "text" | "photo" | "both", shape: shape as "tee" | "hoodie" | "tote",
    supplierSku: text(formData, "supplierSku", 120), requiresAdvance: formData.get("requiresAdvance") === "on",
    occasions: lines(formData.get("occasions")), rating: Math.min(5, Number(formData.get("rating")) || 0), reviews: integer(formData, "reviews"),
    description: lines(formData.get("description")), highlights: lines(formData.get("highlights")), faqs,
    accent: [text(formData, "accentStart", 20) || "#5b2a5e", text(formData, "accentEnd", 20) || "#d4a947"],
    badge: text(formData, "badge", 60) || undefined,
    imageUrls: formData.getAll("imageUrls").map((value) => String(value).trim()).filter(Boolean).slice(0, 5),
    active: formData.get("active") === "on", sortOrder: integer(formData, "sortOrder"),
  });
  revalidatePath("/"); revalidatePath("/category"); revalidatePath(`/product/${slug}`); revalidatePath("/sitemap.xml"); revalidatePath("/admin/products");
}
