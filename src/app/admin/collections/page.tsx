import Link from "next/link";
import { listHomeCollections } from "@/lib/home-collections";
import { deleteHomeCollectionAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function HomeCollectionsPage() {
  const collections = await listHomeCollections(true);
  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Homepage content</p>
          <h1 className="mt-1 text-3xl">Collections</h1>
          <p className="mt-1 text-sm text-ink">Manage the cards in the Made to match slider: title, message, photo, link and display order.</p>
        </div>
        <Link href="/admin/collections/new" className="btn-primary">Add collection</Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-night-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-cream text-left text-xs uppercase text-ink"><tr><th className="p-3">Collection</th><th className="p-3">Link</th><th className="p-3">Order</th><th className="p-3">Status</th><th className="p-3" /></tr></thead>
          <tbody className="divide-y divide-line">
            {collections.map((collection) => (
              <tr key={collection.id}>
                <td className="p-3"><div className="font-semibold text-charcoal">{collection.title}</div><div className="max-w-sm truncate text-xs text-ink">{collection.description || "No supporting text"}</div></td>
                <td className="p-3 text-ink">{collection.href}</td>
                <td className="p-3">{collection.sortOrder}</td>
                <td className="p-3"><span className={`pill ${collection.active ? "bg-emerald-100 text-emerald-800" : "bg-cream-dark text-ink"}`}>{collection.active ? "Live" : "Hidden"}</span></td>
                <td className="p-3"><div className="flex gap-2"><Link href={`/admin/collections/${collection.id}`} className="btn-secondary px-4 py-2 text-sm">Edit</Link><form action={deleteHomeCollectionAction}><input type="hidden" name="id" value={collection.id} /><button className="rounded-xl border border-red-500/50 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white">Remove</button></form></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-ink">The starter cards are Men, Women, Matching and Gifts &amp; More. Use display order to control their sequence, or hide any card without deleting it.</p>
    </div>
  );
}
