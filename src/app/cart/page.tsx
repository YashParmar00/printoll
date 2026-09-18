"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";
import { site } from "@/lib/site";
import { products, FALLBACK_PRODUCT_IMAGE } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";
import {
  BagIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
  CheckIcon,
  LockIcon,
  ShieldIcon,
  TruckIcon,
  TrashIcon,
} from "@/components/ui/icons";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, count, hydrated } = useCart();
  if (!hydrated) return <CartSkeleton />;
  if (!count) return <EmptyCart />;
  const recommendations = products
    .filter((product) => !items.some((item) => item.slug === product.slug))
    .slice(0, 4);
  return (
    <div className="container-page min-h-[760px] py-6 pb-20 sm:py-10 lg:pb-16">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl text-white sm:text-4xl">Your cart</h1>
          <p className="mt-0.5 text-xs text-ink sm:mt-1 sm:text-sm">
            {count} item{count === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/category"
          className="mt-1 inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-coral hover:text-coral-light sm:text-sm"
        >
          Continue shopping{" "}
          <ArrowRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </div>
      <div className="mt-6 grid gap-5 lg:mt-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.9fr)] lg:gap-8">
        <ul className="cart-item-list space-y-3">
          {items.map((item) => (
            <CartItem
              key={item.key}
              item={item}
              onQty={updateQty}
              onRemove={removeItem}
            />
          ))}
        </ul>
        <aside className="h-fit rounded-[20px] border border-line bg-night-card p-4 sm:rounded-[22px] sm:p-6 lg:sticky lg:top-24">
          <h2 className="text-lg text-white sm:text-xl">Order summary</h2>
          <dl className="mt-4 space-y-3 text-sm sm:mt-5">
            <div className="flex justify-between gap-4">
              <dt className="text-ink">
                Subtotal ({count} item{count === 1 ? "" : "s"})
              </dt>
              <dd className="font-semibold text-white">{inr(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink">Shipping</dt>
              <dd className="rounded-md bg-[#11291B] px-2 py-0.5 text-xs font-bold text-[#2CCB68]">
                FREE
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4 sm:mt-5 sm:pt-5">
            <span className="font-semibold text-white">Total</span>
            <span className="text-xl font-bold text-white sm:text-2xl">
              {inr(subtotal)}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#2CCB68]/25 bg-[#11291B] p-3 text-xs font-medium text-[#a5eabf] sm:mt-5 sm:text-sm">
            <CheckIcon className="h-4 w-4 shrink-0 text-[#2CCB68] sm:h-5 sm:w-5" />
            Pay online at checkout &amp; save {inr(site.prepaidDiscount)}{" "}
            <ArrowRightIcon className="ml-auto h-4 w-4 shrink-0" />
          </div>
          <Link href="/checkout" className="btn-primary mt-4 w-full sm:mt-5">
            <LockIcon className="h-4 w-4" /> Proceed to Checkout{" "}
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 sm:mt-5 sm:pt-5">
            <Trust
              icon={<TruckIcon className="h-4 w-4" />}
              title="Free shipping"
            />
            <Trust
              icon={<ShieldIcon className="h-4 w-4" />}
              title="7-day cover"
            />
            <Trust icon={<LockIcon className="h-4 w-4" />} title="Secure pay" />
          </div>
        </aside>
      </div>
      {recommendations.length > 0 && (
        <section className="mt-14">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl text-white">You may also like</h2>
            <Link href="/category" className="text-sm font-semibold text-coral">
              See all →
            </Link>
          </div>
          <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((product) => (
              <div
                key={product.slug}
                className="w-[220px] shrink-0 snap-start sm:w-auto"
              >
                <ProductCard
                  product={product}
                  sizes="(min-width: 1024px) 260px, 220px"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function CartItem({
  item,
  onQty,
  onRemove,
}: {
  item: ReturnType<typeof useCart>["items"][number];
  onQty: (key: string, qty: number) => void;
  onRemove: (key: string) => void;
}) {
  const product = products.find((entry) => entry.slug === item.slug);
  const image =
    product?.imageUrls?.[0] ?? product?.imageUrl ?? FALLBACK_PRODUCT_IMAGE;
  const compareAt = product?.compareAtPrice;
  return (
    <li className="flex gap-3 rounded-[18px] border border-line bg-night-card p-3 md:gap-5 md:rounded-[20px] md:p-5">
      <Link
        href={`/product/${item.slug}`}
        className="relative h-22 w-22 shrink-0 overflow-hidden rounded-[14px] bg-sand md:h-32 md:w-32"
      >
        <Image
          src={image}
          alt={item.name}
          fill
          sizes="128px"
          className="object-cover"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/product/${item.slug}`}
              className="line-clamp-2 text-[15px] font-bold leading-snug text-white hover:text-coral md:text-base"
            >
              {item.name}
            </Link>
            {item.sizes?.length ? (
              <p className="mt-0.5 text-xs text-ink">
                Size: {item.sizes.join(" / ")}
              </p>
            ) : null}
            {item.personalizationText ? (
              <p className="mt-0.5 truncate text-xs text-ink">
                Print: {item.personalizationText}
              </p>
            ) : null}
            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-[#2CCB68]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2CCB68]" />
              In stock
            </p>
          </div>
          <button
            type="button"
            aria-label={`Remove ${item.name} from cart`}
            onClick={() => onRemove(item.key)}
            className="-mr-1 -mt-1 rounded-lg p-2 text-ink transition hover:bg-white/5 hover:text-coral"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="flex items-baseline">
            <p className="text-lg font-bold leading-none text-white">
              {inr(item.price * item.qty)}
            </p>
            {compareAt && compareAt > item.price ? (
              <p className="mt-1 strike text-[11px] text-ink">
                {inr(compareAt * item.qty)}
              </p>
            ) : null}
          </div>
          <div className="inline-flex items-center rounded-full border border-line bg-paper">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => onQty(item.key, item.qty - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-sand"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="w-7 text-center text-sm font-semibold tabular-nums text-white">
              {item.qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => onQty(item.key, item.qty + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-sand"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
function Trust({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="text-center text-[10px] leading-tight text-ink">
      <span className="mx-auto mb-1 flex w-fit text-coral">{icon}</span>
      {title}
    </div>
  );
}
function CartSkeleton() {
  return (
    <div className="container-page min-h-[720px] py-10" aria-busy="true">
      <div className="h-10 w-40 animate-pulse rounded bg-sand" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="h-48 animate-pulse rounded-[20px] bg-sand" />
        <div className="h-72 animate-pulse rounded-[20px] bg-sand" />
      </div>
    </div>
  );
}
function EmptyCart() {
  return (
    <div className="container-page flex min-h-[680px] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-coral/25 bg-coral/10 text-coral">
        <BagIcon className="h-9 w-9" />
      </div>
      <h1 className="mt-6 text-3xl text-white">Your cart is empty</h1>
      <p className="mt-2 max-w-sm text-ink">
        Looks like you haven&apos;t added anything yet.
      </p>
      <Link href="/category" className="btn-primary mt-7">
        Explore prints <ArrowRightIcon className="h-5 w-5" />
      </Link>
    </div>
  );
}
