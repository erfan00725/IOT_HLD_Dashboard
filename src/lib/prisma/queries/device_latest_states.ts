/**
 * Server-side CRUD actions for the `device_latest_states` table.
 */

import { prisma } from "@/lib/prisma";
import type { device_status } from "@/generated/prisma/client";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch the latest state for every device in a home. */
export async function getLatestStatesByHomeId(homeId: string) {
  return prisma.device_latest_states.findMany({
    where: { home_id: homeId },
  });
}

/** Fetch the latest state for a single device by its external key. */
export async function getLatestStateByDeviceKey(deviceExternalKey: string) {
  return prisma.device_latest_states.findUniqueOrThrow({
    where: { device_external_key: deviceExternalKey },
  });
}

// ─── Upsert ─────────────────────────────────────────────────────────────────────────────

/**
 * Insert or update the latest state for a device.
 * Conflicts on `device_external_key` (the primary key) are updated in place.
 */
export async function upsertDeviceLatestState(payload: {
  device_external_key: string;
  home_id: string;
  room_id?: string | null;
  state_value?: device_status;
  state_payload?: unknown;
  source?: string;
  last_seen_at?: Date;
}) {
  return prisma.device_latest_states.upsert({
    where: { device_external_key: payload.device_external_key },
    create: payload as never,
    update: payload as never,
  });
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update specific fields of a device's latest state record. */
export async function updateDeviceLatestState(
  deviceExternalKey: string,
  payload: {
    state_value?: device_status;
    state_payload?: unknown;
    last_seen_at?: Date;
  },
) {
  return prisma.device_latest_states.update({
    where: { device_external_key: deviceExternalKey },
    data: payload as never,
  });
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete the latest-state record for a specific device. */
export async function deleteDeviceLatestState(deviceExternalKey: string) {
  await prisma.device_latest_states.delete({
    where: { device_external_key: deviceExternalKey },
  });
}
