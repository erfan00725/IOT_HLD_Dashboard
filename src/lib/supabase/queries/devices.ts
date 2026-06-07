/**
 * Server-side CRUD actions for the `devices` table.
 */

import { createClient } from "@/lib/supabase/server";
import { Database, TablesInsert, TablesUpdate } from "@/../database.types";

type DeviceCategory = Database["public"]["Enums"]["device_category"];

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch all devices for a given home. */
export async function getDevicesByHomeId(homeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("home_id", homeId)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch devices belonging to a specific room. */
export async function getDevicesByRoomId(roomId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("room_id", roomId)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch all devices of a given category in a home. */
export async function getDevicesByCategory(
  homeId: string,
  category: DeviceCategory,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("home_id", homeId)
    .eq("category", category);

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch a single device by its UUID. */
export async function getDeviceById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch a single device by its external MQTT key. */
export async function getDeviceByExternalKey(externalKey: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("external_key", externalKey)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a new device. */
export async function createDevice(payload: TablesInsert<"devices">) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("devices")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update a device by its UUID. */
export async function updateDevice(
  id: string,
  payload: TablesUpdate<"devices">,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("devices")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
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
  const supabase = await createClient();

  const { error } = await supabase.from("devices").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
