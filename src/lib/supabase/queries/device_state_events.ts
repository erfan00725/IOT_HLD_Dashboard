/**
 * Server-side CRUD actions for the `device_state_events` table.
 * This is an append-only event log; rows are never updated.
 * Deletion is supported for administrative / data-retention purposes only.
 */

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { TablesInsert } from "@/../database.types";

// ─── Read ────────────────────────────────────────────────────────────────────

/** Fetch state-event history for a device, newest first. */
export async function getDeviceStateEvents(
  deviceExternalKey: string,
  limit = 50,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("device_state_events")
    .select("*")
    .eq("device_external_key", deviceExternalKey)
    .order("observed_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch all events for an entire home within an optional time range. */
export async function getHomeStateEvents(
  homeId: string,
  options?: { from?: string; to?: string; limit?: number },
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let query = supabase
    .from("device_state_events")
    .select("*")
    .eq("home_id", homeId)
    .order("observed_at", { ascending: false })
    .limit(options?.limit ?? 100);

  if (options?.from) query = query.gte("observed_at", options.from);
  if (options?.to) query = query.lte("observed_at", options.to);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ──────────────────────────────────────────────────────────────────

/** Insert a new device state event. */
export async function createDeviceStateEvent(
  payload: TablesInsert<"device_state_events">,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("device_state_events")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Delete ──────────────────────────────────────────────────────────────────

/** Delete a specific event record by its auto-increment id. */
export async function deleteDeviceStateEvent(id: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("device_state_events")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/** Delete all events older than a given ISO timestamp (data-retention helper). */
export async function deleteEventsBefore(homeId: string, before: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("device_state_events")
    .delete()
    .eq("home_id", homeId)
    .lt("observed_at", before);

  if (error) throw new Error(error.message);
}
