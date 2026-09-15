"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Wraps the home page's floating pill header: fixed to the top, but it
 * slides out of view on scroll-down and slides back in on the smallest
 * scroll-up — never permanently stuck, unlike the shop header's main bar.
 */
export default function HidingHeader({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      const diff = y - lastY;
      if (y <= 4) setHidden(false);
      else if (diff > 4) setHidden(true);
      else if (diff < -4) setHidden(false);
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 bg-transparent transition-transform duration-300 ease-out ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      {children}
    </header>
  );
}
