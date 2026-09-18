import type { ProductFaq } from "@/lib/products";

/** Native <details> accordion — no client JS needed. */
export default function ProductFAQ({ faqs }: { faqs: ProductFaq[] }) {
  return (
    <div className="mt-8 sm:mt-10">
      <h2 className="text-xl sm:text-3xl">Frequently asked</h2>
      <div className="mt-3 divide-y divide-line rounded-2xl border border-line bg-night-card sm:mt-4">
        {faqs.map((f) => (
          <details key={f.q} className="group px-4 py-3.5 sm:px-5 sm:py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-noir">
              {f.q}
              <span className="shrink-0 text-xl leading-none text-coral transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-ink">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
