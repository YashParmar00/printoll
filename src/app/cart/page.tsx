"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { getProduct } from "@/lib/products";
import { inr } from "@/lib/format";
import { site } from "@/lib/site";
import { BagIcon, PlusIcon, MinusIcon, ArrowRightIcon } from "@/components/ui/icons";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, count, hydrated } = useCart();

  if (!hydrated) {
    return <div className="container-page py-20 text-center text-ink">Loading your cart…</div>;
  }

  if (count === 0) {
    return (
      <div className="container-page flex flex-col items-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-plum">
          <BagIcon className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-ink">Pick a set, add your names, and we&apos;ll print and deliver it in 5–7 days.</p>
        <Link href="/#featured" className="btn-primary mt-6">Shop couple sets</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl sm:text-4xl">Your cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Items */}
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {items.map((item) => {
            const product = getProduct(item.slug);
            const accent = product?.accent ?? ["#5b2a5e", "#7c4b7f"];
            return (
              <li key={item.key} className="flex gap-4 p-4">
                <div
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl font-heading text-2xl text-white/80"
                  style={{ background: `linear-gradient(140deg, ${accent[0]}, ${accent[1]})` }}
                >
                  {item.name.charAt(0)}
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/product/${item.slug}`} className="font-semibold text-charcoal hover:text-plum">
                      {item.name}
                    </Link>
                    <span className="font-semibold text-plum">{inr(item.price * item.qty)}</span>
                  </div>

                  {(item.personalizationText || item.personalizationPhotoName) && (
                    <p className="mt-0.5 text-sm text-ink">
                      {item.personalizationText && <>Engraving: “{item.personalizationText}”</>}
                      {item.personalizationPhotoName && <>Photo: {item.personalizationPhotoName}</>}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQty(item.key, item.qty - 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-plum hover:bg-cream"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold tabular-nums">{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQty(item.key, item.qty + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-plum hover:bg-cream"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="text-sm font-medium text-ink hover:text-plum hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Summary */}
        <div className="h-fit rounded-2xl border border-line bg-cream p-6">
          <h2 className="text-lg">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink">Subtotal ({count} item{count > 1 ? "s" : ""})</dt>
              <dd className="font-semibold text-charcoal">{inr(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink">Shipping</dt>
              <dd className="font-semibold text-plum">Free</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-line pt-4">
            <span className="font-semibold text-charcoal">Total</span>
            <span className="text-xl font-bold text-plum">{inr(subtotal)}</span>
          </div>
          <p className="mt-3 rounded-lg bg-night-card px-3 py-2 text-sm font-medium text-plum">
            💸 Pay online at checkout & save ₹{site.prepaidDiscount}
          </p>
          <Link href="/checkout" className="btn-primary mt-4 w-full">
            Proceed to Checkout <ArrowRightIcon className="h-5 w-5" />
          </Link>
          <Link href="/#featured" className="mt-3 block text-center text-sm font-medium text-plum hover:underline">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
