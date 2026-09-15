"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { setAnnouncementHeight, useAnnouncementState } from "@/components/site/announcement-state";

/**
 * Wraps the light (shop) header: the announcement strip collapses away on
 * scroll-down and slides back on the smallest scroll-up, while the main bar
 * stays pinned to the top. Visibility + height come from the shared
 * announcement-state store, so any other sticky element on the page (e.g.
 * the shop filter bar) can animate in lockstep from the same values.
 */
export default function StickyHeader({ announcement, main }: { announcement: ReactNode; main: ReactNode }) {
  const { visible, height } = useAnnouncementState();
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const measure = () => setAnnouncementHeight(el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <div
        style={{ maxHeight: visible ? height || undefined : 0 }}
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
      >
        <div ref={measureRef}>{announcement}</div>
      </div>
      {main}
    </header>
  );
}
