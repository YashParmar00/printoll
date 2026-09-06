import Link from "next/link";
import Image from "next/image";
import { site, whatsappLink } from "@/lib/site";
import { listCatalogProducts } from "@/lib/catalog";
import HeroTeeAnimation from "@/components/home/HeroTeeAnimation";
import {
  HeartIcon,
  RupeeIcon,
  TruckIcon,
  ShieldIcon,
  ArrowRightIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";

/**
 * Decorative avatar stack. Deliberately unlabelled — no initials, because we
 * don't have real customers to attribute them to yet.
 */
const avatars = [
  { id: "a", accent: ["#d2603f", "#f0b49b"] },
  { id: "b", accent: ["#3d3a38", "#6f645c"] },
  { id: "c", accent: ["#b0472a", "#d2603f"] },
];

const promises = [
  { Icon: RupeeIcon, label: "₹99 now, rest on delivery" },
  { Icon: TruckIcon, label: "Delivered in 5–7 days" },
  { Icon: ShieldIcon, label: "7-day damage replacement" },
];

export default async function Hero() {
  // First set doubles as the hero CTA target and the dimmed background photo.
  const [first] = await listCatalogProducts();
  const slug = first?.slug ?? "king-queen-couple-tee-set";

  return (
    <section className="relative overflow-hidden bg-night">
      {/* coral bloom behind the headline */}
      <div aria-hidden className="glow pointer-events-none absolute inset-0" />
      {/* hero photo, dimmed into the background */}
      {first?.imageUrls?.[0] && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image
            src={first.imageUrls[0]}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-[0.14]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/85 to-night" />
        </div>
      )}

      <div className="container-page relative pb-20 pt-36 text-center sm:pb-24 sm:pt-40">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-coral backdrop-blur">
          <HeartIcon className="h-3.5 w-3.5" />
          The together collection
        </span>

        <h1 className="mx-auto mt-7 max-w-4xl text-[2.75rem] leading-[1.03] text-white sm:text-6xl lg:text-7xl">
          Wear your favourite person.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-night-ink">
          Matching couple tees — two shirts, one print, your names on both. From ₹999 a set,
          delivered across India.
        </p>

        <HeroTeeAnimation />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/product/${slug}`} className="btn-primary">
            Shop matching sets
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
          <a
            href={whatsappLink(`Hi ${site.name}, I'd like help picking a couple set.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3 text-base font-semibold text-white backdrop-blur transition hover:bg-white/[0.12]"
          >
            <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
            Chat on WhatsApp
          </a>
        </div>

        {/* social proof — TODO(Yash): keep site.couplesServed honest as orders come in */}
        <div className="mt-9 flex items-center justify-center gap-3">
          <ul className="flex -space-x-2.5" aria-hidden>
            {avatars.map((a) => (
              <li
                key={a.id}
                className="h-8 w-8 rounded-full ring-2 ring-night"
                style={{ background: `linear-gradient(135deg, ${a.accent[0]}, ${a.accent[1]})` }}
              />
            ))}
          </ul>
          <p className="text-sm text-night-ink">
            <span className="font-semibold text-white">{site.couplesServed} couples</span> have found
            their pair
          </p>
        </div>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {promises.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-sm font-medium text-night-ink">
              <Icon className="h-5 w-5 shrink-0 text-coral" />
              {label}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-night-ink">
          Prefer to talk it through?{" "}
          <Link href="/contact" className="font-semibold text-coral hover:underline">
            Message us on WhatsApp
          </Link>
        </p>
      </div>
    </section>
  );
}
