/**
 * Server-side CRUD actions for the `device_latest_states` table.
 */

import { createClient } from "@/lib/supabase/server";
import { TablesInsert, TablesUpdate } from "@/../database.types";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch the latest state for every device in a home. */
export async function getLatestStatesByHomeId(homeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("device_latest_states")
    .select("*")
    .eq("home_id", homeId);

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch the latest state for a single device by its external key. */
export async function getLatestStateByDeviceKey(deviceExternalKey: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("device_latest_states")
    .select("*")
    .eq("device_external_key", deviceExternalKey)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Upsert ─────────────────────────────────────────────────────────────────────────────

/**
 * Insert or update the latest state for a device.
 * Conflicts on `device_external_key` (the primary key) are updated in place.
 */
export async function upsertDeviceLatestState(
  payload: TablesInsert<"device_latest_states">,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("device_latest_states")
    .upsert(payload, { onConflict: "device_external_key" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update specific fields of a device’s latest state record. */
export async function updateDeviceLatestState(
  deviceExternalKey: string,
  payload: TablesUpdate<"device_latest_states">,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("device_latest_states")
    .update(payload)
    .eq("device_external_key", deviceExternalKey)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete the latest-state record for a specific device. */
export async function deleteDeviceLatestState(deviceExternalKey: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("device_latest_states")
    .delete()
    .eq("device_external_key", deviceExternalKey);

  if (error) throw new Error(error.message);
}
