/**
 * Server-side CRUD actions for the `device_state_events` table.
 * Rows are treated as an immutable event log — no update function is provided.
 */

import { createClient } from "@/lib/supabase/server";
import { TablesInsert } from "@/lib/types/database.types";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch recent state events for a specific device (newest first). */
export async function getDeviceStateEvents(
  deviceExternalKey: string,
  limit = 20,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("device_state_events")
    .select("*")
    .eq("device_external_key", deviceExternalKey)
    .order("observed_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch all events for a home, optionally filtered by a time range. */
export async function getHomeStateEvents(
  homeId: string,
  opts?: { since?: string; until?: string; limit?: number },
) {
  const supabase = await createClient();

  let query = supabase
    .from("device_state_events")
    .select("*")
    .eq("home_id", homeId)
    .order("observed_at", { ascending: false });

  if (opts?.since) query = query.gte("observed_at", opts.since);
  if (opts?.until) query = query.lte("observed_at", opts.until);
  if (opts?.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a new device state event. */
export async function createDeviceStateEvent(
  payload: TablesInsert<"device_state_events">,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("device_state_events")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a single event by its ID. */
export async function deleteDeviceStateEvent(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("device_state_events")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/** Delete all events observed before a given ISO timestamp. */
export async function deleteEventsBefore(before: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("device_state_events")
    .delete()
    .lt("observed_at", before);

  if (error) throw new Error(error.message);
}
