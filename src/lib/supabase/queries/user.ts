/**
 * Server-side CRUD actions for the `user` table.
 * This table extends user data beyond the `profiles` table
 * (avatar, full name, role, active flag, etc.).
 */

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { TablesInsert, TablesUpdate } from "@/../database.types";

// ─── Read ────────────────────────────────────────────────────────────────────

/** Fetch all user records (admin/server use). */
export async function getUsers() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("user")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch a single user record by UUID. */
export async function getUserById(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch the authenticated user's own record. */
export async function getMyUser() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ──────────────────────────────────────────────────────────────────

/** Insert a new user record. */
export async function createUser(payload: TablesInsert<"user">) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("user")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update ──────────────────────────────────────────────────────────────────

/** Update a user record by UUID. */
export async function updateUser(id: string, payload: TablesUpdate<"user">) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("user")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Toggle a user's active status. */
export async function setUserActive(id: string, isActive: boolean) {
  return updateUser(id, { is_active: isActive });
}

// ─── Delete ──────────────────────────────────────────────────────────────────

/** Delete a user record by UUID. */
export async function deleteUser(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("user").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
