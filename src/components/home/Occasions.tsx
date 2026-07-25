import Link from "next/link";
import { site } from "@/lib/site";
import RakhiCountdown from "@/components/home/RakhiCountdown";
import { ArrowRightIcon } from "@/components/ui/icons";

const others = [
  { label: "Birthday", note: "Make their day unforgettable", accent: ["#5b2a5e", "#7c4b7f"] },
  { label: "Anniversary", note: "Celebrate the years together", accent: ["#b28623", "#e7cb82"] },
];

export default function Occasions() {
  return (
    <section id="occasions" className="scroll-mt-28 py-16">
      <div className="container-page">
        <div className="mb-8 text-center">
          <p className="eyebrow">Shop by Occasion</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">The right gift for every moment</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Rakhi — featured, with countdown */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-plum via-plum-light to-gold p-6">
            <span className="pill bg-white/20 text-white">Festival Special</span>
            <h3 className="mt-3 text-2xl text-white">Raksha Bandhan</h3>
            <p className="mt-1 text-sm text-white/85">Order early so it reaches your sibling in time.</p>
            <div className="mt-4">
              <RakhiCountdown target={site.rakhiDate} />
            </div>
            <Link
              href="/#featured"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-plum transition-colors hover:bg-cream"
            >
              Shop Rakhi Gifts <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {/* Other occasions */}
          {others.map((o) => (
            <Link
              key={o.label}
              href="/#featured"
              className="group relative flex min-h-[180px] flex-col justify-end overflow-hidden rounded-2xl p-6 shadow-sm transition-shadow hover:shadow-lg"
              style={{ background: `linear-gradient(135deg, ${o.accent[0]}, ${o.accent[1]})` }}
            >
              <h3 className="text-2xl text-white">{o.label}</h3>
              <p className="text-sm text-white/85">{o.note}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white">
                Explore gifts
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
