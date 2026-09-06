"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { BagIcon } from "@/components/ui/icons";

/** Header cart link with a live item count. Dark tone is used on the home hero. */
export default function CartBadge({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { count, hydrated } = useCart();
  return (
    <Link
      href="/cart"
      aria-label={`Cart${hydrated && count > 0 ? `, ${count} item${count > 1 ? "s" : ""}` : ""}`}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
        tone === "dark"
          ? "bg-white/10 text-white hover:bg-white/20"
          : "bg-blush text-noir hover:bg-coral hover:text-white"
      }`}
    >
      <BagIcon className="h-6 w-6" />
      {hydrated && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
