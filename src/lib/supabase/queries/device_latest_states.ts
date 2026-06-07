/**
 * Server-side CRUD actions for the `device_latest_states` table.
 * This table uses `device_external_key` as its primary key (one row per device).
 * Inserts are typically upserts performed by Node-RED / the IoT pipeline.
 */

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { TablesInsert, TablesUpdate } from "@/../database.types";

// ─── Read ────────────────────────────────────────────────────────────────────

/** Fetch all latest states for every device in a home. */
export async function getLatestStatesByHomeId(homeId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("device_latest_states")
    .select("*")
    .eq("home_id", homeId)
    .order("last_seen_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch the latest state record for a single device. */
export async function getLatestStateByDeviceKey(deviceExternalKey: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("device_latest_states")
    .select("*")
    .eq("device_external_key", deviceExternalKey)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Upsert (Create / Update) ─────────────────────────────────────────────────

/**
 * Upsert the latest state for a device.
 * If a row for `device_external_key` already exists it is updated,
 * otherwise a new row is inserted.
 */
export async function upsertDeviceLatestState(
  payload: TablesInsert<"device_latest_states">,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("device_latest_states")
    .upsert(payload, { onConflict: "device_external_key" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Update a specific field subset on an existing latest-state record. */
export async function updateDeviceLatestState(
  deviceExternalKey: string,
  payload: TablesUpdate<"device_latest_states">,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("device_latest_states")
    .update(payload)
    .eq("device_external_key", deviceExternalKey)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Delete ──────────────────────────────────────────────────────────────────

/** Delete the latest-state record for a device by its external key. */
export async function deleteDeviceLatestState(deviceExternalKey: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("device_latest_states")
    .delete()
    .eq("device_external_key", deviceExternalKey);

  if (error) throw new Error(error.message);
}
