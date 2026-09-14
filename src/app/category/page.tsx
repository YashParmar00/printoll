import { listCatalogCards } from "@/lib/catalog";
import { listHomeCollections } from "@/lib/home-collections";
import CategoryClient from "./CategoryClient";

export const dynamic = "force-dynamic";

export default async function CategoryPage() {
  const [products, collections] = await Promise.all([
    listCatalogCards(),
    listHomeCollections(),
  ]);
  return <CategoryClient products={products} collections={collections} />;
}
