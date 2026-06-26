/**
 * Server-side CRUD actions for the `homes` table.
 */

import { prisma } from "@/lib/prisma";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch all homes, sorted by creation date. */
export async function getHomes() {
  return prisma.homes.findMany({
    orderBy: { created_at: "asc" },
  });
}

/** Fetch a single home by UUID. */
export async function getHomeById(id: string) {
  return prisma.homes.findUniqueOrThrow({ where: { id } });
}

/** Fetch a single home by its URL slug. */
export async function getHomeBySlug(slug: string) {
  return prisma.homes.findUniqueOrThrow({ where: { slug } });
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a new home record. */
export async function createHome(payload: {
  owner_id: string;
  name: string;
  slug: string;
}) {
  return prisma.homes.create({ data: payload });
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update a home by UUID. */
export async function updateHome(
  id: string,
  payload: {
    owner_id?: string;
    name?: string;
    slug?: string;
  },
) {
  return prisma.homes.update({ where: { id }, data: payload });
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a home by UUID. */
export async function deleteHome(id: string) {
  await prisma.homes.delete({ where: { id } });
}
