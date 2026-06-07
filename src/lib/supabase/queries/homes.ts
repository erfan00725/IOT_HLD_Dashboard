/**
 * Server-side CRUD actions for the `homes` table.
 */

import { createClient } from "@/lib/supabase/server";
import { TablesInsert, TablesUpdate } from "@/../database.types";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch all homes owned by the current user. */
export async function getHomes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homes")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch a single home by UUID. */
export async function getHomeById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch a single home by its URL slug. */
export async function getHomeBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a new home record. */
export async function createHome(payload: TablesInsert<"homes">) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homes")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update a home by UUID. */
export async function updateHome(
  id: string,
  payload: TablesUpdate<"homes">,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homes")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a home by UUID. */
export async function deleteHome(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("homes").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
