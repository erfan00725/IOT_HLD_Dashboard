/**
 * Server-side CRUD actions for the `reminder_events` table.
 * Rows are created by the IoT pipeline; the dashboard primarily reads them.
 * Deletion is supported for data-retention / admin use.
 */

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Database, TablesInsert, TablesUpdate } from "@/../database.types";

type DeliveryStatus = Database["public"]["Enums"]["delivery_status"];

// ─── Read ────────────────────────────────────────────────────────────────────

/** Fetch reminder events for a home, newest first. */
export async function getReminderEventsByHomeId(
  homeId: string,
  limit = 50,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("reminder_events")
    .select("*")
    .eq("home_id", homeId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch reminder events linked to a specific leave session. */
export async function getReminderEventsByLeaveSession(leaveSessionId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("reminder_events")
    .select("*")
    .eq("leave_session_id", leaveSessionId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch a single reminder event by its auto-increment id. */
export async function getReminderEventById(id: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("reminder_events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ──────────────────────────────────────────────────────────────────

/** Insert a new reminder event (usually called from the IoT pipeline). */
export async function createReminderEvent(
  payload: TablesInsert<"reminder_events">,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("reminder_events")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update ──────────────────────────────────────────────────────────────────

/** Update a reminder event's delivery status or other mutable fields. */
export async function updateReminderEvent(
  id: number,
  payload: TablesUpdate<"reminder_events">,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("reminder_events")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Convenience: mark a reminder event with a specific delivery status. */
export async function setReminderDeliveryStatus(
  id: number,
  status: DeliveryStatus,
) {
  return updateReminderEvent(id, { delivery_status: status });
}

// ─── Delete ──────────────────────────────────────────────────────────────────

/** Delete a single reminder event by id. */
export async function deleteReminderEvent(id: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("reminder_events")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
