"use client";
import { useReportWebVitals } from "next/web-vitals";

function report(metric: { name: string; value: number; id: string }) {
  if (process.env.NEXT_PUBLIC_PERF_TELEMETRY !== "true" || navigator.doNotTrack === "1") return;
  const path = location.pathname;
  const route = path === "/" ? "home" : path.startsWith("/product/") ? "product" : ["/category", "/cart", "/checkout"].includes(path) ? path.slice(1) : null;
  if (!route) return;
  // Only metric name, numeric value and route class leave the browser.
  // No URL/query, order ID, customer input, DOM content or persistent user ID.
  navigator.sendBeacon("/api/metrics", JSON.stringify({ name: metric.name, value: metric.value, route }));
}
export default function PerformanceVitals() { useReportWebVitals(report); return null; }
