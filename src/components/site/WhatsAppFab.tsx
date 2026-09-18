import { whatsappLink, site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * Floating WhatsApp contact button, positioned in the page corner.
 */
export default function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(`Hi ${site.name}, I'd like help picking a printed item.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 lg:bottom-6 lg:right-6 lg:h-14 lg:w-14"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-40 group-hover:opacity-0" />
      <WhatsAppIcon className="relative h-5 w-5 lg:h-7 lg:w-7" />
    </a>
  );
}
