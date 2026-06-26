/**
 * Server-side CRUD actions for the `devices` table.
 */

import { prisma } from "@/lib/prisma";
import type { device_category, device_status } from "@/generated/prisma/client";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch all devices for a given home. */
export async function getDevicesByHomeId(homeId: string) {
  return prisma.devices.findMany({
    where: { home_id: homeId },
    orderBy: { name: "asc" },
  });
}

/** Fetch devices belonging to a specific room. */
export async function getDevicesByRoomId(roomId: string) {
  return prisma.devices.findMany({
    where: { room_id: roomId },
    orderBy: { name: "asc" },
  });
}

/** Fetch all devices of a given category in a home. */
export async function getDevicesByCategory(
  homeId: string,
  category: device_category,
) {
  return prisma.devices.findMany({
    where: { home_id: homeId, category },
  });
}

/** Fetch a single device by its UUID. */
export async function getDeviceById(id: string) {
  return prisma.devices.findUniqueOrThrow({ where: { id } });
}

/** Fetch a single device by its external MQTT key. */
export async function getDeviceByExternalKey(externalKey: string) {
  return prisma.devices.findUniqueOrThrow({
    where: { external_key: externalKey },
  });
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a new device. */
export async function createDevice(payload: {
  home_id: string;
  room_id?: string | null;
  external_key: string;
  name: string;
  category: device_category;
  expected_safe_state?: device_status;
  reminder_enabled?: boolean;
  active?: boolean;
  metadata?: unknown;
}) {
  return prisma.devices.create({ data: payload as never });
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update a device by its UUID. */
export async function updateDevice(
  id: string,
  payload: {
    home_id?: string;
    room_id?: string | null;
    external_key?: string;
    name?: string;
    category?: device_category;
    expected_safe_state?: device_status;
    reminder_enabled?: boolean;
    active?: boolean;
    metadata?: unknown;
  },
) {
  return prisma.devices.update({ where: { id }, data: payload as never });
}

/** Toggle the `active` field of a device. */
export async function toggleDeviceActive(id: string, active: boolean) {
  return updateDevice(id, { active });
}

/** Toggle the `reminder_enabled` field of a device. */
export async function toggleDeviceReminder(
  id: string,
  reminderEnabled: boolean,
) {
  return updateDevice(id, { reminder_enabled: reminderEnabled });
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a device by its UUID. */
export async function deleteDevice(id: string) {
  await prisma.devices.delete({ where: { id } });
}
