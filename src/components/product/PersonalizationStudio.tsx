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

const NAME_MAX = 12;
const PHOTO_MAX_BYTES = 8 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function PersonalizationStudio({ product }: { product: Product }) {
  const { addItem } = useCart();

  const needsText = product.personalization === "text" || product.personalization === "both";
  const needsPhoto = product.personalization === "photo" || product.personalization === "both";
  const save = savingsPct(product.price, product.compareAtPrice);

  const [text, setText] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);

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
      setError("Please enter the name to personalize.");
      return;
    }
    if (needsPhoto && !photoUrl) {
      setError("Please upload a photo to personalize.");
      return;
    }
    setError("");
    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        personalizationText: needsText ? text.trim() : undefined,
        personalizationPhotoName: needsPhoto ? photoName ?? undefined : undefined,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 4000);
  }

  const priceBlock = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="text-3xl font-bold text-plum">{inr(product.price)}</span>
      <span className="strike text-lg text-ink">{inr(product.compareAtPrice)}</span>
      {save > 0 && <span className="pill bg-gold text-charcoal">Save {save}%</span>}
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-plum">
        <RupeeIcon className="h-4 w-4" /> COD available
      </span>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Left: live preview + gallery */}
      <div>
        <ProductMockup
          shape={product.shape}
          accent={product.accent}
          text={needsText ? text : undefined}
          photoUrl={needsPhoto ? photoUrl : undefined}
        />
        {/* Placeholder secondary shots (real photos land in M6) */}
        <div className="mt-3 grid grid-cols-4 gap-3">
          {["Main", "Detail", "Packaging", "Lifestyle"].map((label, i) => (
            <div
              key={label}
              className={`flex aspect-square items-end justify-center rounded-xl p-1.5 text-[9px] font-medium uppercase tracking-wide text-white/70 ${i === 0 ? "ring-2 ring-plum ring-offset-2" : ""}`}
              style={{ background: `linear-gradient(140deg, ${product.accent[0]}, ${product.accent[1]})` }}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink">
          <span className="inline-flex items-center gap-1.5"><ShieldIcon className="h-4 w-4 text-plum" /> 7-day damage replacement</span>
          <span className="inline-flex items-center gap-1.5"><TruckIcon className="h-4 w-4 text-plum" /> Free shipping across India</span>
        </div>
      </div>

      {/* Right: buy box */}
      <div>
        <div className="flex items-center gap-2">
          {product.badge && <span className="pill bg-plum/10 text-plum">{product.badge}</span>}
          <span className="text-xs font-medium uppercase tracking-wider text-ink">
            {product.category === "wellness" ? "Wellness" : "Personalized Gift"}
          </span>
        </div>

        <h1 className="mt-2 text-3xl sm:text-4xl">{product.name}</h1>
        <p className="mt-2 text-lg text-ink">{product.tagline}</p>

        <div className="mt-3 flex items-center gap-2 text-sm text-ink">
          {product.reviews > 0 ? (
            <>
              <StarIcon className="h-4 w-4 text-gold" />
              <span className="font-semibold text-charcoal">{product.rating.toFixed(1)}</span>
              <span>({product.reviews} reviews)</span>
            </>
          ) : (
            <span className="pill bg-cream-dark text-plum">New arrival · be the first to review</span>
          )}
        </div>

        <div className="mt-5">{priceBlock}</div>

        {/* Delivery promise before add-to-cart (RESEARCH §B5) */}
        <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-cream px-3 py-2 text-sm font-medium text-charcoal">
          <TruckIcon className="h-5 w-5 text-plum" />
          {deliveryDate ? (
            <>Order today, delivery by <strong className="font-semibold">{deliveryDate}</strong></>
          ) : (
            <>Delivered in 5–7 days across India</>
          )}
        </p>

        {/* Personalization */}
        {(needsText || needsPhoto) && (
          <div className="mt-6 rounded-2xl border border-line bg-cream/60 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-plum">
              <SparkleIcon className="h-4 w-4" /> Personalize it — preview updates live
            </p>

            {needsText && (
              <div className="mt-3">
                <label htmlFor="engrave" className="field-label">
                  Name to engrave
                </label>
                <input
                  id="engrave"
                  className="field"
                  value={text}
                  maxLength={NAME_MAX}
                  placeholder="e.g. Aaradhya"
                  onChange={(e) => {
                    setText(e.target.value);
                    if (error) setError("");
                  }}
                />
                <div className="mt-1 flex justify-between text-xs text-ink">
                  <span>Exactly as you&apos;d like it engraved.</span>
                  <span>{text.length}/{NAME_MAX}</span>
                </div>
              </div>
            )}

            {needsPhoto && (
              <div className="mt-3">
                <span className="field-label">Upload your photo</span>
                {photoUrl ? (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3">
                    <span className="flex items-center gap-2 truncate text-sm text-charcoal">
                      <CheckIcon className="h-5 w-5 shrink-0 text-plum" />
                      <span className="truncate">{photoName}</span>
                    </span>
                    <div className="flex shrink-0 gap-3 text-sm font-semibold">
                      <label className="cursor-pointer text-plum hover:underline">
                        Change
                        <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={onFile} />
                      </label>
                      <button type="button" onClick={removePhoto} className="text-ink hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-white px-4 py-6 text-center transition hover:border-plum">
                    <UploadIcon className="h-6 w-6 text-plum" />
                    <span className="text-sm font-semibold text-charcoal">Tap to upload a photo</span>
                    <span className="text-xs text-ink">JPG, PNG or WebP · up to 8 MB</span>
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={onFile} />
                  </label>
                )}
                {photoError && <p className="mt-1.5 text-xs font-medium text-red-600">{photoError}</p>}
              </div>
            )}
          </div>
        )}

        {/* Quantity */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm font-semibold text-charcoal">Quantity</span>
          <div className="inline-flex items-center rounded-full border border-line">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full text-plum hover:bg-cream disabled:opacity-40"
              disabled={qty <= 1}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-semibold tabular-nums">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full text-plum hover:bg-cream"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

        <button type="button" onClick={handleAdd} className="btn-primary mt-4 w-full">
          Add to Cart · {inr(product.price * qty)}
        </button>

        {added && (
          <p className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-plum/5 py-2.5 text-sm font-semibold text-plum">
            <CheckIcon className="h-5 w-5" /> Added to cart
            <Link href="/cart" className="underline underline-offset-2">View cart</Link>
          </p>
        )}

        {/* Reassurance */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink">
          <span className="inline-flex items-center gap-1.5"><ShieldIcon className="h-4 w-4 text-plum" /> Secure payments</span>
          <span className="inline-flex items-center gap-1.5"><RupeeIcon className="h-4 w-4 text-plum" /> Cash on Delivery</span>
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
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="leading-tight">
          <div className="text-lg font-bold text-plum">{inr(product.price * qty)}</div>
          <div className="strike text-xs text-ink">{inr(product.compareAtPrice * qty)}</div>
        </div>
        <button type="button" onClick={handleAdd} className="btn-primary flex-1 py-3">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
