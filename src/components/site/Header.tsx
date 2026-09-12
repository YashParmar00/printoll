"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";
import CartBadge from "@/components/site/CartBadge";

const nav = [
  { label: "Shop", href: "/category" },
  { label: "How it works", href: "/#how" },
  { label: "Our story", href: "/about" },
  { label: "Track Order", href: "/track" },
];

/**
 * Two looks, one header. The home route runs the dark theme, so there the
 * header becomes a floating translucent pill over the hero; everywhere else
 * it's the warm cream bar that matches the shop.
 */
export default function Header() {
  const dark = usePathname() === "/";
  return dark ? <DarkHeader /> : <LightHeader />;
}

function DarkHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 bg-transparent">
      <div className="container-page pt-5">
        <div className="pill-nav flex h-16 items-center justify-between gap-4 pl-5 pr-3">
          <Logo tone="dark" />

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/category" className="btn-primary px-5 py-2.5 text-sm">
              Shop now
            </Link>
            <CartBadge tone="dark" />
          </div>
        </div>
      </div>
    </header>
  );
}

function LightHeader() {
  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      <div className="bg-jet text-white/75">
        <p className="container-page py-2 text-center text-xs font-medium tracking-wide sm:text-[13px]">
          Free shipping across India · COD available · ₹{site.prepaidDiscount} off on prepaid
        </p>
      </div>

      {/* Main bar */}
      <div className="border-b border-line bg-paper/95 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo tone="light" />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-noir transition-colors hover:text-coral"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <a
              href={whatsappLink(`Hi ${site.name}, I have a question about a printed item.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm font-medium text-noir transition-colors hover:border-[#25D366] hover:text-[#1ebe5a]"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              <span className="hidden sm:inline">Chat 10–8</span>
            </a>
            <CartBadge />
          </div>
        </div>
      </div>
    </header>
  );
}

function Logo({ tone }: { tone: "light" | "dark" }) {
  return (
    <Link
      href="/"
      className="text-2xl font-bold tracking-tight"
      aria-label={`${site.name} home`}
    >
      <span className={`font-display ${tone === "dark" ? "text-white" : "text-noir"}`}>Prin</span>
      <span className="font-display text-coral">toll</span>
    </Link>
  );
}
