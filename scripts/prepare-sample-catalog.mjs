// Reproduce the curated printed-product sample catalogue from its source manifest.
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const references = JSON.parse(await readFile("docs/catalog-photo-sources.json", "utf8"));
const products = [];
await mkdir("public/uploads/catalog", { recursive: true });
for (const { slug, name, category, price, tagline, badge, image, shape } of references) {
  const cached = await access(`public/uploads/catalog/${slug}.webp`).then(() => true, () => false);
  if (!cached) {
  // Wikimedia Commons rejects requests without a descriptive User-Agent.
  const response = await fetch(image, { headers: { "User-Agent": "AuraaMartsCatalog/1.0 (hello@auraamarts.com)" }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Photo failed: ${response.status} ${slug}`);
  await sharp(Buffer.from(await response.arrayBuffer()))
    .resize({ width: 1000, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 }).toFile(`public/uploads/catalog/${slug}.webp`);
  }
  products.push({ slug, name, category, price, tagline, badge, shape: shape ?? "tee", imageUrl: `/uploads/catalog/${slug}.webp` });
  console.log(`Prepared ${slug}`);
}
for (const category of ["men", "women", "matching"]) {
  if (products.filter(product => product.category === category).length !== 5) throw new Error(`Expected five ${category} products`);
}
for (const shape of ["mug", "bottle", "tote", "phone-case"]) {
  if (products.filter(product => product.category === "gifts-more" && product.shape === shape).length !== 3) throw new Error(`Expected three ${shape} gifts`);
}
const paintings = products.filter(product => product.category === "paintings").length;
if (paintings < 5 || paintings > 10) throw new Error(`Expected 5-10 paintings, found ${paintings}`);
await writeFile("src/lib/sample-catalog.json", JSON.stringify(products, null, 2) + "\n");
