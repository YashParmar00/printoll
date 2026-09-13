"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { MAX_QTY } from "@/lib/checkout";

export interface CartItem {
  key: string; slug: string; name: string; price: number; qty: number;
  sizes?: string[]; personalizationText?: string; personalizationPhotoName?: string;
}
const STORAGE_KEY = "pairwear_cart_v1";
const empty = { items: [] as CartItem[], hydrated: false };
let snapshot = empty;
const listeners = new Set<() => void>();

function readStored(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || raw.length > 50_000) return [];
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.slice(0, 30).flatMap(item => {
      if (!item || typeof item.slug !== "string" || !/^[a-z0-9-]{1,120}$/.test(item.slug) || typeof item.name !== "string" || item.name.length > 200 || !Number.isSafeInteger(item.price) || item.price < 0 || !Number.isInteger(item.qty) || item.qty < 1 || item.qty > MAX_QTY) return [];
      if (item.personalizationText !== undefined && (typeof item.personalizationText !== "string" || item.personalizationText.length > 120)) return [];
      if (item.sizes !== undefined && (!Array.isArray(item.sizes) || item.sizes.length > 2 || item.sizes.some((size: unknown) => typeof size !== "string" || !["XS", "S", "M", "L", "XL", "XXL"].includes(size)))) return [];
      // Migrate the old local cart format without truncating its print text.
      const legacy = item.personalizationText?.match(/(?:^| · )Sizes: (XS|S|M|L|XL|XXL) \+ (XS|S|M|L|XL|XXL)$/);
      const migrated = { ...item, sizes: item.sizes ?? (legacy ? [legacy[1], legacy[2]] : []), personalizationText: legacy ? item.personalizationText.slice(0, legacy.index) : item.personalizationText };
      return [{ ...migrated, key: itemKey(migrated) }];
    });
  } catch { return []; }
}
function itemKey(item: Omit<CartItem, "key" | "qty">) { return JSON.stringify([item.slug, item.sizes ?? [], item.personalizationText ?? "", item.personalizationPhotoName ?? ""]); }
function publish(items: CartItem[]) {
  snapshot = { items, hydrated: true };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* Cart remains usable in memory. */ }
  listeners.forEach(listener => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!snapshot.hydrated) { snapshot = { items: readStored(), hydrated: true }; performance.mark("cart-hydrated"); listeners.forEach(notify => notify()); }
  return () => { listeners.delete(listener); };
}
const actions = {
  addItem(item: Omit<CartItem, "key" | "qty">, qty = 1) {
    const key = itemKey(item);
    const existing = snapshot.items.find(line => line.key === key);
    const bounded = Math.min(MAX_QTY, Math.max(1, Math.floor(qty)));
    if (existing) publish(snapshot.items.map(line => line.key === key ? { ...line, qty: Math.min(MAX_QTY, line.qty + bounded) } : line));
    else if (snapshot.items.length < 30) publish([...snapshot.items, { ...item, key, qty: bounded }]);
  },
  removeItem(key: string) { publish(snapshot.items.filter(item => item.key !== key)); },
  updateQty(key: string, qty: number) { if (!Number.isFinite(qty)) return; publish(snapshot.items.flatMap(item => item.key !== key ? [item] : qty <= 0 ? [] : [{ ...item, qty: Math.min(MAX_QTY, Math.floor(qty)) }])); },
  clear() { publish([]); },
  clearSubmitted(orderNumber: string) {
    try {
      const key = `submitted_${orderNumber}`;
      const raw = sessionStorage.getItem(key);
      if (!raw) return;
      const submitted: Array<{ key: string; qty: number }> = JSON.parse(raw);
      if (!Array.isArray(submitted)) return;
      sessionStorage.removeItem(key);
      publish(snapshot.items.flatMap(item => {
        const line = submitted.find(line => line.key === item.key && Number.isInteger(line.qty) && line.qty > 0);
        const qty = item.qty - (line?.qty ?? 0);
        return qty > 0 ? [{ ...item, qty }] : [];
      }));
    } catch { /* Without a submitted snapshot, keep the cart. */ }
  },
};
type CartContextValue = typeof actions & { items: CartItem[]; hydrated: boolean; count: number; subtotal: number };
const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, () => snapshot, () => empty);
  const value = useMemo(() => ({ ...state, ...actions, count: state.items.reduce((sum, item) => sum + item.qty, 0), subtotal: state.items.reduce((sum, item) => sum + item.price * item.qty, 0) }), [state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
