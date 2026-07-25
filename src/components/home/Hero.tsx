import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import TrustBadges from "@/components/site/TrustBadges";
import { WhatsAppIcon, ArrowRightIcon, SparkleIcon, TruckIcon } from "@/components/ui/icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream to-white">
      {/* soft decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-plum/10 blur-3xl"
      />
      <div className="container-page relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-8 lg:py-20">
        {/* Copy */}
        <div>
          <p className="eyebrow">Personalized Gifts · Made in India</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-[3.25rem]">
            Gifts They&apos;ll Never Forget — Personalized in India
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink">
            Engrave a name, add a photo, and turn an everyday gift into a memory. Thoughtfully made
            and delivered to their door in 5–7 days — Cash on Delivery available across India.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/#featured" className="btn-primary">
              Shop Personalized Gifts
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <a
              href={whatsappLink(`Hi ${site.name}, I'd like help choosing a gift.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              Chat on WhatsApp
            </a>
          </div>

          <TrustBadges className="mt-9" />
        </div>

        {/* Visual (placeholder illustration — swap for lifestyle photo in M6) */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gradient-to-br from-plum via-plum-light to-gold shadow-xl">
            <GiftIllustration />
            <span className="absolute bottom-4 left-0 right-0 text-center text-xs font-medium uppercase tracking-[0.3em] text-white/70">
              AuraaMarts
            </span>
          </div>

          {/* Floating chips */}
          <div className="absolute -left-3 top-6 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg sm:-left-6">
            <SparkleIcon className="h-5 w-5 text-gold-dark" />
            <span className="text-sm font-semibold text-charcoal">Personalized just for you</span>
          </div>
          <div className="absolute -right-2 bottom-8 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg sm:-right-5">
            <TruckIcon className="h-5 w-5 text-plum" />
            <span className="text-sm font-semibold text-charcoal">Delivered in 5–7 days</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Inline wrapped-gift illustration — self-contained, no external image. */
function GiftIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="absolute inset-0 h-full w-full p-10"
      fill="none"
      aria-hidden
    >
      <circle cx="100" cy="100" r="78" fill="rgba(255,255,255,0.08)" />
      <circle cx="100" cy="100" r="58" fill="rgba(255,255,255,0.10)" />
      {/* box */}
      <rect x="60" y="96" width="80" height="56" rx="4" fill="#faf6ef" />
      <rect x="60" y="96" width="80" height="16" rx="4" fill="#f1e8d8" />
      <rect x="94" y="96" width="12" height="56" fill="#d4a947" />
      {/* lid */}
      <rect x="54" y="84" width="92" height="18" rx="4" fill="#ffffff" />
      <rect x="94" y="84" width="12" height="18" fill="#d4a947" />
      {/* bow */}
      <path
        d="M100 84c-6-14-26-16-26-4 0 8 14 8 26 4Zm0 0c6-14 26-16 26-4 0 8-14 8-26 4Z"
        fill="#d4a947"
      />
      <circle cx="100" cy="82" r="5" fill="#b28623" />
    </svg>
  );
}
