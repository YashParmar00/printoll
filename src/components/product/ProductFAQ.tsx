import type { ProductFaq } from "@/lib/products";

/** Native <details> accordion — no client JS needed. */
export default function ProductFAQ({ faqs }: { faqs: ProductFaq[] }) {
  return (
    <div className="mt-10">
      <h2 className="text-2xl sm:text-3xl">Frequently asked</h2>
      <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-night-card">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-noir">
              {f.q}
              <span className="shrink-0 text-2xl leading-none text-coral transition-transform group-open:rotate-45">
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
