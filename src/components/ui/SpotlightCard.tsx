import type { CatalogCard as Product } from "@/lib/catalog-card";
import Link from "next/link";
import Image from "next/image";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/products";
import { inr, savingsPct } from "@/lib/format";
import WishlistButton from "@/components/ui/WishlistButton";

/**
 * Poster-style card for the home page spotlight: the photo fills the whole
 * tile and name/price sit on a bottom scrim — no tagline, no rating/COD
 * line, no separate CTA button. Deliberately plainer than the full
 * ProductCard used on the shop grid, wishlist and related-products rails.
 */
export default function SpotlightCard({ product, className = "", sizes = "(min-width: 1024px) 25vw, 46vw" }: { product: Product; className?: string; sizes?: string }) {
  const save = savingsPct(product.price, product.compareAtPrice);
  const image = product.imageUrls?.[0] ?? product.imageUrl ?? FALLBACK_PRODUCT_IMAGE;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group relative flex rounded-2xl bg-night p-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral ${className}`}
    >
      {/* The 1px bg-night padding around the clipped box below is deliberate:
          overflow-hidden + rounded-2xl can leave a hairline rendering seam
          at the corners on some zoom/DPI combinations. Wrapping it in a
          same-color margin means any such seam blends into that margin
          instead of showing against a mismatched background. */}
      <div className="relative h-full w-full overflow-hidden rounded-[15px] bg-sand">
        <Image src={image} alt={product.name} fill sizes={sizes} className="object-cover" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-night via-night/50 to-transparent" />
        <div aria-hidden className="absolute inset-0 bg-coral/0 transition-colors duration-200 group-hover:bg-coral/10" />

        {product.badge && <span className="absolute left-3 top-3 rounded-full bg-night/90 px-3 py-1 text-[10px] font-semibold text-white">{product.badge}</span>}
        <WishlistButton slug={product.slug} className="absolute right-3 top-3" />

        {/* Positioned absolute, not flex mt-auto — this div's parent is a
            plain block box, not a flex container, so mt-auto would have no
            effect and the text would render at the top instead of the bottom. */}
        <div className="absolute inset-x-0 bottom-0 w-full p-4 sm:p-5">
          <h3 className="text-sm font-bold leading-snug text-white sm:text-base md:text-lg">{product.name}</h3>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-sm font-bold text-white sm:text-base">{inr(product.price)}</span>
            <span className="strike text-[10px] text-white/60 sm:text-xs">{inr(product.compareAtPrice)}</span>
            {save > 0 && <span className="text-[10px] font-semibold text-coral-light sm:text-xs">Save {save}%</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
