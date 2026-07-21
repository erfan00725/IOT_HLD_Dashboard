/**
 * Server-side CRUD actions for the `device_latest_states` table.
 *
 * Each row is the current state of one device, keyed by `device_id` (PK).
 * The concrete state value is referenced by `device_type_state_id` →
 * `device_type_states.id`.
 */

import { prisma } from "@/lib/prisma";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch the latest state for every device in a home. */
export async function getLatestStatesByHomeId(homeId: string) {
  return prisma.device_latest_states.findMany({
    where: { devices: { home_id: homeId } },
    include: { device_type_states: true },
  });
}

/** Fetch the latest state for a single device by its UUID. */
export async function getLatestStateByDeviceId(deviceId: string) {
  return prisma.device_latest_states.findUniqueOrThrow({
    where: { device_id: deviceId },
    include: { device_type_states: true },
  });
}

// ─── Upsert ─────────────────────────────────────────────────────────────────────────────

/**
 * Insert or update the latest state for a device.
 * Conflicts on `device_id` (the primary key) are updated in place.
 */
export async function upsertDeviceLatestState(payload: {
  device_id: string;
  device_type_state_id: number;
  source?: string;
  last_seen_at?: Date;
}) {
  return prisma.device_latest_states.upsert({
    where: { device_id: payload.device_id },
    create: payload as never,
    update: payload as never,
  });
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update specific fields of a device's latest state record. */
export async function updateDeviceLatestState(
  deviceId: string,
  payload: {
    device_type_state_id?: number;
    source?: string;
    last_seen_at?: Date;
  },
) {
  return prisma.device_latest_states.update({
    where: { device_id: deviceId },
    data: payload as never,
  });
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete the latest-state record for a specific device. */
export async function deleteDeviceLatestState(deviceId: string) {
  await prisma.device_latest_states.delete({
    where: { device_id: deviceId },
  });
}
