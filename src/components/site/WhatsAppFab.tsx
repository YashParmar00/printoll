import { whatsappLink, site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * Floating WhatsApp button, site-wide (RESEARCH.md §B2). On mobile it sits
 * above the bottom nav; on desktop it drops to the corner.
 */
export default function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(`Hi ${site.name}, I'd like help picking a couple set.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 lg:bottom-6 lg:right-6"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-40 group-hover:opacity-0" />
      <WhatsAppIcon className="relative h-7 w-7" />
    </a>
  );
}
