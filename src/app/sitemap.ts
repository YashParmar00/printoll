import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
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
