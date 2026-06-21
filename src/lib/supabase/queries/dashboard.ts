/**
 * Dashboard-specific query helpers.
 * All functions are server-only — they rely on `createClient` from server.ts.
 */

import { createClient } from "@/lib/supabase/server";

// ─────────────────────────────────────────────────────────────────────────────
// Home Status Section
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the latest state for every device in a home.
 * Joined with the `devices` table so the caller has name + category.
 */
export async function getDashboardDeviceStates(homeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("device_latest_states")
    .select(
      `device_external_key, state_value, last_seen_at,
       devices!inner(name, category, expected_safe_state, active)`,
    )
    .eq("home_id", homeId);

  console.log(data);

  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Returns the most recent active (open) leave session for a home, or null.
 */
export async function getActiveLeaveSessionForDashboard(homeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leave_sessions")
    .select("id, started_at, ended_at")
    .eq("home_id", homeId)
    .is("ended_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// Active Reminders
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all active reminder rules for a home, ordered by severity desc.
 */
export async function getActiveReminderRulesForDashboard(homeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminder_rules")
    .select(
      `id, reminder_text, severity, device_external_key,
       devices!inner(name, category), created_at`,
    )
    .eq("home_id", homeId)
    .eq("active", true)
    .order("severity", { ascending: false })
    .limit(5);

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Recent Leave Events  (device_state_events log)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the 5 most recent device state events for a home.
 * Joined with `devices` for a human-readable name.
 */
export async function getRecentStateEventsForDashboard(homeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("device_state_events")
    .select(
      `id, device_external_key, state_value, observed_at,
       devices!inner(name, category)`,
    )
    .eq("home_id", homeId)
    .order("observed_at", { ascending: false })
    .limit(5);

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Automation Rules (reminder_rules shown as automation table)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all reminder rules for the automation rules table.
 * Includes device info for icon/colour resolution.
 */
export async function getAllRulesForAutomationTable(homeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminder_rules")
    .select(
      `id, reminder_text, severity, active,
       trigger_presence_state, trigger_device_state,
       device_external_key,
       devices!inner(name, category)`,
    )
    .eq("home_id", homeId)
    .order("severity", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─────────────────────────────────────────────────────────────────────────────
// First home helper  (used as a fallback until multi-home routing is wired)
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the first home for the current authenticated user. */
export async function getFirstHome() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("homes")
    .select("id, name, slug")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
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
 * Returns every device in a home joined with its room (via the
 * `v_device_inventory` view) and its latest reported state.
 * Ordered by category, then name.
 */
export async function getDevicesPageData(
  homeId: string,
): Promise<DevicesPageDevice[]> {
  const supabase = await createClient();

  const { data: inventory, error: invError } = await supabase
    .from("v_device_inventory")
    .select(
      "id, external_key, device_name, device_category, active, reminder_enabled, expected_safe_state, metadata, room_name, room_code",
    )
    .eq("home_id", homeId)
    .order("device_category", { ascending: true })
    .order("device_name", { ascending: true });

  if (invError) throw new Error(invError.message);
  if (!inventory || inventory.length === 0) return [];

  // Fetch latest states for all devices in one round-trip.
  const { data: states, error: stError } = await supabase
    .from("device_latest_states")
    .select("device_external_key, state_value, last_seen_at")
    .eq("home_id", homeId);

  if (stError) throw new Error(stError.message);

  const stateByKey = new Map(
    (states ?? []).map((s) => [s.device_external_key, s]),
  );

  return inventory.map((d) => {
    const state = stateByKey.get(d.external_key);
    return {
      id: d.id ?? "",
      external_key: d.external_key ?? "",
      name: d.device_name ?? "Unnamed device",
      category: d.device_category ?? "utility",
      active: d.active ?? false,
      reminder_enabled: d.reminder_enabled ?? false,
      expected_safe_state: d.expected_safe_state ?? "",
      metadata: d.metadata as Record<string, unknown> | null,
      room_name: d.room_name,
      room_code: d.room_code,
      state_value: state?.state_value ?? null,
      last_seen_at: state?.last_seen_at ?? null,
    };
  });
}
