/**
 * Server-side CRUD actions for the `device_state_events` table.
 * Rows are treated as an immutable event log — no update function is provided.
 */

import { prisma } from "@/lib/prisma";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch recent state events for a specific device (newest first). */
export async function getDeviceStateEvents(
  deviceExternalKey: string,
  limit = 20,
) {
  return prisma.device_state_events.findMany({
    where: { device_external_key: deviceExternalKey },
    orderBy: { observed_at: "desc" },
    take: limit,
  });
}

/** Fetch all events for a home, optionally filtered by a time range. */
export async function getHomeStateEvents(
  homeId: string,
  opts?: { since?: string; until?: string; limit?: number },
) {
  return prisma.device_state_events.findMany({
    where: {
      home_id: homeId,
      ...(opts?.since
        ? { observed_at: { gte: new Date(opts.since) } }
        : {}),
      ...(opts?.until
        ? { observed_at: { lte: new Date(opts.until) } }
        : {}),
    },
    orderBy: { observed_at: "desc" },
    take: opts?.limit,
  });
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a new device state event. */
export async function createDeviceStateEvent(payload: {
  device_external_key: string;
  home_id: string;
  room_id?: string | null;
  mqtt_topic?: string | null;
  state_value: string;
  payload?: unknown;
  source?: string;
  observed_at?: Date;
}) {
  return prisma.device_state_events.create({ data: payload as never });
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a single event by its ID. */
export async function deleteDeviceStateEvent(id: number) {
  await prisma.device_state_events.delete({
    where: { id: BigInt(id) },
  });
}

/** Delete all events observed before a given ISO timestamp. */
export async function deleteEventsBefore(before: string) {
  await prisma.device_state_events.deleteMany({
    where: { observed_at: { lt: new Date(before) } },
  });
}
