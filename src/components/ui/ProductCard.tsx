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

export default function ProductCard({ product }: { product: Product }) {
  const save = savingsPct(product.price, product.compareAtPrice);
  // Products without their own photo fall back to a shared stock shot.
  const image = product.imageUrls?.[0] ?? product.imageUrl ?? FALLBACK_PRODUCT_IMAGE;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-sand transition-all duration-200 hover:-translate-y-1 hover:border-coral/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <div
        className="relative aspect-square w-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${product.accent[0]}, ${product.accent[1]})` }}
      >
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* Badge tag — Bestseller / New print / Gift favourite (set per product) */}
      </div>

      {/* Body */}
      <div className="flex min-h-[220px] flex-1 flex-col p-4 sm:min-h-[235px] sm:p-5">
        <div>
          <h3 className="min-h-10 text-xs font-bold leading-snug text-white group-hover:text-coral sm:min-h-11 sm:text-sm md:text-base lg:text-lg">
            {product.name}
          </h3>
        </div>

        <p className="mt-1 min-h-5 text-xs leading-relaxed text-ink sm:text-sm">{product.tagline}</p>

        <div className="mt-2 flex min-h-6 items-baseline gap-1 whitespace-nowrap sm:gap-1.5">
          <span className="shrink-0 text-sm font-bold text-white sm:text-base lg:text-lg">{inr(product.price)}</span>
          <span className="strike shrink-0 text-[10px] text-ink sm:text-xs">{inr(product.compareAtPrice)}</span>
          {save > 0 && <span className="shrink-0 text-[9px] font-semibold text-coral sm:text-[10px]">Save {save}%</span>}
        </div>

        {/* Rating — only shown once real reviews exist; we never invent counts. */}
        <div className="mt-3 flex min-h-10 items-center gap-1.5 text-xs text-ink">
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

        <span className="btn-primary mt-auto w-full whitespace-nowrap px-2 py-3 text-xs sm:px-4 sm:text-sm md:px-6">Choose your pair</span>
      </div>
    </Link>
  );
}
