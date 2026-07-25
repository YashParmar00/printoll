import { StarIcon } from "@/components/ui/icons";

/**
 * PLACEHOLDER testimonials — layout only.
 * TODO(Yash): replace with REAL first-customer reviews + photos before launch.
 * Never fabricate ratings or customers (RESEARCH.md §B1, §B9). These strings
 * exist purely to build and style the section; swap them the moment you have
 * genuine reviews (a review plugin/DB feeds this in a later milestone).
 */
const testimonials = [
  {
    name: "Placeholder — Customer 1",
    location: "City, State",
    quote:
      "Replace this with a real review. Keep the customer's own words, add their photo of the gift, and never invent a rating.",
    initials: "C1",
    accent: ["#7c4b7f", "#d4a947"],
  },
  {
    name: "Placeholder — Customer 2",
    location: "City, State",
    quote:
      "Real photo reviews are the single biggest trust builder for COD shoppers. Seed this section only with genuine ones.",
    initials: "C2",
    accent: ["#5b2a5e", "#7c4b7f"],
  },
  {
    name: "Placeholder — Customer 3",
    location: "City, State",
    quote:
      "Until real reviews arrive, consider hiding this section rather than filling it with invented praise.",
    initials: "C3",
    accent: ["#b28623", "#e7cb82"],
  },
];

export default function Testimonials() {
  return (
    <section className="bg-cream py-16">
      <div className="container-page">
        <div className="mb-8 text-center">
          <p className="eyebrow">Real reviews only</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">Words from our customers</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink">
            We seed this with genuine first-customer photos and words — never fabricated ratings.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <div className="flex gap-0.5 text-gold" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-charcoal">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ background: `linear-gradient(135deg, ${t.accent[0]}, ${t.accent[1]})` }}
                >
                  {t.initials}
                </span>
                <span className="text-sm">
                  <span className="block font-semibold text-charcoal">{t.name}</span>
                  <span className="text-ink">{t.location}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
