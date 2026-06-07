/**
 * Server-side CRUD actions for the `profiles` table.
 * Profiles mirror the Supabase auth.users table — one row per auth user.
 */

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { TablesInsert, TablesUpdate } from "@/../database.types";

// ─── Read ────────────────────────────────────────────────────────────────────

/** Fetch the authenticated user's own profile. */
export async function getMyProfile() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch a profile by its UUID (auth user id). */
export async function getProfileById(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ──────────────────────────────────────────────────────────────────

/**
 * Insert a new profile row.
 * Normally triggered automatically via a Supabase database trigger
 * on auth.users insert; use this for manual creation or seeding.
 */
export async function createProfile(payload: TablesInsert<"profiles">) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("profiles")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update ──────────────────────────────────────────────────────────────────

/** Update any mutable profile fields for the authenticated user. */
export async function updateMyProfile(payload: TablesUpdate<"profiles">) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Update a profile by explicit id (admin/server use). */
export async function updateProfileById(
  id: string,
  payload: TablesUpdate<"profiles">,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Delete ──────────────────────────────────────────────────────────────────

/** Delete a profile by UUID. Use with caution — normally cascades from auth. */
export async function deleteProfile(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
