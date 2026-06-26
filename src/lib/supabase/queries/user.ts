/**
 * Server-side helpers that interact with Supabase Auth (`auth.users`).
 * These wrap `supabase.auth.admin.*` for admin operations and
 * `supabase.auth.getUser()` for the currently authenticated user.
 */

import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database.types";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** List all auth users (requires service-role key). */
export async function getUsers() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) throw new Error(error.message);
  return data.users;
}

/** Fetch a single auth user by UUID (requires service-role key). */
export async function getUserById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.admin.getUserById(id);

  if (error) throw new Error(error.message);
  return data.user;
}

/** Returns the currently authenticated user from the session cookie. */
export async function getMyUser() {
  return getCurrentUser();
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Create a new auth user (requires service-role key). */
export async function createUser(
  email: string,
  password: string,
  options?: { email_confirm?: boolean },
) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: options?.email_confirm ?? true,
  });

  if (error) throw new Error(error.message);
  return data.user;
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update any auth user’s metadata (requires service-role key). */
// export async function updateUser(
//   id: string,
//   attributes: Database["public"]["Tables"]["user"]["Update"],
// ) {
//   const supabase = await createClient();

//   const { data, error } = await supabase.auth.admin.updateUserById(
//     id,
//     attributes,
//   );

//   if (error) throw new Error(error.message);
//   return data.user;
// }

/** Convenience: enable or disable a user account. */
export async function setUserActive(id: string, active: boolean) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.admin.updateUserById(id, {
    ban_duration: active ? "none" : "876600h", // ~100 years
  });

  if (error) throw new Error(error.message);
  return data.user;
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete an auth user by UUID (requires service-role key). */
export async function deleteUser(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.admin.deleteUser(id);

  if (error) throw new Error(error.message);
}
