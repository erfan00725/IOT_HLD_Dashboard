/**
 * Server-side CRUD actions for the `homes` table.
 * All functions use the server Supabase client and must be called
 * from Server Components, Route Handlers, or Server Actions.
 */

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { TablesInsert, TablesUpdate } from "@/../database.types";

// ─── Read ────────────────────────────────────────────────────────────────────

/** Fetch all homes owned by the authenticated user. */
export async function getHomes() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("homes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch a single home by its UUID. */
export async function getHomeById(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

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
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("homes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ──────────────────────────────────────────────────────────────────

/** Insert a new home record. */
export async function createHome(payload: TablesInsert<"homes">) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("homes")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update ──────────────────────────────────────────────────────────────────

/** Update an existing home by its UUID. */
export async function updateHome(id: string, payload: TablesUpdate<"homes">) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("homes")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Delete ──────────────────────────────────────────────────────────────────

/** Delete a home by its UUID. */
export async function deleteHome(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("homes").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
