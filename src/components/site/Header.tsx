import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";
import CartBadge from "@/components/site/CartBadge";
import AccountBadge from "@/components/site/AccountBadge";
import HidingHeader from "@/components/site/HidingHeader";

const nav = [
  { label: "Shop", href: "/category" },
  { label: "How it works", href: "/#how" },
  { label: "Our story", href: "/about" },
  { label: "Track Order", href: "/track" },
];

/**
 * Two looks, one header. The home route runs the dark theme, so there the
 * header becomes a floating translucent pill over the hero; everywhere else
 * it's the warm cream bar that matches the shop. Both are rendered; globals.css
 * shows the right one from the page's [data-home-theme] marker.
 */
export default function Header() {
  return <><DarkHeader /><div className="site-header-spacer" aria-hidden="true" /></>;
}

function DarkHeader() {
  return (
    <HidingHeader>
      <div className="container-page pt-3">
        <div className="pill-nav flex h-12 items-center justify-between gap-4 pl-5 pr-2.5">
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

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link href="/category" className="btn-primary px-3.5 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm">
              Shop now
            </Link>
            <AccountBadge tone="dark" />
            <CartBadge tone="dark" />
          </div>
        </div>
      </div>
    </HidingHeader>
  );
}

function LightHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-page flex h-14 items-center justify-between gap-4 sm:h-16">
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
          <AccountBadge />
          <CartBadge />
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
