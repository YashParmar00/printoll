// Reproduce the curated printed-product sample catalogue from its source manifest.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const references = JSON.parse(await readFile("docs/catalog-photo-sources.json", "utf8"));
const products = [];
await mkdir("public/uploads/catalog", { recursive: true });
for (const { slug, name, category, price, tagline, badge, image } of references) {
  const response = await fetch(image, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Photo failed: ${response.status} ${slug}`);
  await sharp(Buffer.from(await response.arrayBuffer()))
    .resize({ width: 1000, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 }).toFile(`public/uploads/catalog/${slug}.webp`);
  products.push({ slug, name, category, price, tagline, badge, imageUrl: `/uploads/catalog/${slug}.webp` });
  console.log(`Prepared ${slug}`);
}
for (const category of ["men", "women", "matching", "gifts-more"]) {
  if (products.filter(product => product.category === category).length !== 5) throw new Error(`Expected five ${category} products`);
}
await writeFile("src/lib/sample-catalog.json", JSON.stringify(products, null, 2) + "\n");
