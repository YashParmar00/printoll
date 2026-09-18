import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import HeroShowcase from "@/components/home/HeroShowcase";
import { HeartIcon, ArrowRightIcon, WhatsAppIcon } from "@/components/ui/icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-night">
      {/* coral bloom behind the headline */}
      <div aria-hidden className="glow pointer-events-none absolute inset-0" />

      {/* pt clears the floating pill header (fixed, hides on scroll-down / reappears on scroll-up) so the heading never sits under it */}
      <div className="container-page relative pb-8 pt-24 text-center sm:pb-20 sm:pt-32 md:pb-24 md:pt-36">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-coral backdrop-blur sm:px-3.5 sm:py-1.5 sm:text-[11px]">
          <HeartIcon className="h-3.5 w-3.5" />
          Prints for every story
        </span>

        <h1 className="mx-auto mt-2.5 max-w-4xl text-[38px] leading-[1.05] text-white sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl">
          Printed for <span className="text-coral-light">your story</span>
        </h1>

        <p className="mx-auto mt-2.5 max-w-xl text-[13px] leading-relaxed text-night-ink sm:mt-4 sm:text-base md:text-lg">
          Custom tees, matching styles and thoughtful gifts. Made for every kind of connection,
          delivered across India.
        </p>

        {/* Kept smaller on mobile so the hero doesn't push products below the fold */}
        <div className="mx-auto max-w-70 sm:max-w-none">
          <HeroShowcase />
        </div>

        <div className="mt-5 grid grid-cols-2 items-stretch gap-2.5 sm:mt-10 sm:flex sm:justify-center sm:gap-3">
          <Link href="/category" className="btn-primary w-full whitespace-nowrap px-2.5 py-2.5 text-[11px] sm:w-auto sm:px-6 sm:py-3 sm:text-base">
            Shop prints
            <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
          <a
            href={whatsappLink(`Hi ${site.name}, I'd like help picking a printed item.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-white/15 bg-white/[0.06] px-2.5 py-2.5 text-[11px] font-semibold text-white backdrop-blur transition hover:bg-white/[0.12] sm:w-auto sm:gap-2 sm:px-6 sm:py-3 sm:text-base"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366] sm:h-5 sm:w-5" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
