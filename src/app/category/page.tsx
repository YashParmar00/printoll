import { listCatalogProducts } from "@/lib/catalog";
import CategoryClient from "./CategoryClient";

export const dynamic = "force-dynamic";

export default async function CategoryPage() {
  const products = await listCatalogProducts();
  return <CategoryClient products={products} />;
}
