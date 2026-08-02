"use server";

import { revalidatePath } from "next/cache";
import { updateOrder, type OrderStatus } from "@/lib/orders";

// Statuses a founder can set by hand from the admin table.
const MANUAL_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export async function updateStatusAction(formData: FormData) {
  const orderNumber = String(formData.get("orderNumber") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  if (orderNumber && MANUAL_STATUSES.includes(status)) {
    updateOrder(orderNumber, { status });
    revalidatePath("/admin");
  }
}
