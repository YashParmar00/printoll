"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserIcon } from "@/components/ui/icons";

/**
 * Header account link. Fetches sign-in state client-side (rather than reading
 * the session cookie in the shared server Header) so unrelated static pages
 * — FAQ, policies — don't get forced into dynamic rendering just for this.
 */
export default function AccountBadge({ tone = "light" }: { tone?: "light" | "dark" }) {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/account/me")
      .then((response) => (response.ok ? response.json() : { loggedIn: false }))
      .then((data) => { if (!cancelled) setLoggedIn(!!data.loggedIn); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <Link
      href={loggedIn ? "/account" : `/account/login?next=${encodeURIComponent(pathname)}`}
      aria-label={loggedIn ? "Your account" : "Sign in"}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
        tone === "dark" ? "bg-white/10 text-white hover:bg-white/20" : "bg-blush text-noir hover:bg-coral hover:text-white"
      }`}
    >
      <UserIcon className="h-4.5 w-4.5" />
    </Link>
  );
}
