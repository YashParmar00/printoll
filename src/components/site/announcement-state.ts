"use client";

import { useSyncExternalStore } from "react";

/**
 * Single source of truth for the collapsible announcement strip: whether it's
 * showing (hidden on scroll-down, revealed on the smallest scroll-up) and its
 * natural height (measured once from the real DOM node, not from an
 * animating box). Both the sticky header and the shop filter bar read this
 * same store so their CSS transitions start from the same React commit and
 * stay in lockstep — no ResizeObserver-on-an-animating-element lag.
 */
type State = { visible: boolean; height: number };
let state: State = { visible: true, height: 0 };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function setAnnouncementHeight(height: number) {
  if (state.height !== height) {
    state = { ...state, height };
    emit();
  }
}

function setVisible(visible: boolean) {
  if (state.visible !== visible) {
    state = { ...state, visible };
    emit();
  }
}

let scrollBound = false;
function bindScroll() {
  if (scrollBound || typeof window === "undefined") return;
  scrollBound = true;
  let lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      const diff = y - lastY;
      if (y <= 4) setVisible(true);
      else if (diff > 4) setVisible(false);
      else if (diff < -4) setVisible(true);
      lastY = y;
    },
    { passive: true },
  );
}

const serverSnapshot: State = { visible: true, height: 0 };

export function useAnnouncementState() {
  bindScroll();
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => state,
    () => serverSnapshot,
  );
}
