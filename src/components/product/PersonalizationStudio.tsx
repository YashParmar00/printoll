"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { inr, savingsPct, deliveryBy } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import { useCart } from "@/lib/cart";
import ProductMockup from "@/components/product/ProductMockup";
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
} from "@/components/ui/icons";

const PRINT_MAX = 24;
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const PHOTO_MAX_BYTES = 8 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function PersonalizationStudio({ product }: { product: Product }) {
  const { addItem } = useCart();

  const needsText = product.personalization === "text" || product.personalization === "both";
  const needsPhoto = product.personalization === "photo" || product.personalization === "both";
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
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const gallery = product.imageUrls?.length ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [];
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => setDeliveryDate(deliveryBy(site.deliveryDays)), []);
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

  function handleAdd() {
    if (needsText && !text.trim()) {
      setError("Please type the names, initials or date to print.");
      return;
    }
    if (!sizeA || !sizeB) {
      setError("Please pick a size for each tee in the set.");
      return;
    }
    if (needsPhoto && !photoUrl) {
      setError("Please upload a photo to personalize.");
      return;
    }
    setError("");
    const detail = [needsText ? text.trim() : null, `Sizes: ${sizeA} + ${sizeB}`]
      .filter(Boolean)
      .join(" · ");
    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        personalizationText: detail,
        personalizationPhotoName: needsPhoto ? photoName ?? undefined : undefined,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 4000);
  }

  const priceBlock = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="text-3xl font-bold text-noir">{inr(product.price)}</span>
      <span className="strike text-lg text-ink">{inr(product.compareAtPrice)}</span>
      {save > 0 && <span className="tag bg-coral text-white">Save {save}%</span>}
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-coral">
        <RupeeIcon className="h-4 w-4" /> COD available
      </span>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Left: live preview + gallery */}
      <div>
        {gallery[selectedImage] && !photoUrl ? (
          <div className="relative aspect-square overflow-hidden rounded-2xl" style={{ background: `linear-gradient(135deg, ${product.accent[0]}, ${product.accent[1]})` }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded URL */}
            <img src={gallery[selectedImage]} alt={`${product.name} — photo ${selectedImage + 1}`} className="h-full w-full object-cover" />
          </div>
        ) : <ProductMockup shape={product.shape} accent={product.accent} text={needsText ? text : undefined} photoUrl={needsPhoto ? photoUrl : undefined} />}
        {gallery.length > 1 && <div className="mt-3 grid grid-cols-5 gap-3">{gallery.map((url, index) => <button key={url} type="button" onClick={() => setSelectedImage(index)} aria-label={`View product photo ${index + 1}`} className={`relative aspect-square overflow-hidden rounded-xl border bg-sand ${selectedImage === index ? "border-coral ring-2 ring-coral ring-offset-2" : "border-line hover:border-coral"}`}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={url} alt="" className="h-full w-full object-cover" /><span className="sr-only">{index === 0 ? "Main photo" : `Photo ${index + 1}`}</span></button>)}</div>}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink">
          <span className="inline-flex items-center gap-1.5"><ShieldIcon className="h-4 w-4 text-coral" /> 7-day damage replacement</span>
          <span className="inline-flex items-center gap-1.5"><TruckIcon className="h-4 w-4 text-coral" /> Free shipping across India</span>
        </div>
      </div>

      {/* Right: buy box */}
      <div>
        <div className="flex items-center gap-2">
          {product.badge && <span className="tag bg-blush text-noir">{product.badge}</span>}
          <span className="text-xs font-medium uppercase tracking-wider text-ink">
            Couple set · 2 tees
          </span>
        </div>

        <h1 className="mt-2 text-3xl sm:text-4xl">{product.name}</h1>
        <p className="mt-2 text-lg text-ink">{product.tagline}</p>

        <div className="mt-3 flex items-center gap-2 text-sm text-ink">
          {product.reviews > 0 ? (
            <>
              <StarIcon className="h-4 w-4 text-star" />
              <span className="font-semibold text-noir">{product.rating.toFixed(1)}</span>
              <span>({product.reviews} reviews)</span>
            </>
          ) : (
            <span className="tag bg-sand-dark text-noir">Just launched · be the first to review</span>
          )}
        </div>

        <div className="mt-5">{priceBlock}</div>
        <p className="mt-1 text-sm text-ink">Price is for the full set: both tees in one box.</p>

        {/* Delivery promise before add-to-cart (RESEARCH §B5) */}
        <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blush px-3 py-2 text-sm font-medium text-noir">
          <TruckIcon className="h-5 w-5 text-coral" />
          {deliveryDate ? (
            <>Order today, delivery by <strong className="font-semibold">{deliveryDate}</strong></>
          ) : (
            <>Delivered in 5–7 days across India</>
          )}
        </p>

        {/* Personalization + sizes */}
        <div className="mt-6 rounded-2xl border border-line bg-night-card p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-coral">
            <SparkleIcon className="h-4 w-4" /> Make it yours. The preview updates live.
          </p>

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
                <span>Printed on both tees, exactly as you type it.</span>
                <span>{text.length}/{PRINT_MAX}</span>
              </div>
            </div>
          )}

          {/* Two garments, two sizes */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SizePicker
              id="sizeA"
              label="Size for tee 1"
              value={sizeA}
              onChange={(v) => { setSizeA(v); if (error) setError(""); }}
            />
            <SizePicker
              id="sizeB"
              label="Size for tee 2"
              value={sizeB}
              onChange={(v) => { setSizeB(v); if (error) setError(""); }}
            />
          </div>
          <p className="mt-1.5 text-xs text-ink">
            Unisex fit. Between sizes? Size up, or ask us on WhatsApp.
          </p>

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
        </div>

        {/* Quantity */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm font-semibold text-noir">Sets</span>
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
        </div>

        {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

        <button type="button" onClick={handleAdd} className="btn-dark mt-4 w-full">
          Choose your pair · {inr(product.price * qty)}
        </button>

        {added && (
          <p className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-blush py-2.5 text-sm font-semibold text-noir">
            <CheckIcon className="h-5 w-5 text-coral" /> Added to cart
            <Link href="/cart" className="underline underline-offset-2">View cart</Link>
          </p>
        )}

        {/* Reassurance */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink">
          <span className="inline-flex items-center gap-1.5"><ShieldIcon className="h-4 w-4 text-coral" /> Secure payments</span>
          <span className="inline-flex items-center gap-1.5"><RupeeIcon className="h-4 w-4 text-coral" /> Cash on Delivery</span>
        </div>
        <a
          href={whatsappLink(`Hi ${site.name}, I have a question about the ${product.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#1ebe5a]"
        >
          <WhatsAppIcon className="h-5 w-5" /> Questions? Chat with us on WhatsApp
        </a>
      </div>

      {/* Sticky mobile add-to-cart bar (covers the bottom nav on PDP) */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="leading-tight">
          <div className="text-lg font-bold text-noir">{inr(product.price * qty)}</div>
          <div className="strike text-xs text-ink">{inr(product.compareAtPrice * qty)}</div>
        </div>
        <button type="button" onClick={handleAdd} className="btn-dark flex-1 py-3">
          Choose your pair
        </button>
      </div>
    </div>
  );
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
      <span className="field-label" id={`${id}-label`}>{label}</span>
      <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby={`${id}-label`}>
        {SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            aria-pressed={value === size}
            className={`h-9 min-w-11 rounded-lg border px-2 text-sm font-semibold transition ${
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
