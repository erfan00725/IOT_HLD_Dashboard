import { device_type_states } from "./../../../generated/prisma/browser";
/**
 * Dashboard-specific query helpers.
 * All functions are server-only — they rely on the Prisma client.
 *
 * These queries target the normalized, typed-state schema:
 *   - A device's current state lives in `device_latest_states`, keyed by
 *     `device_id`, and its human value comes from the joined
 *     `device_type_states.state_key` (+ `is_safe_state`).
 *   - Devices no longer carry a `category` enum or `expected_safe_state`; the
 *     UI keys off `device_type_id` (presence/switch/lock/item) and reads the
 *     safe state from the joined `device_type_states`.
 *   - State/event/rule tables have no `home_id`; ownership is scoped through
 *     the `devices` relation (`devices.home_id`).
 */

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/supabase/server";
import { nextCache } from "@/lib/utils/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Home Status Section
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the latest state for every device in a home that has reported one.
 * Mapped to: `{ external_key, state_key, is_safe_state, last_seen_at,
 *   devices: { name, device_type_id, device_type_label, active } }[]`
 */
export async function getDashboardDeviceStates(homeId: string) {
  const rows = await prisma.device_latest_states.findMany({
    where: { devices: { home_id: homeId } },
    include: {
      devices: { include: { device_types: true } },
      device_type_states: true,
    },
  });

  return rows.map((row) => ({
    external_key: row.devices.external_key,
    state_key: row.device_type_states?.state_key ?? null,
    is_safe_state: row.device_type_states?.is_safe_state ?? null,
    last_seen_at: row.last_seen_at.toISOString(),
    devices: {
      name: row.devices.name,
      device_type_id: row.devices.device_type_id,
      device_type_label: row.devices.device_types.label,
      active: row.devices.active,
    },
  }));
}

/**
 * Returns the most recent active (open) leave session for a home, or null.
 */
export async function getActiveLeaveSessionForDashboard(homeId: string) {
  const session = await prisma.leave_sessions.findFirst({
    where: { home_id: homeId, ended_at: null },
    orderBy: { started_at: "desc" },
  });

  if (!session) return null;

  return {
    id: session.id,
    started_at: session.started_at.toISOString(),
    ended_at: session.ended_at?.toISOString() ?? null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Active Reminders
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns active reminder rules for a home whose triggering state currently
 * matches the device's latest reported state.
 * Mapped to: `{ id, reminder_text, severity, external_key,
 *   devices: { name, device_type_id, device_type_label }, created_at }[]`
 */
export async function getActiveReminderRulesForDashboard(homeId: string) {
  const deviceStates = await getDashboardDeviceStates(homeId);

  const rules = await prisma.reminder_rules.findMany({
    where: { devices: { home_id: homeId }, active: true },
    orderBy: { severity: "desc" },
    take: 5,
    include: {
      devices: { include: { device_types: true } },
      device_type_states: true,
    },
  });

  const validRules = rules.filter((rule) => {
    const matchingDevice = deviceStates.find(
      (device) => device.external_key === rule.devices.external_key,
    );
    if (!matchingDevice) return false;
    return matchingDevice.state_key === rule.device_type_states.state_key;
  });

  return validRules.map((rule) => ({
    id: rule.id,
    reminder_text: rule.reminder_text,
    severity: rule.severity,
    external_key: rule.devices.external_key,
    devices: {
      name: rule.devices.name,
      device_type_id: rule.devices.device_type_id,
      device_type_label: rule.devices.device_types.label,
    },
    created_at: rule.created_at.toISOString(),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Recent Leave Events  (device_state_events log)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the 5 most recent device state events for a home.
 * Mapped to: `{ id, external_key, state_key, observed_at,
 *   devices: { name, device_type_id, device_type_label } }[]`
 */
export async function getRecentStateEventsForDashboard(homeId: string) {
  const events = await nextCache(
    async () => {
      const events = await prisma.device_state_events.findMany({
        where: { devices: { home_id: homeId } },
        orderBy: { observed_at: "desc" },
        take: 5,
        include: {
          devices: { include: { device_types: true } },
          device_type_states: true,
        },
      });

      return events.map((ev) => ({
        id: Number(ev.id),
        external_key: ev.devices.external_key,
        state_key: ev.device_type_states?.state_key ?? null,
        observed_at: ev.observed_at.toISOString(),
        devices: {
          name: ev.devices.name,
          device_type_id: ev.devices.device_type_id,
          device_type_label: ev.devices.device_types.label,
        },
      }));
    },
    `recent-state-events-${homeId}`,
    60,
  );

  return events;
}

// ─────────────────────────────────────────────────────────────────────────────
// Automation Rules (reminder_rules shown as automation table)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all reminder rules for the automation rules table.
 * Includes device info for icon/colour resolution.
 * Mapped to: `{ id, reminder_text, severity, active, trigger_presence_state,
 *   trigger_state_key, external_key,
 *   devices: { name, device_type_id, device_type_label } }[]`
 */
export async function getAllRulesForAutomationTable(homeId: string) {
  const rules = await prisma.reminder_rules.findMany({
    where: { devices: { home_id: homeId } },
    orderBy: { severity: "desc" },
    include: {
      devices: { include: { device_types: true } },
      device_type_states: true,
    },
  });

  return rules.map((rule) => ({
    id: rule.id,
    reminder_text: rule.reminder_text,
    severity: rule.severity,
    active: rule.active,
    trigger_presence_state: rule.trigger_presence_state,
    trigger_state_key: rule.device_type_states.state_key,
    external_key: rule.devices.external_key,
    devices: {
      name: rule.devices.name,
      device_type_id: rule.devices.device_type_id,
      device_type_label: rule.devices.device_types.label,
    },
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Reminders page
// ─────────────────────────────────────────────────────────────────────────────

export interface RemindersPageRule {
  id: string;
  reminder_text: string;
  severity: number;
  active: boolean;
  trigger_presence_state: string | null;
  trigger_state_key: string;
  external_key: string;
  devices: {
    id: string;
    name: string;
    device_type_id: string;
    device_type_label: string;
  } | null;
  device_type_states: {
    id: bigint;
    device_type_id: string;
    state_key: string;
    label: string;
    is_safe_state: boolean | null;
  }[];
  trigger_device_type_state_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * Returns every reminder rule for a home, joined with the linked device.
 * Ordered by severity desc, then created_at desc.
 * Used by the full /reminders page.
 */
export async function getRemindersPageData(
  homeId: string,
): Promise<RemindersPageRule[]> {
  const rules = await prisma.reminder_rules.findMany({
    where: { devices: { home_id: homeId } },
    orderBy: [{ severity: "desc" }, { created_at: "desc" }],
    include: {
      devices: {
        include: { device_types: { include: { device_type_states: true } } },
      },
      device_type_states: true,
    },
  });

  return rules.map((rule) => ({
    id: rule.id,
    reminder_text: rule.reminder_text,
    severity: rule.severity,
    active: rule.active,
    trigger_presence_state: rule.trigger_presence_state,
    trigger_state_key: rule.device_type_states.state_key,
    external_key: rule.devices.external_key,
    devices: {
      id: rule.devices.id,
      name: rule.devices.name,
      device_type_id: rule.devices.device_type_id,
      device_type_label: rule.devices.device_types.label,
      type_id: rule.devices.device_type_id,
    },
    device_type_states: rule.devices.device_types.device_type_states,
    trigger_device_type_state_id: Number(rule.trigger_device_type_state_id),
    created_at: rule.created_at.toISOString(),
    updated_at: rule.updated_at.toISOString(),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// First home helper  (used as a fallback until multi-home routing is wired)
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the first home for the current authenticated user. */
export async function getFirstHome() {
  const user = await getCurrentUserOrThrow();

  const home = await nextCache(
    async () =>
      prisma.homes.findFirst({
        where: { owner_id: user.id },
        orderBy: { created_at: "asc" },
      }),
    user.id,
    20,
  );

  if (!home) return null;

  return {
    id: home.id,
    name: home.name,
    slug: home.slug,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Devices page
// ─────────────────────────────────────────────────────────────────────────────

export interface DevicesPageDevice {
  id: string;
  external_key: string;
  name: string;
  device_type_id: string;
  device_type_label: string;
  active: boolean;
  reminder_enabled: boolean;
  safe_state_key: string | null;
  is_safe_state: boolean | null;
  metadata: Record<string, unknown> | null;
  room_name: string | null;
  room_code: string | null;
  state_key: string | null;
  last_seen_at: string | null;
}

/**
 * Returns every device in a home joined with its type, room, safe state and
 * its latest reported state. Ordered by device type, then name.
 */
export async function getDevicesPageData(
  homeId: string,
): Promise<DevicesPageDevice[]> {
  const devices = await prisma.devices.findMany({
    where: { home_id: homeId },
    include: {
      device_types: true,
      device_type_states: true, // safe_device_type_state_id → safe state
      rooms: true,
      device_latest_states: { include: { device_type_states: true } },
    },
    orderBy: [{ device_type_id: "asc" }, { name: "asc" }],
  });

  if (devices.length === 0) return [];

  return devices.map((d) => {
    const latest = d.device_latest_states;
    return {
      id: d.id,
      external_key: d.external_key,
      name: d.name,
      device_type_id: d.device_type_id,
      device_type_label: d.device_types.label,
      active: d.active,
      reminder_enabled: d.reminder_enabled,
      safe_state_key: d.device_type_states?.state_key ?? null,
      is_safe_state: latest?.device_type_states?.is_safe_state ?? null,
      metadata: d.metadata as Record<string, unknown> | null,
      room_name: d.rooms?.name ?? null,
      room_code: d.rooms?.code ?? null,
      state_key: latest?.device_type_states?.state_key ?? null,
      last_seen_at: latest?.last_seen_at?.toISOString() ?? null,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Events page
// ─────────────────────────────────────────────────────────────────────────────

export interface EventsPageEvent {
  id: number;
  external_key: string;
  state_key: string | null;
  observed_at: string;
  device_name: string;
  device_type_id: string;
  device_type_label: string;
  room_name: string | null;
  room_code: string | null;
}

/**
 * Returns the most recent device state events for a home (newest first),
 * joined with the device's name, type and room.
 */
export async function getEventsPageData(
  homeId: string,
  limit = 200,
): Promise<EventsPageEvent[]> {
  const events = await prisma.device_state_events.findMany({
    where: { devices: { home_id: homeId } },
    orderBy: { observed_at: "desc" },
    take: limit,
    include: {
      devices: { include: { rooms: true, device_types: true } },
      device_type_states: true,
    },
  });

  return events.map((row) => ({
    id: Number(row.id),
    external_key: row.devices.external_key,
    state_key: row.device_type_states?.state_key ?? null,
    observed_at: row.observed_at.toISOString(),
    device_name: row.devices.name ?? "Unknown device",
    device_type_id: row.devices.device_type_id,
    device_type_label: row.devices.device_types.label,
    room_name: row.devices.rooms?.name ?? null,
    room_code: row.devices.rooms?.code ?? null,
  }));
}
