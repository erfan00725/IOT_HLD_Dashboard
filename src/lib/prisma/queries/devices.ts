/**
 * Server-side CRUD actions for the `devices` table.
 *
 * Devices are typed via `device_type_id` (presence/switch/lock/item). Their
 * "safe" state is referenced by `safe_device_type_state_id` →
 * `device_type_states.id`.
 */

import { prisma } from "@/lib/prisma";

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

/** Fetch all devices of a given device type in a home. */
export async function getDevicesByType(homeId: string, deviceTypeId: string) {
  return prisma.devices.findMany({
    where: { home_id: homeId, device_type_id: deviceTypeId },
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

/** Fetch all known device type states. */
export async function getAllDeviceTypeStates() {
  return prisma.device_type_states.findMany({
    orderBy: [{ device_type_id: "asc" }, { state_key: "asc" }],
  });
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a new device. */
export async function createDevice(payload: {
  home_id: string;
  room_id?: string | null;
  device_type_id: string;
  external_key: string;
  name: string;
  safe_device_type_state_id?: number | null;
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
    device_type_id?: string;
    external_key?: string;
    name?: string;
    safe_device_type_state_id?: number | null;
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
