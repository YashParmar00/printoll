import Link from "next/link";
import { notFound } from "next/navigation";
import { findHomeCollection } from "@/lib/home-collections";
import { saveHomeCollectionAction } from "../../actions";
import CollectionImageUpload from "../CollectionImageUpload";

export const dynamic = "force-dynamic";

const blank = { title: "", description: "", imageUrl: "", href: "/category", active: true, sortOrder: 0 };

export default async function CollectionEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = id === "new" ? blank : await findHomeCollection(id);
  if (!collection) notFound();
  return <div className="container-page max-w-3xl py-10">
    <Link href="/admin/collections" className="text-sm font-semibold text-plum">← All collections</Link>
    <h1 className="mt-3 text-3xl">{id === "new" ? "Add collection" : `Edit ${collection.title}`}</h1>
    <p className="mt-1 text-sm text-ink">Changes are published to the homepage immediately after saving.</p>
    <form action={saveHomeCollectionAction} className="mt-7 space-y-5">
      {id !== "new" && <input type="hidden" name="id" value={id} />}
      <section className="grid gap-5 rounded-2xl border border-line bg-night-card p-5 sm:grid-cols-2">
        <label className="field-label">Collection name *<input name="title" required maxLength={80} defaultValue={collection.title} className="field mt-1" /></label>
        <label className="field-label">Display order<input name="sortOrder" type="number" min="0" defaultValue={collection.sortOrder} className="field mt-1" /></label>
        <label className="field-label sm:col-span-2">Short description<textarea name="description" maxLength={240} rows={3} defaultValue={collection.description} className="field mt-1" /></label>
        <div className="sm:col-span-2"><span className="field-label">Collection photo</span><CollectionImageUpload initialUrl={collection.imageUrl} /></div>
        <label className="field-label sm:col-span-2">Shop link<input name="href" defaultValue={collection.href} placeholder="/category?category=mens" className="field mt-1" /><span className="mt-1 block text-xs font-normal text-ink">Use an internal path, for example /category?category=mens.</span></label>
        <label className="flex items-center gap-2 text-sm font-semibold text-white sm:col-span-2"><input name="active" type="checkbox" defaultChecked={collection.active} /> Show this collection on the homepage</label>
      </section>
      <button className="btn-primary" type="submit">Save collection</button>
    </form>
  </div>;
}
