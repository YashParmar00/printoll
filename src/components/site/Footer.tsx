"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, whatsappLink } from "@/lib/site";
import { RupeeIcon, ShieldIcon, WhatsAppIcon } from "@/components/ui/icons";

const shopLinks = [
  { label: "All Couple Sets", href: "/category" },
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

/** Matches the header: dark on the home route, warm cream everywhere else. */
export default function Footer() {
  const dark = usePathname() === "/";

  const shell = dark ? "border-night-line bg-night-soft" : "border-line bg-sand";
  const heading = dark ? "text-white" : "text-noir";
  const muted = dark ? "text-night-ink" : "text-ink";
  const link = dark
    ? "text-night-ink transition-colors hover:text-coral"
    : "text-ink transition-colors hover:text-coral";

  return (
    <footer className={`border-t ${shell}`}>
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand + trust block (RESEARCH.md §B8) */}
        <div>
          <div className="text-2xl font-bold">
            <span className={`font-display ${heading}`}>Pair</span>
            <span className="font-display text-coral">wear</span>
          </div>
          <p className={`mt-3 max-w-xs text-sm leading-relaxed ${muted}`}>
            Matching couple tees, printed with your names in India and delivered to your door.
          </p>
          <div className={`mt-5 space-y-1.5 text-sm ${dark ? "text-white/85" : "text-noir"}`}>
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-coral">
                {site.email}
              </a>
            </p>
            <p>{site.phoneDisplay}</p>
            <p className={muted}>{site.addressLine}</p>
            <p className={muted}>We reply within 2 hours, {site.supportHours}</p>
          </div>
        </div>

        {/* Shop */}
        <nav aria-label="Footer shop">
          <h4 className={`text-sm font-semibold uppercase tracking-wider ${heading}`}>Shop</h4>
          <ul className="mt-4 space-y-2.5">
            {shopLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`text-sm ${link}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Policies */}
        <nav aria-label="Footer policies">
          <h4 className={`text-sm font-semibold uppercase tracking-wider ${heading}`}>Policies</h4>
          <ul className="mt-4 space-y-2.5">
            {policyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`text-sm ${link}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact / WhatsApp */}
        <div>
          <h4 className={`text-sm font-semibold uppercase tracking-wider ${heading}`}>Need help?</h4>
          <p className={`mt-4 text-sm ${muted}`}>Chat with a real person, {site.supportHours}.</p>
          <a
            href={whatsappLink(`Hi ${site.name}, I need help with an order.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5a]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Chat on WhatsApp
          </a>
          <div className={`mt-5 flex flex-wrap gap-3 text-xs font-medium ${muted}`}>
            <span className="inline-flex items-center gap-1.5">
              <ShieldIcon className="h-4 w-4 text-coral" /> Secure payments via Razorpay
            </span>
            <span className="inline-flex items-center gap-1.5">
              <RupeeIcon className="h-4 w-4 text-coral" /> Cash on Delivery
            </span>
          </div>
        </div>
      </div>

      <div className={`border-t ${dark ? "border-night-line" : "border-line"}`}>
        <p className={`container-page py-5 text-center text-xs ${muted}`}>
          © {new Date().getFullYear()} {site.legalName}. All rights reserved. · Printed with care in
          India.
        </p>
      </div>
    </footer>
  );
}
