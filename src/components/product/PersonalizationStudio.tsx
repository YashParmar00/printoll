"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { garmentCount } from "@/lib/checkout-input";
import type { Product } from "@/lib/products";
import { inr, savingsPct, deliveryBy } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import { useCart } from "@/lib/cart";
import ProductMockup from "@/components/product/ProductMockup";
import WishlistButton from "@/components/ui/WishlistButton";
import {
  SparkleIcon,
  UploadIcon,
  PlusIcon,
  MinusIcon,
  TruckIcon,
  ShieldIcon,
  RupeeIcon,
  WhatsAppIcon,
  CheckIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  ShareIcon,
  LeafIcon,
  BagIcon,
  TeeIcon,
} from "@/components/ui/icons";

const PRINT_MAX = 24;
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const PHOTO_MAX_BYTES = 8 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function PersonalizationStudio({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();

  const needsText = product.personalization === "text" || product.personalization === "both";
  const needsPhoto = product.personalization === "photo" || product.personalization === "both";
  const sizeCount = garmentCount(product);
  const save = savingsPct(product.price, product.compareAtPrice);

  const [text, setText] = useState("");
  // Two garments per set, so two independent sizes. Carried in the same
  // personalizationText field the cart/checkout already persists — no schema change.
  const [sizeA, setSizeA] = useState<string>("");
  const [sizeB, setSizeB] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const deliveryDate = useSyncExternalStore(subscribeToDate, () => deliveryBy(site.deliveryDays), () => null);
  const gallery = product.imageUrls?.length ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [];
  const [selectedImage, setSelectedImage] = useState(0);
  // Both the inline "Add to cart" and the sticky mobile bar call handleAdd —
  // on a validation error, scroll this into view so the message is visible
  // regardless of which button (often the one at the bottom) was tapped.
  const personalizeRef = useRef<HTMLDivElement>(null);

  // Free the object URL when it changes or on unmount.
  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl); }, [photoUrl]);

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) {
      setPhotoError("Please use a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      setPhotoError("Image must be under 8 MB.");
      return;
    }
    setPhotoError("");
    setPhotoUrl(URL.createObjectURL(file));
    setPhotoName(file.name);
    setError("");
  }

  function removePhoto() {
    setPhotoUrl(null);
    setPhotoName(null);
  }

  function fail(message: string) {
    setError(message);
    personalizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleAdd() {
    if (needsPhoto) { fail("Photo previews are available, but photo orders need secure upload delivery before checkout. Please contact us."); return; }
    if (needsText && !text.trim()) {
      fail("Please type the names, initials or date to print.");
      return;
    }
    if ((sizeCount > 0 && !sizeA) || (sizeCount === 2 && !sizeB)) {
      fail("Please pick the required garment sizes.");
      return;
    }
    if (needsPhoto && !photoUrl) {
      fail("Please upload a photo to personalize.");
      return;
    }
    setError("");
    const detail = needsText ? text.trim() : undefined;
    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        personalizationText: detail,
        sizes: sizeCount === 2 ? [sizeA, sizeB] : sizeCount === 1 ? [sizeA] : [],
        personalizationPhotoName: needsPhoto ? photoName ?? undefined : undefined,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 4000);
  }

  function handleBuyNow() {
    handleAdd();
    if ((!needsText || text.trim()) && !needsPhoto && (!sizeCount || (sizeA && (sizeCount !== 2 || sizeB)))) router.push("/checkout");
  }

  async function shareProduct() {
    const data = { title: product.name, text: product.tagline, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(data.url);
    } catch { /* The user can dismiss the native share panel. */ }
  }

  const priceBlock = (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{inr(product.price)}</span>
      <span className="strike text-base text-ink">{inr(product.compareAtPrice)}</span>
      {save > 0 && <span className="tag bg-coral text-white">Save {save}%</span>}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">
      {/* Left: live preview + gallery */}
      <div>
        {gallery[selectedImage] && !photoUrl ? (
          <div className="relative aspect-[1.62/1] overflow-hidden rounded-[18px] border border-white/10 sm:aspect-square" style={{ background: `linear-gradient(135deg, ${product.accent[0]}, ${product.accent[1]})` }}>
            <Image src={gallery[selectedImage]} alt={`${product.name} — photo ${selectedImage + 1}`} className="h-full w-full object-contain"  fill sizes="(min-width: 1280px) 576px, (min-width: 1024px) 46vw, 94vw" loading="eager" fetchPriority="high" />
            <WishlistButton slug={product.slug} className="absolute right-3 top-3 border border-white/10" />
            {gallery.length > 1 && <>
              <button type="button" aria-label="Previous product image" onClick={() => setSelectedImage((selectedImage - 1 + gallery.length) % gallery.length)} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-paper/70 text-white backdrop-blur hover:bg-paper"><ChevronLeftIcon className="h-5 w-5" /></button>
              <button type="button" aria-label="Next product image" onClick={() => setSelectedImage((selectedImage + 1) % gallery.length)} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-paper/70 text-white backdrop-blur hover:bg-paper"><ChevronRightIcon className="h-5 w-5" /></button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-paper/80 px-2.5 py-1 text-xs font-semibold text-white">{selectedImage + 1} / {gallery.length}</span>
            </>}
          </div>
        ) : <ProductMockup shape={product.shape} accent={product.accent} text={needsText ? text : undefined} photoUrl={needsPhoto ? photoUrl : undefined} />}
        {gallery.length > 1 && <div className="mt-3 grid grid-cols-5 gap-2.5 sm:gap-3">{gallery.map((url, index) => <button key={url} type="button" onClick={() => setSelectedImage(index)} aria-label={`View product photo ${index + 1}`} className={`relative aspect-square overflow-hidden rounded-xl bg-sand transition ${selectedImage === index ? "ring-2 ring-coral" : "opacity-60 hover:opacity-100"}`}><Image src={url} alt="" fill sizes="(min-width: 1024px) 108px, 18vw" className="object-cover" /><span className="sr-only">{index === 0 ? "Main photo" : `Photo ${index + 1}`}</span></button>)}</div>}
      </div>

      {/* Right: buy box */}
      <div>
        <div className="hidden">
          <div className="flex items-center gap-2">
            {product.badge && <span className="rounded-full bg-night px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">{product.badge}</span>}
            <span className="text-xs font-medium uppercase tracking-wider text-ink">
              {sizeCount === 2 ? "Couple set · 2 tees" : sizeCount === 0 ? "One item" : "Single garment"}
            </span>
          </div>
          <WishlistButton slug={product.slug} />
        </div>

        <div className="mt-3 flex items-center gap-2 sm:mt-2.5"><h1 className="min-w-0 flex-1 truncate text-xl leading-[1.2] text-white sm:text-3xl">{product.name}</h1>{product.reviews === 0 && <span className="shrink-0 rounded-md bg-sand px-1.5 py-1 text-[8px] font-semibold text-white sm:text-[10px]"><span className="mr-0.5 text-coral">●</span>Just launched</span>}</div>
        <p className="mt-1 truncate text-sm leading-relaxed text-ink sm:mt-1.5 sm:text-base">{product.tagline}</p>

        <div className={product.reviews > 0 ? "mt-2.5 flex items-center gap-2 text-sm text-ink" : "hidden"}>
          {product.reviews > 0 ? (
            <>
              <StarIcon className="h-4 w-4 text-star" />
              <span className="font-semibold text-white">{product.rating.toFixed(1)}</span>
              <span>({product.reviews} reviews)</span>
            </>
          ) : (
            <span className="tag bg-sand text-white">Just launched · be the first to review</span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3"><div>{priceBlock}</div><button type="button" onClick={shareProduct} aria-label="Share product" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition hover:bg-sand hover:text-white"><ShareIcon className="h-5 w-5" /></button></div>
        <p className="hidden mt-1.5 items-center gap-1.5 text-sm text-ink">
          <RupeeIcon className="h-4 w-4 text-coral" />
          {sizeCount === 2 ? "Price is for the full set: both tees in one box." : sizeCount === 0 ? "Price is for one item." : "Price is for one garment."} · COD available
        </p>

        <div className="mt-4 grid grid-cols-4 divide-x divide-line overflow-hidden rounded-2xl border border-line bg-night-card">
          <Benefit icon={<TruckIcon className="h-4 w-4" />} title="Free" text="shipping" />
          <Benefit icon={<ShieldIcon className="h-4 w-4" />} title="7-day" text="replacement" />
          <Benefit icon={<LeafIcon className="h-4 w-4" />} title="Premium" text="DTG print" />
          <Benefit icon={<RupeeIcon className="h-4 w-4" />} title="COD" text="available" />
        </div>

        {/* Delivery promise before add-to-cart (RESEARCH §B5) */}
        <p className="mt-3 hidden items-center gap-2 rounded-xl border border-coral/15 bg-coral/10 px-3 py-2 text-sm font-medium text-white lg:inline-flex">
          <TruckIcon className="h-4 w-4 shrink-0 text-coral" />
          {deliveryDate ? (
            <>Order today, delivery by <strong className="font-semibold">{deliveryDate}</strong></>
          ) : (
            <>Delivered in 5–7 days across India</>
          )}
        </p>

        {/* Only products that support direct personalisation need this editor. */}
        {(needsText || needsPhoto) && <div ref={personalizeRef} className="mt-4 scroll-mt-24 rounded-[18px] border border-coral/20 bg-gradient-to-br from-coral/[0.08] to-night-card p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-white">
            <SparkleIcon className="h-4 w-4 text-coral" /> Make it yours. <span className="font-normal text-ink">The preview updates live.</span><ArrowRightIcon className="ml-auto h-4 w-4 text-coral" />
          </p>
          {error && <p className="mt-2 text-sm font-medium text-red-400">{error}</p>}

          {needsText && (
            <div className="mt-3">
              <label htmlFor="printText" className="field-label">
                Names, initials or date to print
              </label>
              <input
                id="printText"
                className="field"
                value={text}
                maxLength={PRINT_MAX}
                placeholder="e.g. Aarav & Diya"
                onChange={(e) => {
                  setText(e.target.value);
                  if (error) setError("");
                }}
              />
              <div className="mt-1 flex justify-between text-xs text-ink">
                <span>{sizeCount === 2 ? "Printed on both tees, exactly as you type it." : "Printed exactly as you type it."}</span>
                <span>{text.length}/{PRINT_MAX}</span>
              </div>
            </div>
          )}

          {needsPhoto && (
            <div className="mt-4">
              <span className="field-label">Upload your photo</span>
              {photoUrl ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-night-card px-4 py-3">
                  <span className="flex items-center gap-2 truncate text-sm text-noir">
                    <CheckIcon className="h-5 w-5 shrink-0 text-coral" />
                    <span className="truncate">{photoName}</span>
                  </span>
                  <div className="flex shrink-0 gap-3 text-sm font-semibold">
                    <label className="cursor-pointer text-coral hover:underline">
                      Change
                      <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={onFile} />
                    </label>
                    <button type="button" onClick={removePhoto} className="text-ink hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-night-card px-4 py-6 text-center transition hover:border-coral">
                  <UploadIcon className="h-6 w-6 text-coral" />
                  <span className="text-sm font-semibold text-noir">Tap to upload a photo</span>
                  <span className="text-xs text-ink">JPG, PNG or WebP · up to 8 MB</span>
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={onFile} />
                </label>
              )}
              {photoError && <p className="mt-1.5 text-xs font-medium text-red-600">{photoError}</p>}
            </div>
          )}
        </div>}

        {sizeCount > 0 && <div className="mt-5">
          <div className="mb-2 flex items-center justify-between"><span className="text-sm font-semibold text-white">Size</span><button type="button" className="text-xs font-semibold text-coral hover:underline">Size guide</button></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SizePicker id="sizeA" label={sizeCount === 1 ? "" : "Size for tee 1"} value={sizeA} onChange={(v) => { setSizeA(v); if (error) setError(""); }} />
            {sizeCount === 2 && <SizePicker id="sizeB" label="Size for tee 2" value={sizeB} onChange={(v) => { setSizeB(v); if (error) setError(""); }} />}
          </div>
          <p className="mt-2 text-xs text-ink">Unisex fit. Between sizes? Size up.</p>
        </div>}

        {/* Quantity */}
        <div className="mt-5 flex items-center gap-4">
          <span className="text-sm font-semibold text-noir">Quantity</span>
          <div className="inline-flex items-center rounded-full border border-line bg-night-card">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full text-noir hover:bg-blush disabled:opacity-40"
              disabled={qty <= 1}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-semibold tabular-nums">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full text-noir hover:bg-blush"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#2CCB68]"><span className="h-1.5 w-1.5 rounded-full bg-[#2CCB68]" />In stock</span>
        </div>

        <button type="button" onClick={handleAdd} className="btn-primary mt-4 w-full">
          <BagIcon className="h-5 w-5" />
          Add to cart · {inr(product.price * qty)}
        </button>

        <button type="button" onClick={handleBuyNow} className="btn-secondary mt-3 w-full">Buy now</button>
        <div className="mt-4 flex items-center gap-3 rounded-[16px] border border-line bg-night-card p-3.5 lg:hidden">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral"><TruckIcon className="h-5 w-5" /></span>
          <p className="min-w-0 text-sm text-ink"><strong className="block text-white">{deliveryDate ? <>Order today, delivery by {deliveryDate}</> : <>Delivered in 5–7 days</>}</strong>Usually delivers across India</p>
          <ArrowRightIcon className="ml-auto h-4 w-4 shrink-0 text-coral" />
        </div>
        {!needsText && !needsPhoto && <Link href="/edit" className="mt-3 flex items-center gap-3 rounded-[16px] border border-line bg-night-card p-3.5 transition hover:border-coral/50 lg:hidden">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral/15 text-white"><TeeIcon className="h-6 w-6" /></span>
          <p className="min-w-0 text-sm text-ink"><strong className="block text-white">Make it yours.</strong>Change text, colours or create your own.</p>
          <ArrowRightIcon className="ml-auto h-4 w-4 shrink-0 text-coral" />
        </Link>}

        {added && (
          <p className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-blush py-2.5 text-sm font-semibold text-noir">
            <CheckIcon className="h-5 w-5 text-coral" /> Added to cart
            <Link href="/cart" className="underline underline-offset-2">View cart</Link>
          </p>
        )}

        {/* Reassurance */}
        <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-ink">
          <span className="inline-flex items-center gap-1.5"><ShieldIcon className="h-4 w-4 text-coral" /> Secure payments</span>
          <span className="inline-flex items-center gap-1.5"><RupeeIcon className="h-4 w-4 text-coral" /> Cash on Delivery</span>
        </div>
        <a
          href={whatsappLink(`Hi ${site.name}, I have a question about the ${product.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 text-sm font-semibold text-[#1ebe5a]"
        >
          <WhatsAppIcon className="h-5 w-5" /> Questions? Chat with us on WhatsApp
        </a>
      </div>

      {/* Sticky mobile add-to-cart bar (covers the bottom nav on PDP) */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-line bg-[#100e0e]/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-10px_24px_rgba(0,0,0,0.22)] backdrop-blur lg:hidden">
        <div className="min-w-0 leading-tight">
          <div className="text-lg font-bold text-white">{inr(product.price * qty)}</div>
          <div className="mt-0.5 text-[11px] font-medium text-ink">View details ^</div>
        </div>
        <button type="button" onClick={handleAdd} className="btn-primary min-w-[178px] px-4 py-3 text-sm">
          <BagIcon className="h-4 w-4" />
          Add to cart
        </button>
      </div>
    </div>
  );
}

function Benefit({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="min-w-0 px-1.5 py-3 text-center text-[10px] leading-tight text-ink sm:px-3 sm:text-xs"><span className="mx-auto mb-1 flex w-fit text-coral">{icon}</span><strong className="block text-white">{title}</strong>{text}</div>;
}

function SizePicker({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      {label && <span className="field-label" id={`${id}-label`}>{label}</span>}
      <div className="grid grid-cols-6 gap-1.5" role="group" aria-label={label || "Choose a size"}>
        {SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            aria-pressed={value === size}
            className={`h-9 min-w-0 rounded-lg border px-1 text-xs font-semibold transition ${
              value === size
                ? "border-coral bg-coral text-white"
                : "border-line bg-night-card text-noir hover:border-coral/40"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

function subscribeToDate(notify: () => void) { const timer = setInterval(notify, 60_000); return () => clearInterval(timer); }
