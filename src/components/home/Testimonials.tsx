import { StarIcon } from "@/components/ui/icons";

/**
 * ⚠️ PLACEHOLDER testimonials — design + layout only.
 * TODO(Yash): these couples are NOT real customers. Swap every entry below for
 * genuine first-customer reviews (their own words + their photo of the set)
 * before launch. Never ship invented praise or ratings to a live storefront —
 * photo reviews are the single biggest trust builder for COD shoppers, and a
 * fake one is the fastest way to lose that trust.
 */
const testimonials = [
  {
    names: "Couple name",
    city: "City, State",
    quote:
      "Replace this with a real review in the couple's own words. Keep their photo of the set, and never invent a rating.",
    initials: "01",
    accent: ["#d2603f", "#f0b49b"],
  },
  {
    names: "Couple name",
    city: "City, State",
    quote:
      "Photo reviews are the single biggest trust builder for COD shoppers — seed this section only with genuine ones.",
    initials: "02",
    accent: ["#3d3a38", "#6f645c"],
  },
  {
    names: "Couple name",
    city: "City, State",
    quote:
      "Until real reviews arrive, consider hiding this section rather than filling it with invented praise.",
    initials: "03",
    accent: ["#b0472a", "#d2603f"],
  },
];

export default function Testimonials() {
  return (
    <section className="bg-night py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-dark">Loved in the wild</p>
          <h2 className="mt-3 text-3xl text-white sm:text-4xl">
            Tiny matching moments, big feelings.
          </h2>
          <p className="mt-4 text-night-ink">
            We only publish reviews we&apos;ve actually received — these slots are waiting for our
            first couples.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.initials} className="card-dark p-6">
              <div className="flex gap-0.5 text-coral" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-white/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${t.accent[0]}, ${t.accent[1]})` }}
                >
                  {t.initials}
                </span>
                <span className="text-sm leading-tight">
                  <span className="block font-semibold text-white">{t.names}</span>
                  <span className="text-night-ink">{t.city}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
