import Link from "next/link";
import { listCatalogProducts } from "@/lib/catalog";
import { inr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await listCatalogProducts(true);
  return <div className="container-page py-10">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Catalogue</p><h1 className="mt-1 text-3xl">Products</h1><p className="mt-1 text-sm text-ink">Edit what customers see: photos, copy, pricing and availability.</p></div><Link href="/admin/products/new" className="btn-primary">Add product</Link></div>
    <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white"><table className="w-full min-w-[680px] text-sm"><thead className="bg-cream text-left text-xs uppercase text-ink"><tr><th className="p-3">Product</th><th className="p-3">Price</th><th className="p-3">Status</th><th className="p-3">Updated</th><th className="p-3" /></tr></thead><tbody className="divide-y divide-line">{products.map((product) => <tr key={product.slug}><td className="p-3"><div className="font-semibold text-charcoal">{product.name}</div><div className="text-xs text-ink">/{product.slug}</div></td><td className="p-3 font-semibold">{inr(product.price)}</td><td className="p-3"><span className={`pill ${product.active ? "bg-emerald-100 text-emerald-800" : "bg-cream-dark text-ink"}`}>{product.active ? "Live" : "Hidden"}</span></td><td className="p-3 text-ink">—</td><td className="p-3"><Link href={`/admin/products/${product.slug}`} className="btn-secondary px-4 py-2 text-sm">Edit</Link></td></tr>)}</tbody></table></div>
  </div>;
}
