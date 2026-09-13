import { listCatalogCards } from "@/lib/catalog";
import { listHomeCollections } from "@/lib/home-collections";
import CategoryClient from "./CategoryClient";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const [{ category }, products, collections] = await Promise.all([
    searchParams,
    listCatalogCards(),
    listHomeCollections(),
  ]);
  return <CategoryClient key={category ?? "all"} products={products} collections={collections} initialCategory={category} />;
}
