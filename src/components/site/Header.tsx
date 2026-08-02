import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";
import CartBadge from "@/components/site/CartBadge";

const nav = [
  { label: "Shop", href: "/category" },
  { label: "Occasions", href: "/#occasions" },
  { label: "About", href: "/about" },
  { label: "Track Order", href: "/track" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      <div className="bg-plum text-cream">
        <p className="container-page py-2 text-center text-xs font-medium tracking-wide sm:text-[13px]">
          Free shipping on all orders · COD available · ₹{site.prepaidDiscount} off on prepaid
        </p>
      </div>

      {/* Main bar */}
      <div className="border-b border-line bg-white/95 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-semibold tracking-tight" aria-label={`${site.name} home`}>
            <span className="font-heading text-plum">Auraa</span>
            <span className="font-heading text-gold-dark">Marts</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-charcoal transition-colors hover:text-plum"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <a
              href={whatsappLink(`Hi ${site.name}, I have a question about a gift.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm font-medium text-charcoal transition-colors hover:border-[#25D366] hover:text-[#1ebe5a]"
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
