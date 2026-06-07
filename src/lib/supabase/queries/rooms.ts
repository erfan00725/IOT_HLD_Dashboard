/**
 * Server-side CRUD actions for the `rooms` table.
 */

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { TablesInsert, TablesUpdate } from "@/../database.types";

// ─── Read ────────────────────────────────────────────────────────────────────

/** Fetch all rooms belonging to a home, ordered by sort_order. */
export async function getRoomsByHomeId(homeId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("home_id", homeId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch a single room by its UUID. */
export async function getRoomById(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ──────────────────────────────────────────────────────────────────

/** Insert a new room record. */
export async function createRoom(payload: TablesInsert<"rooms">) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("rooms")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update ──────────────────────────────────────────────────────────────────

/** Update a room by its UUID. */
export async function updateRoom(id: string, payload: TablesUpdate<"rooms">) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("rooms")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Delete ──────────────────────────────────────────────────────────────────

/** Delete a room by its UUID. */
export async function deleteRoom(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("rooms").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
