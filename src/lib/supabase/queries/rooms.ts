/**
 * Server-side CRUD actions for the `rooms` table.
 */

import { createClient } from "@/lib/supabase/server";
import { TablesInsert, TablesUpdate } from "@/../database.types";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch all rooms for a given home, sorted by sort_order. */
export async function getRoomsByHomeId(homeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("home_id", homeId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch a single room by UUID. */
export async function getRoomById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a new room. */
export async function createRoom(payload: TablesInsert<"rooms">) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update a room by UUID. */
export async function updateRoom(
  id: string,
  payload: TablesUpdate<"rooms">,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a room by UUID. */
export async function deleteRoom(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("rooms").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
