"use client";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";

export default function ClearCart({ orderNumber }: { orderNumber: string }) {
  const { hydrated, clearSubmitted } = useCart();
  useEffect(() => { if (hydrated) clearSubmitted(orderNumber); }, [hydrated, clearSubmitted, orderNumber]);
  return null;
}
