import Link from "next/link";
import { whatsappLink, site } from "@/lib/site";
import { HomeIcon, BagIcon, CalendarHeartIcon, WhatsAppIcon } from "@/components/ui/icons";

/** Oye-Happy-style mobile bottom nav (RESEARCH.md §B3). Hidden on desktop. */
export default function MobileBottomNav() {
  const items = [
    { label: "Home", href: "/", Icon: HomeIcon, external: false },
    { label: "Shop", href: "/category", Icon: BagIcon, external: false },
    { label: "Occasions", href: "/#occasions", Icon: CalendarHeartIcon, external: false },
  ];

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {items.map(({ label, href, Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-charcoal transition-colors hover:text-plum"
            >
              <Icon className="h-6 w-6" />
              {label}
            </Link>
          </li>
        ))}
        <li>
          <a
            href={whatsappLink(`Hi ${site.name}, I have a question about a gift.`)}
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
