/**
 * Server-side CRUD actions for the `leave_sessions` table.
 */

import { createClient } from "@/lib/supabase/server";
import { TablesInsert, TablesUpdate } from "@/../database.types";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch all leave sessions for a home, newest first. */
export async function getLeaveSessionsByHomeId(homeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leave_sessions")
    .select("*")
    .eq("home_id", homeId)
    .order("started_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch the current open leave session (no ended_at) for a home, or null. */
export async function getActiveLeaveSession(homeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leave_sessions")
    .select("*")
    .eq("home_id", homeId)
    .is("ended_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch a single leave session by UUID. */
export async function getLeaveSessionById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leave_sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Start a new leave session. */
export async function createLeaveSession(
  payload: TablesInsert<"leave_sessions">,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leave_sessions")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update a leave session by UUID. */
export async function updateLeaveSession(
  id: string,
  payload: TablesUpdate<"leave_sessions">,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leave_sessions")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Convenience: close an open leave session by setting ended_at to now. */
export async function endLeaveSession(id: string) {
  return updateLeaveSession(id, { ended_at: new Date().toISOString() });
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a leave session by UUID. */
export async function deleteLeaveSession(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("leave_sessions")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
