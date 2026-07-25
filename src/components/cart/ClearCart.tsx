"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** Empties the cart once the order is placed (mounted on the thank-you page). */
export default function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
