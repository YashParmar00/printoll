import type { CatalogCard as Product } from "@/lib/catalog-card";
import Link from "next/link";
import Image from "next/image";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/products";
import { inr, savingsPct } from "@/lib/format";
import { StarIcon } from "@/components/ui/icons";
import WishlistButton from "@/components/ui/WishlistButton";

/**
 * Product card — image, badge, name, price and rating (once real) only.
 * Deliberately trimmed: tagline and a CTA button live on the product page,
 * not repeated on every grid card. The gradient panel behind the image is
 * the fallback for products without a real Qikink mockup uploaded yet.
 */

export default function ProductCard({ product, sizes = "(min-width: 1280px) 384px, (min-width: 1024px) 31vw, 46vw" }: { product: Product; sizes?: string }) {
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
          sizes={sizes}
          className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {product.badge && <span className="absolute left-3 top-3 rounded-full bg-night/90 px-3 py-1 text-[10px] font-semibold text-white">{product.badge}</span>}
        <WishlistButton slug={product.slug} className="absolute right-3 top-3" />
      </div>

      {/* Body — name, price and rating (once real) only; tagline/CTA text live on the product page. */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="min-h-9 text-xs font-bold leading-snug text-white group-hover:text-coral sm:min-h-10 sm:text-sm md:text-base">
          {product.name}
        </h3>

        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="shrink-0 text-sm font-bold text-white sm:text-base">{inr(product.price)}</span>
          <span className="strike shrink-0 text-[10px] text-ink sm:text-xs">{inr(product.compareAtPrice)}</span>
          {save > 0 && <span className="shrink-0 text-[9px] font-semibold text-coral sm:text-[10px]">Save {save}%</span>}
        </div>

        {/* Rating — only shown once real reviews exist; we never invent counts. */}
        {product.reviews > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-ink">
            <span className="flex gap-0.5 text-star" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-4 w-4" />
              ))}
            </span>
            <span>({product.reviews})</span>
          </div>
        )}
      </div>
    </Link>
  );
}
