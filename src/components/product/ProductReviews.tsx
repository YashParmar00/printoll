import type { Product } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";
import { StarIcon, WhatsAppIcon } from "@/components/ui/icons";

/**
 * Honest reviews block. With no real reviews yet, we show an empty state —
 * never fabricated ratings (RESEARCH.md §B1, §B9).
 */
export default function ProductReviews({ product }: { product: Product }) {
  return (
    <section className="bg-sand py-14">
      <div className="container-page">
        <h2 className="text-2xl sm:text-3xl">Reviews</h2>

        {product.reviews > 0 ? (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex text-star">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? "" : "opacity-25"}`} />
              ))}
            </div>
            <span className="font-semibold text-charcoal">{product.rating.toFixed(1)}</span>
            <span className="text-ink">({product.reviews} reviews)</span>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-line bg-night-card p-6 text-center">
            <p className="font-semibold text-charcoal">No reviews yet</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-ink">
              Be one of our first couples — real photo reviews from verified buyers will appear here.
              We never post fake ratings.
            </p>
            <a
              href={whatsappLink(`Hi ${site.name}, I'd like to know more about the ${product.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-4"
            >
              <WhatsAppIcon className="h-5 w-5" /> Ask us anything on WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
