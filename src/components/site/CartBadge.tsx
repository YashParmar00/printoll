"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { BagIcon } from "@/components/ui/icons";

/** Header cart link with a live item count. /cart page arrives in M4. */
export default function CartBadge() {
  const { count, hydrated } = useCart();
  return (
    <Link
      href="/cart"
      aria-label={`Cart${hydrated && count > 0 ? `, ${count} item${count > 1 ? "s" : ""}` : ""}`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-cream hover:text-plum"
    >
      <BagIcon className="h-6 w-6" />
      {hydrated && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-charcoal">
          {count}
        </span>
      )}
    </Link>
  );
}
