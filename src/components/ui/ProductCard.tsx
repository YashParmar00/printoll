import Link from "next/link";
import type { Product } from "@/lib/products";
import { inr, savingsPct } from "@/lib/format";
import { StarIcon, SparkleIcon, RupeeIcon } from "@/components/ui/icons";

/**
 * Product card — strike-through anchor pricing + "Personalizable" tag +
 * COD badge (RESEARCH.md §B4, §B7). The gradient panel is a placeholder for
 * the real Qikink mockup / phone photo added from M3/M6 (see IMAGES phase).
 */
export default function ProductCard({ product }: { product: Product }) {
  const save = savingsPct(product.price, product.compareAtPrice);
  const personalizable = product.personalization !== "none";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum focus-visible:ring-offset-2"
    >
      {/* Image placeholder */}
      <div
        className="relative aspect-square w-full"
        style={{ background: `linear-gradient(135deg, ${product.accent[0]}, ${product.accent[1]})` }}
      >
        {/* placeholder monogram + watermark */}
        <span className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-heading)] text-[5.5rem] font-semibold text-white/25">
          {product.name.charAt(0)}
        </span>
        <span className="absolute bottom-3 left-0 right-0 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-white/60">
          AuraaMarts
        </span>

        {personalizable && (
          <span className="pill absolute left-3 top-3 bg-white/95 text-plum">
            <SparkleIcon className="h-3.5 w-3.5" /> Personalizable
          </span>
        )}
        {save > 0 && (
          <span className="pill absolute right-3 top-3 bg-gold text-charcoal">Save {save}%</span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold leading-snug text-charcoal group-hover:text-plum">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink">{product.tagline}</p>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-ink">
          {product.reviews > 0 ? (
            <>
              <StarIcon className="h-4 w-4 text-gold" />
              <span className="font-semibold text-charcoal">{product.rating.toFixed(1)}</span>
              <span>({product.reviews})</span>
            </>
          ) : (
            <span className="pill bg-cream-dark px-2 py-0.5 text-[11px] text-plum">New arrival</span>
          )}
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-plum">{inr(product.price)}</span>
            <span className="strike text-sm text-ink">{inr(product.compareAtPrice)}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-plum">
            <RupeeIcon className="h-3.5 w-3.5" /> COD
          </span>
        </div>

        <span className="btn-primary mt-4 w-full py-2.5 text-sm">
          {personalizable ? "View & Personalize" : "View Details"}
        </span>
      </div>
    </Link>
  );
}
