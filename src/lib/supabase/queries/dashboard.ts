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
