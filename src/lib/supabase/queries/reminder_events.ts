/**
 * Server-side CRUD actions for the `reminder_events` table.
 */

import { createClient } from "@/lib/supabase/server";
import {
  Database,
  TablesInsert,
  TablesUpdate,
} from "@/lib/types/database.types";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch all reminder events for a home. */
export async function getReminderEventsByHomeId(homeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminder_events")
    .select("*")
    .eq("home_id", homeId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch reminder events tied to a specific leave session. */
export async function getReminderEventsByLeaveSession(leaveSessionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminder_events")
    .select("*")
    .eq("leave_session_id", leaveSessionId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch a single reminder event by UUID. */
export async function getReminderEventById(id: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminder_events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a new reminder event. */
export async function createReminderEvent(
  payload: TablesInsert<"reminder_events">,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminder_events")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update a reminder event by UUID. */
export async function updateReminderEvent(
  id: number,
  payload: TablesUpdate<"reminder_events">,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminder_events")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Convenience: mark a reminder event as delivered or failed. */
export async function setReminderDeliveryStatus(
  id: number,
  status: Database["public"]["Enums"]["delivery_status"],
) {
  return updateReminderEvent(id, { delivery_status: status });
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a reminder event by UUID. */
export async function deleteReminderEvent(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reminder_events")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
