/**
 * Server-side CRUD actions for the `rooms` table.
 */

import { prisma } from "@/lib/prisma";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch all rooms for a given home, sorted by sort_order. */
export async function getRoomsByHomeId(homeId: string) {
  return prisma.rooms.findMany({
    where: { home_id: homeId },
    orderBy: { sort_order: "asc" },
  });
}

/** Fetch a single room by UUID. */
export async function getRoomById(id: string) {
  return prisma.rooms.findUniqueOrThrow({ where: { id } });
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a new room. */
export async function createRoom(payload: {
  home_id: string;
  name: string;
  code: string;
  floor_label?: string | null;
  sort_order?: number;
}) {
  return prisma.rooms.create({ data: payload });
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update a room by UUID. */
export async function updateRoom(
  id: string,
  payload: {
    home_id?: string;
    name?: string;
    code?: string;
    floor_label?: string | null;
    sort_order?: number;
  },
) {
  return prisma.rooms.update({ where: { id }, data: payload });
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a room by UUID. */
export async function deleteRoom(id: string) {
  await prisma.rooms.delete({ where: { id } });
}
