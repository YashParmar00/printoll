The temporary catalogue contains five products each in Men, Women, Matching,
and Gifts & More. All twenty items are printable: men's graphic oversized tees,
women's graphic tees, matching tees and printed canvas totes. Regular shirts,
frocks and branded handbags are no longer active. Each product has one reference photo stored locally in
public/uploads/catalog. Original pages and image URLs are recorded in
catalog-photo-sources.json. These are sample listings, not verified Printoll
inventory or supplier photos; prices and supplier SKUs are placeholders.
Reference artwork belongs to its original seller; this selection describes
printable product concepts, not ownership of those designs or verified stock.

Selection research, 14 September 2026:
- [Nobero's 2026 guide](https://nobero.com/blogs/oversized-tshirts/trendy-oversized-tshirt-designs-men-india-nobero)
  supports oversized graphic tees, bold back prints and travel artwork as Indian retail directions.
- [Qikink's best-selling POD range](https://qikink.com/custom/collections/best-sellers/)
  includes oversized tees and canvas totes, confirming suitable printable formats.
- [WYO printed women's tees](https://wyo.in/products/always-cherryishing-women-t-shirt)
  and [Patrah printed totes](https://patrah.com/products/book-and-coffee-canvas-tote-bag)
  supply Indian retail references for playful graphics and book/coffee themes.
These are retail signals and editorial choices, not independently measured market rankings.

Best Sellers, Top Picks and Trending are manually curated sample selections,
three products each, controlled by the product Badge field in admin. They do
not derive from sales analytics. Unbadged products appear only in the shop.

Run `npm run db:replace` to install this catalogue and deactivate
previous products. Replacement writes a local product backup to the ignored
.data/catalog-backups directory first. Product changes are transactional;
historical products, orders and reviews are preserved. Ordinary seeding does
not deactivate unrelated products.

Photo preparation is reproducible with `node scripts/prepare-sample-catalog.mjs`.
