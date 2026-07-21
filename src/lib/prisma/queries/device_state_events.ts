/**
 * Server-side CRUD actions for the `device_state_events` table.
 * Rows are treated as an immutable event log — no update function is provided.
 *
 * Events are keyed by `device_id` and reference the concrete state through
 * `device_type_state_id` → `device_type_states.id`.
 */

import { prisma } from "@/lib/prisma";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch recent state events for a specific device (newest first). */
export async function getDeviceStateEvents(deviceId: string, limit = 20) {
  return prisma.device_state_events.findMany({
    where: { device_id: deviceId },
    orderBy: { observed_at: "desc" },
    take: limit,
    include: { device_type_states: true },
  });
}

/** Fetch all events for a home, optionally filtered by a time range. */
export async function getHomeStateEvents(
  homeId: string,
  opts?: { since?: string; until?: string; limit?: number },
) {
  return prisma.device_state_events.findMany({
    where: {
      devices: { home_id: homeId },
      ...(opts?.since ? { observed_at: { gte: new Date(opts.since) } } : {}),
      ...(opts?.until ? { observed_at: { lte: new Date(opts.until) } } : {}),
    },
    orderBy: { observed_at: "desc" },
    take: opts?.limit,
    include: { device_type_states: true },
  });
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a new device state event. */
export async function createDeviceStateEvent(payload: {
  device_id: string;
  device_type_state_id: number;
  mqtt_topic?: string | null;
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
