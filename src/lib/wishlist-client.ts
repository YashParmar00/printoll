"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Shared client-side wishlist state (module-level store, same shape as
 * announcement-state.ts) so every WishlistButton on a page — 12+ product
 * cards — reads one cached fetch instead of each firing its own request.
 */
type State = { loaded: boolean; loggedIn: boolean; slugs: Set<string> };
let state: State = { loaded: false, loggedIn: false, slugs: new Set() };
const listeners = new Set<() => void>();
const serverSnapshot: State = { loaded: false, loggedIn: false, slugs: new Set() };

function emit() {
  listeners.forEach((listener) => listener());
}

let loadStarted = false;
async function ensureLoaded() {
  if (loadStarted) return;
  loadStarted = true;
  try {
    const response = await fetch("/api/account/wishlist");
    const data = response.ok ? await response.json() : { loggedIn: false, slugs: [] };
    state = { loaded: true, loggedIn: !!data.loggedIn, slugs: new Set(data.slugs ?? []) };
  } catch {
    state = { ...state, loaded: true };
  }
  emit();
}

export async function toggleWishlist(slug: string): Promise<"toggled" | "login-required"> {
  await ensureLoaded();
  if (!state.loggedIn) return "login-required";

  const optimistic = new Set(state.slugs);
  if (optimistic.has(slug)) optimistic.delete(slug); else optimistic.add(slug);
  state = { ...state, slugs: optimistic };
  emit();

  try {
    const response = await fetch("/api/account/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
    if (response.ok) {
      const data = await response.json();
      const reconciled = new Set(state.slugs);
      if (data.wishlisted) reconciled.add(slug); else reconciled.delete(slug);
      state = { ...state, slugs: reconciled };
      emit();
    }
  } catch { /* optimistic state stands; next load reconciles */ }
  return "toggled";
}

export function useWishlistState() {
  useEffect(() => { void ensureLoaded(); }, []);
  return useSyncExternalStore(
    (callback) => { listeners.add(callback); return () => listeners.delete(callback); },
    () => state,
    () => serverSnapshot,
  );
}
