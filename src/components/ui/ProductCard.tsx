import Link from "next/link";
import Image from "next/image";
import { FALLBACK_PRODUCT_IMAGE, type Product } from "@/lib/products";
import { inr, savingsPct } from "@/lib/format";
import { StarIcon } from "@/components/ui/icons";

/**
 * Product card — badge tag + rating + price, with a coral "Choose your pair"
 * CTA. The gradient panel behind the image is the fallback for products that
 * don't have a real Qikink mockup uploaded from /admin/products yet.
 */

/** Tag colour is driven by the badge text so the palette stays consistent. */
function tagClass(badge: string): string {
  const key = badge.toLowerCase();
  if (key.includes("new")) return "bg-sage text-white";
  if (key.includes("gift") || key.includes("favourite") || key.includes("favorite"))
    return "bg-blush text-white";
  return "bg-white/12 text-white backdrop-blur";
}

export default function ProductCard({ product }: { product: Product }) {
  const save = savingsPct(product.price, product.compareAtPrice);
  // Products without their own photo fall back to a shared stock shot.
  const image = product.imageUrls?.[0] ?? product.imageUrl ?? FALLBACK_PRODUCT_IMAGE;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-sand transition-all duration-200 hover:-translate-y-1 hover:border-coral/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <div
        className="relative aspect-square w-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${product.accent[0]}, ${product.accent[1]})` }}
      >
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* Badge tag — Bestseller / New print / Gift favourite (set per product) */}
        {product.badge && (
          <span className={`tag absolute left-3 top-3 ${tagClass(product.badge)}`}>
            {product.badge}
          </span>
        )}
        {save > 0 && (
          <span className="tag absolute right-3 top-3 bg-coral text-white">Save {save}%</span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold leading-snug text-white group-hover:text-coral sm:text-lg">
            {product.name}
          </h3>
          <span className="shrink-0 text-base font-bold text-white sm:text-lg">
            {inr(product.price)}
          </span>
        </div>

        <div className="mt-1.5 flex items-baseline justify-between gap-3 text-sm text-ink">
          <p className="line-clamp-1">{product.tagline}</p>
          <span className="strike shrink-0 text-xs">{inr(product.compareAtPrice)}</span>
        </div>

        {/* Rating — only shown once real reviews exist; we never invent counts. */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-ink">
          {product.reviews > 0 ? (
            <>
              <span className="flex gap-0.5 text-star" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </span>
              <span>({product.reviews})</span>
            </>
          ) : (
            <span>2 tees per set · COD available</span>
          )}
        </div>

        <span className="btn-primary mt-5 w-full py-3 text-sm sm:mt-6">Choose your pair</span>
      </div>
    </Link>
  );
}
