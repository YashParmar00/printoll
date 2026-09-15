import { unstable_cache } from "next/cache";
import { Prisma, type HomeCollection as DbHomeCollection } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type HomeCollection = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  href: string;
  active: boolean;
  sortOrder: number;
};

// These also provide a polished first render before the database has been
// migrated and seeded. Run `npm run db:push` then `npm run db:seed` to make
// the same four cards editable from the admin area.
export const defaultHomeCollections: HomeCollection[] = [
  {
    id: "mens",
    title: "Men",
    description: "Easy everyday prints made for his style.",
    imageUrl: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=900",
    href: "/category?category=men",
    active: true,
    sortOrder: 0,
  },
  {
    id: "womens",
    title: "Women",
    description: "Comfort-first prints with a personal touch.",
    imageUrl: "https://images.pexels.com/photos/3225889/pexels-photo-3225889.jpeg?auto=compress&cs=tinysrgb&w=900",
    href: "/category?category=women",
    active: true,
    sortOrder: 1,
  },
  {
    id: "pairwear",
    title: "Matching",
    description: "Made-to-match styles for your favourite people.",
    imageUrl: "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=900",
    href: "/category?category=matching",
    active: true,
    sortOrder: 2,
  },
  {
    id: "paintings",
    title: "Paintings",
    description: "Art prints and paintings for a space that feels like you.",
    href: "/category?category=paintings",
    active: true,
    sortOrder: 3,
  },
  {
    id: "others",
    title: "Gifts & More",
    description: "Thoughtful prints for every occasion and person.",
    imageUrl: "https://images.pexels.com/photos/5704849/pexels-photo-5704849.jpeg?auto=compress&cs=tinysrgb&w=900",
    href: "/category?category=gifts-more",
    active: true,
    sortOrder: 4,
  },
];

function toHomeCollection(row: DbHomeCollection): HomeCollection {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.imageUrl ?? undefined,
    href: row.href,
    active: row.active,
    sortOrder: row.sortOrder,
  };
}

async function readHomeCollections(includeInactive = false): Promise<HomeCollection[]> {
  if (!includeInactive && (process.env.CATALOG_SOURCE ?? "static") !== "db") return defaultHomeCollections;
  const rows = await prisma.homeCollection.findMany({ where: includeInactive ? undefined : { active: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return rows.map(toHomeCollection);
}
const cachedCollections = unstable_cache(() => readHomeCollections(), ["collections-v3", process.env.CATALOG_SOURCE ?? "static"], { tags: ["collections"], revalidate: 300 });
export const listHomeCollections = (includeInactive = false) => includeInactive ? readHomeCollections(true) : cachedCollections();
export async function findHomeCollection(id: string) {
  const row = await prisma.homeCollection.findUnique({ where: { id } });
  return row ? toHomeCollection(row) : undefined;
}

export type HomeCollectionInput = Omit<HomeCollection, "id">;

export async function saveHomeCollection(id: string | undefined, input: HomeCollectionInput) {
  const data = {
    title: input.title,
    description: input.description,
    imageUrl: input.imageUrl ?? null,
    href: input.href,
    active: input.active,
    sortOrder: input.sortOrder,
  } satisfies Prisma.HomeCollectionUncheckedCreateInput;
  return id
    ? prisma.homeCollection.upsert({ where: { id }, update: data, create: { id, ...data } })
    : prisma.homeCollection.create({ data });
}

export async function deleteHomeCollection(id: string) {
  return prisma.homeCollection.delete({ where: { id } });
}
