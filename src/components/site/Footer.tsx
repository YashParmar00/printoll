"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, whatsappLink } from "@/lib/site";
import { InstagramIcon, RupeeIcon, ShieldIcon, WhatsAppIcon } from "@/components/ui/icons";

const shopLinks = [
  { label: "Shop All Prints", href: "/category" },
  { label: "Browse Collections", href: "/#collections" },
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

const socialLinks = [
  { label: "WhatsApp", href: whatsappLink("Hi Printoll, I need help with an order."), Icon: WhatsAppIcon },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
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
      <div className="container-page grid grid-cols-2 items-start gap-x-5 gap-y-8 py-10 text-left sm:gap-x-8 sm:gap-y-10 sm:py-12 lg:grid-cols-4 lg:gap-10 lg:py-14">
        {/* Brand + trust block (RESEARCH.md §B8) */}
        <div className="col-span-2 text-center lg:hidden">
          <div className="text-2xl font-bold">
            <span className={`font-display ${heading}`}>Prin</span>
            <span className="font-display text-coral">toll</span>
          </div>
          <p className={`mx-auto mt-3 max-w-xs text-sm leading-relaxed ${muted}`}>
            Custom printed tees and gifts, made for every story and delivered across India.
          </p>
        </div>

        <div className="col-span-2 grid grid-cols-2 items-start gap-x-5 sm:gap-x-8 lg:hidden">
          <div className="space-y-8">
            <nav aria-label="Footer policies">
              <h4 className={`text-sm font-semibold uppercase tracking-wider ${heading}`}>Policies</h4>
              <ul className="mt-4 space-y-2.5">
                {policyLinks.map((l) => (
                  <li key={l.href}><Link href={l.href} className={`text-sm ${link}`}>{l.label}</Link></li>
                ))}
              </ul>
            </nav>
            <div className={`space-y-1.5 text-sm ${dark ? "text-white/85" : "text-noir"}`}>
              <p><a href={`mailto:${site.email}`} className="hover:text-coral">{site.email}</a></p>
              <p>{site.phoneDisplay}</p>
              <p className={muted}>{site.addressLine}</p>
              <p className={muted}>We reply within 2 hours, {site.supportHours}</p>
            </div>
          </div>

          <div className="space-y-8">
            <nav aria-label="Footer shop">
              <h4 className={`text-sm font-semibold uppercase tracking-wider ${heading}`}>Shop</h4>
              <ul className="mt-4 space-y-2.5">
                {shopLinks.map((l) => (
                  <li key={l.href}><Link href={l.href} className={`text-sm ${link}`}>{l.label}</Link></li>
                ))}
              </ul>
            </nav>
            <div>
              <h4 className={`text-sm font-semibold uppercase tracking-wider ${heading}`}>Need help?</h4>
              <p className={`mt-4 text-sm ${muted}`}>Chat with a real person, {site.supportHours}.</p>
            </div>
          </div>
        </div>

        <div className="hidden min-w-0 lg:block">
          <div className="hidden text-2xl font-bold lg:block">
            <span className={`font-display ${heading}`}>Prin</span>
            <span className="font-display text-coral">toll</span>
          </div>
          <p className={`hidden max-w-xs text-sm leading-relaxed lg:mt-3 lg:block ${muted}`}>
            Custom printed tees and gifts, made for every story and delivered across India.
          </p>
          <div className={`space-y-1.5 text-sm lg:mt-5 ${dark ? "text-white/85" : "text-noir"}`}>
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
        <nav aria-label="Footer shop" className="hidden min-w-0 lg:block">
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
        <nav aria-label="Footer policies" className="hidden min-w-0 lg:block">
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
        <div className="hidden min-w-0 lg:block">
          <h4 className={`text-sm font-semibold uppercase tracking-wider ${heading}`}>Need help?</h4>
          <p className={`mt-4 text-sm ${muted}`}>Chat with a real person, {site.supportHours}.</p>
        </div>
      </div>

      <div className="container-page pb-5 text-center">
        <p className={`text-xs font-semibold uppercase tracking-wider ${heading}`}>Follow us</p>
        <div className="mx-auto mt-3 grid max-w-[230px] grid-cols-2 items-center justify-items-center gap-x-5">
          {socialLinks.map(({ label, href, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 text-sm font-medium ${link}`}>
              <Icon className="h-4 w-4 text-coral" />
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className={`container-page mx-auto grid max-w-[380px] grid-cols-2 items-center justify-items-center gap-x-3 pb-8 text-center text-[11px] font-medium sm:text-xs ${muted}`}>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <ShieldIcon className="h-4 w-4 text-coral" /> Secure payments via Razorpay
        </span>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <RupeeIcon className="h-4 w-4 text-coral" /> Cash on Delivery
        </span>
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
