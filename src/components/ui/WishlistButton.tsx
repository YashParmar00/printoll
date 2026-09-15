"use client";

import { useRouter, usePathname } from "next/navigation";
import { HeartIcon } from "@/components/ui/icons";
import { toggleWishlist, useWishlistState } from "@/lib/wishlist-client";

/** Heart toggle used on product cards and the product page. Logged-out taps go to login, then back here. */
export default function WishlistButton({ slug, className = "" }: { slug: string; className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { slugs, loaded } = useWishlistState();
  const active = loaded && slugs.has(slug);

  async function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const result = await toggleWishlist(slug);
    if (result === "login-required") router.push(`/account/login?next=${encodeURIComponent(pathname)}`);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-night/60 backdrop-blur transition hover:bg-night/80 ${className}`}
    >
      {active ? <HeartIcon className="h-5 w-5 text-coral" /> : <HeartIcon className="h-5 w-5 text-white" fill="none" stroke="currentColor" />}
    </button>
  );
}
