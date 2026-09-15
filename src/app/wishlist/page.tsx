import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { listWishlistSlugs } from "@/lib/wishlist";
import { listCatalogCards } from "@/lib/catalog";
import ProductCard from "@/components/ui/ProductCard";
import { HeartIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Wishlist" };
export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login?next=/wishlist");
  const [slugs, allProducts] = await Promise.all([listWishlistSlugs(customer.id), listCatalogCards()]);
  const bySlug = new Map(allProducts.map((product) => [product.slug, product]));
  const products = slugs.map((slug) => bySlug.get(slug)).filter((product) => product !== undefined);

  return (
    <div className="container-page min-h-[900px] py-10">
      <p className="eyebrow">Your account</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Wishlist</h1>

      {products.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-line bg-sand/50 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-coral/10 text-coral"><HeartIcon className="h-6 w-6" /></div>
          <h2 className="mt-5 text-2xl">Nothing saved yet.</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink">Tap the heart on any product to save it here.</p>
          <Link href="/category" className="btn-primary mt-6 text-sm">Browse products</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {products.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      )}
    </div>
  );
}
