import type { MetadataRoute } from "next";
import { listCatalogProducts } from "@/lib/catalog";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listCatalogProducts();
  const now = new Date();
  const staticRoutes = [
    "",
    "/category",
    "/about",
    "/contact",
    "/faq",
    "/track",
    "/shipping-policy",
    "/return-policy",
    "/privacy-policy",
    "/terms",
  ];

  return [
    ...staticRoutes.map((r) => ({ url: `${site.url}${r}`, lastModified: now })),
    ...products.map((p) => ({ url: `${site.url}/product/${p.slug}`, lastModified: now })),
  ];
}
