/**
 * Server-side CRUD actions for the `profiles` table.
 */

import { createClient } from "@/lib/supabase/server";
import { TablesInsert, TablesUpdate } from "@/lib/types/database.types";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch the profile for the currently authenticated user. */
export async function getMyProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch any profile by UUID (admin/service use). */
export async function getProfileById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a profile record (normally handled by a DB trigger on auth.users). */
export async function createProfile(payload: TablesInsert<"profiles">) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update the current user’s own profile. */
export async function updateMyProfile(payload: TablesUpdate<"profiles">) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Update any profile by UUID (admin/service use). */
export async function updateProfileById(
  id: string,
  payload: TablesUpdate<"profiles">,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a profile by UUID. */
export async function deleteProfile(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
