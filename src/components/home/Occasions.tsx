import Link from "next/link";
import { site } from "@/lib/site";
import Countdown from "@/components/home/Countdown";
import { ArrowRightIcon } from "@/components/ui/icons";

const others = [
  { label: "Anniversary", note: "Print the date it all started", accent: ["#1d1715", "#3d3a38"] },
  {
    label: "Wedding & Honeymoon",
    note: "Mr & Mrs, straight off the mandap",
    accent: ["#b0472a", "#1d1715"],
  },
];

export default function Occasions() {
  return (
    <section id="occasions" className="scroll-mt-28 bg-night-soft py-20">
      <div className="container-page">
        <div className="mb-9 text-center">
          <p className="eyebrow-dark">Shop by occasion</p>
          <h2 className="mt-3 text-3xl text-white sm:text-4xl">A set for every excuse to match</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Featured occasion — with countdown */}
          <div className="relative overflow-hidden rounded-2xl border border-coral/30 bg-gradient-to-br from-coral/25 via-night-card to-night-card p-6">
            <span className="pill bg-white/10 text-white">Couple season</span>
            <h3 className="mt-3 text-2xl text-white">{site.occasionName}</h3>
            <p className="mt-1 text-sm text-night-ink">
              Order early. Every set is printed to order, so give us 5–7 days.
            </p>
            <div className="mt-4 text-white">
              <Countdown target={site.occasionDate} label={site.occasionName} />
            </div>
            <Link href="/category" className="btn-primary mt-5 px-4 py-2 text-sm">
              Shop {site.occasionName} sets <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {/* Other occasions */}
          {others.map((o) => (
            <Link
              key={o.label}
              href="/category"
              className="group relative flex min-h-45 flex-col justify-end overflow-hidden rounded-2xl border border-night-line p-6 transition-colors hover:border-coral/40"
              style={{ background: `linear-gradient(135deg, ${o.accent[0]}, ${o.accent[1]})` }}
            >
              <h3 className="text-2xl text-white">{o.label}</h3>
              <p className="text-sm text-white/70">{o.note}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-coral">
                Explore sets
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
