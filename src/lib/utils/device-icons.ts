/**
 * Device-type → Lucide icon mapping, shared by device page components.
 *
 * Kept separate from `dashboard-mappers.ts` so the latter can stay free of
 * React/Lucide imports (it is imported from both server and client code).
 *
 * Keys are `device_type_id` values seeded by the schema: presence, switch,
 * lock, item.
 */

import {
  UserRoundCheck,
  Power,
  LockKeyhole,
  KeyRound,
  Cpu,
  Clock,
  Home,
  type LucideIcon,
} from "lucide-react";

/**
 * device_type_id → icon mapping used across dashboard components.
 * Covers the four seeded device types (presence, switch, lock, item).
 */
const DEVICE_TYPE_ICON_MAP: Record<string, LucideIcon> = {
  presence: UserRoundCheck,
  switch: Power,
  lock: LockKeyhole,
  item: KeyRound,
};

/** Returns a Lucide icon for a device type, falling back to `Cpu`. */
export function deviceTypeToIcon(deviceTypeId?: string | null): LucideIcon {
  if (!deviceTypeId) return Cpu;
  return DEVICE_TYPE_ICON_MAP[deviceTypeId] ?? Cpu;
}

/**
 * Maps a device type to a Lucide icon for display in reminder/event rows.
 * Falls back to `Home` for unknown types by default (configurable).
 */
export function deviceTypeToIconOr(
  deviceTypeId?: string | null,
  fallback: LucideIcon = Home,
): LucideIcon {
  if (!deviceTypeId) return fallback;
  return DEVICE_TYPE_ICON_MAP[deviceTypeId] ?? fallback;
}

/** Re-exported here so event rows can fall back to a clock icon. */
export { Clock };

/** Human-readable label for a device type id, e.g. "presence" → "Presence". */
export function deviceTypeLabel(deviceTypeId?: string | null): string {
  if (!deviceTypeId) return "Device";
  return deviceTypeId.charAt(0).toUpperCase() + deviceTypeId.slice(1);
}
