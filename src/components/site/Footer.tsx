import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { RupeeIcon, ShieldIcon, WhatsAppIcon } from "@/components/ui/icons";

const shopLinks = [
  { label: "All Gifts", href: "/category" },
  { label: "Shop by Occasion", href: "/#occasions" },
  { label: "Track Order", href: "/track" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const policyLinks = [
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Return & Refund Policy", href: "/return-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-cream">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand + trust block (RESEARCH.md §B8) */}
        <div>
          <div className="text-2xl font-semibold">
            <span className="font-[family-name:var(--font-heading)] text-plum">Auraa</span>
            <span className="font-[family-name:var(--font-heading)] text-gold-dark">Marts</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink">
            Personalized gifts, thoughtfully made in India and delivered to your door.
          </p>
          <div className="mt-5 space-y-1.5 text-sm text-charcoal">
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-plum">
                {site.email}
              </a>
            </p>
            <p>{site.phoneDisplay}</p>
            <p className="text-ink">{site.addressLine}</p>
            <p className="text-ink">We reply within 2 hours, {site.supportHours}</p>
          </div>
        </div>

        {/* Shop */}
        <nav aria-label="Footer shop">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-charcoal">Shop</h4>
          <ul className="mt-4 space-y-2.5">
            {shopLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ink transition-colors hover:text-plum">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Policies */}
        <nav aria-label="Footer policies">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-charcoal">Policies</h4>
          <ul className="mt-4 space-y-2.5">
            {policyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ink transition-colors hover:text-plum">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact / WhatsApp */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-charcoal">Need help?</h4>
          <p className="mt-4 text-sm text-ink">Chat with a real person, {site.supportHours}.</p>
          <a
            href={whatsappLink(`Hi ${site.name}, I need help with an order.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5a]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Chat on WhatsApp
          </a>
          <div className="mt-5 flex flex-wrap gap-3 text-xs font-medium text-ink">
            <span className="inline-flex items-center gap-1.5">
              <ShieldIcon className="h-4 w-4 text-plum" /> Secure payments via Razorpay
            </span>
            <span className="inline-flex items-center gap-1.5">
              <RupeeIcon className="h-4 w-4 text-plum" /> Cash on Delivery
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="container-page py-5 text-center text-xs text-ink">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved. · Made with care in India.
        </p>
      </div>
    </footer>
  );
}
