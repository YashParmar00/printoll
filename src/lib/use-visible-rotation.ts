"use client";
import { useEffect, useRef } from "react";

export function useVisibleRotation(advance: () => void, milliseconds: number, enabled = true) {
  const ref = useRef<HTMLElement>(null);
  const callback = useRef(advance);
  useEffect(() => { callback.current = advance; }, [advance]);
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      clearInterval(timer);
      timer = undefined;
      if (visible && !document.hidden && !motion.matches) timer = setInterval(() => callback.current(), milliseconds);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    motion.addEventListener("change", update);
    return () => { clearInterval(timer); observer.disconnect(); document.removeEventListener("visibilitychange", update); motion.removeEventListener("change", update); };
  }, [milliseconds, enabled]);
  return ref;
}
