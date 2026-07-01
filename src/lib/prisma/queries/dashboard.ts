/**
 * Dashboard-specific query helpers.
 * All functions are server-only — they rely on the Prisma client.
 */

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/supabase/server";
import { nextCache } from "@/lib/utils/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Home Status Section
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the latest state for every device in a home.
 * Mapped to match the shape consumers expect: `{ device_external_key, state_value,
 * last_seen_at, devices: { name, category, expected_safe_state, active } }[]`
 */
export async function getDashboardDeviceStates(homeId: string) {
  const rows = await prisma.device_latest_states.findMany({
    where: { home_id: homeId },
    include: { devices: true },
  });

  return rows.map((row) => ({
    device_external_key: row.device_external_key,
    state_value: row.state_value,
    last_seen_at: row.last_seen_at.toISOString(),
    devices: row.devices
      ? {
          name: row.devices.name,
          category: row.devices.category as string,
          expected_safe_state: row.devices.expected_safe_state as string,
          active: row.devices.active,
        }
      : null,
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
 * Returns all active reminder rules for a home, ordered by severity desc.
 * Mapped to match: `{ id, reminder_text, severity, device_external_key,
 *   devices: { name, category }, created_at }[]`
 */
export async function getActiveReminderRulesForDashboard(homeId: string) {
  const rules = await prisma.reminder_rules.findMany({
    where: { home_id: homeId, active: true },
    orderBy: { severity: "desc" },
    take: 5,
    include: { devices: true },
  });

  return rules.map((rule) => ({
    id: rule.id,
    reminder_text: rule.reminder_text,
    severity: rule.severity,
    device_external_key: rule.device_external_key,
    devices: rule.devices
      ? {
          name: rule.devices.name,
          category: rule.devices.category as string,
        }
      : null,
    created_at: rule.created_at.toISOString(),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Recent Leave Events  (device_state_events log)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the 5 most recent device state events for a home.
 * Mapped to match: `{ id, device_external_key, state_value, observed_at,
 *   devices: { name, category } }[]`
 */
export async function getRecentStateEventsForDashboard(homeId: string) {
  const events = await nextCache(
    async () => {
      const events = await prisma.device_state_events.findMany({
        where: { home_id: homeId },
        orderBy: { observed_at: "desc" },
        take: 5,
        include: { devices: true },
      });

      return events.map((ev) => ({
        id: Number(ev.id),
        device_external_key: ev.device_external_key,
        state_value: ev.state_value,
        observed_at: ev.observed_at.toISOString(),
        devices: ev.devices
          ? {
              name: ev.devices.name,
              category: ev.devices.category as string,
            }
          : null,
      }));
    },
    homeId,
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
 * Mapped to match: `{ id, reminder_text, severity, active, trigger_presence_state,
 *   trigger_device_state, device_external_key,
 *   devices: { name, category } }[]`
 */
export async function getAllRulesForAutomationTable(homeId: string) {
  const rules = await prisma.reminder_rules.findMany({
    where: { home_id: homeId },
    orderBy: { severity: "desc" },
    include: { devices: true },
  });

  return rules.map((rule) => ({
    id: rule.id,
    reminder_text: rule.reminder_text,
    severity: rule.severity,
    active: rule.active,
    trigger_presence_state: rule.trigger_presence_state,
    trigger_device_state: rule.trigger_device_state,
    device_external_key: rule.device_external_key,
    devices: rule.devices
      ? {
          name: rule.devices.name,
          category: rule.devices.category as string,
        }
      : null,
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
  trigger_device_state: string;
  device_external_key: string;
  devices: { name: string; category: string } | null;
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
    where: { home_id: homeId },
    orderBy: [{ severity: "desc" }, { created_at: "desc" }],
    include: { devices: true },
  });

  return rules.map((rule) => ({
    id: rule.id,
    reminder_text: rule.reminder_text,
    severity: rule.severity,
    active: rule.active,
    trigger_presence_state: rule.trigger_presence_state,
    trigger_device_state: rule.trigger_device_state,
    device_external_key: rule.device_external_key,
    devices: rule.devices
      ? {
          name: rule.devices.name,
          category: rule.devices.category as string,
        }
      : null,
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
  category: string;
  active: boolean;
  reminder_enabled: boolean;
  expected_safe_state: string;
  metadata: Record<string, unknown> | null;
  room_name: string | null;
  room_code: string | null;
  state_value: string | null;
  last_seen_at: string | null;
}

/**
 * Returns every device in a home joined with its room and its latest reported
 * state. Ordered by category, then name.
 * Replaces the `v_device_inventory` view + separate state fetch with Prisma joins.
 */
export async function getDevicesPageData(
  homeId: string,
): Promise<DevicesPageDevice[]> {
  const devices = await prisma.devices.findMany({
    where: { home_id: homeId },
    include: {
      rooms: true,
      device_latest_states: true,
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  if (devices.length === 0) return [];

  return devices.map((d) => {
    const state = d.device_latest_states;
    return {
      id: d.id,
      external_key: d.external_key,
      name: d.name,
      category: d.category as string,
      active: d.active,
      reminder_enabled: d.reminder_enabled,
      expected_safe_state: d.expected_safe_state as string,
      metadata: d.metadata as Record<string, unknown> | null,
      room_name: d.rooms?.name ?? null,
      room_code: d.rooms?.code ?? null,
      state_value: state?.state_value ?? null,
      last_seen_at: state?.last_seen_at?.toISOString() ?? null,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Events page
// ─────────────────────────────────────────────────────────────────────────────

export interface EventsPageEvent {
  id: number;
  device_external_key: string;
  state_value: string;
  observed_at: string;
  device_name: string;
  device_category: string;
  room_name: string | null;
  room_code: string | null;
}

/**
 * Returns the most recent device state events for a home (newest first),
 * joined with the device's name, category and room.
 */
export async function getEventsPageData(
  homeId: string,
  limit = 200,
): Promise<EventsPageEvent[]> {
  const events = await prisma.device_state_events.findMany({
    where: { home_id: homeId },
    orderBy: { observed_at: "desc" },
    take: limit,
    include: {
      devices: { include: { rooms: true } },
    },
  });

  return events.map((row) => ({
    id: Number(row.id),
    device_external_key: row.device_external_key,
    state_value: row.state_value,
    observed_at: row.observed_at.toISOString(),
    device_name: row.devices?.name ?? "Unknown device",
    device_category: (row.devices?.category as string) ?? "utility",
    room_name: row.devices?.rooms?.name ?? null,
    room_code: row.devices?.rooms?.code ?? null,
  }));
}
