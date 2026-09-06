"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { whatsappLink, site } from "@/lib/site";
import { HomeIcon, BagIcon, CalendarHeartIcon, WhatsAppIcon } from "@/components/ui/icons";

/** Mobile bottom nav (RESEARCH.md §B3). Dark on home, cream elsewhere. */
export default function MobileBottomNav() {
  const dark = usePathname() === "/";
  const items = [
    { label: "Home", href: "/", Icon: HomeIcon, external: false },
    { label: "Sets", href: "/category", Icon: BagIcon, external: false },
    { label: "Occasions", href: "/#occasions", Icon: CalendarHeartIcon, external: false },
  ];

  return (
    <nav
      aria-label="Mobile"
      className={`fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur lg:hidden ${
        dark ? "border-night-line bg-night/95" : "border-line bg-paper/95"
      }`}
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {items.map(({ label, href, Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors hover:text-coral ${
                dark ? "text-night-ink" : "text-noir"
              }`}
            >
              <Icon className="h-6 w-6" />
              {label}
            </Link>
          </li>
        ))}
        <li>
          <a
            href={whatsappLink(`Hi ${site.name}, I have a question about a couple set.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-[#1ebe5a]"
          >
            <WhatsAppIcon className="h-6 w-6" />
            WhatsApp
          </a>
        </li>
      </ul>
    </nav>
  );
}
