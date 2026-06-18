/**
 * Server-side CRUD actions for the `reminder_rules` table.
 */

import { createClient } from "@/lib/supabase/server";
import { TablesInsert, TablesUpdate } from "@/lib/types/database.types";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch all reminder rules for a given home. */
export async function getReminderRulesByHomeId(homeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminder_rules")
    .select("*")
    .eq("home_id", homeId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch only active reminder rules for a home, ordered by severity desc. */
export async function getActiveReminderRules(homeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminder_rules")
    .select("*")
    .eq("home_id", homeId)
    .eq("active", true)
    .order("severity", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch a single reminder rule by UUID. */
export async function getReminderRuleById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminder_rules")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a new reminder rule. */
export async function createReminderRule(
  payload: TablesInsert<"reminder_rules">,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminder_rules")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update a reminder rule by UUID. */
export async function updateReminderRule(
  id: string,
  payload: TablesUpdate<"reminder_rules">,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminder_rules")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Toggle the `active` flag of a reminder rule. */
export async function toggleReminderRule(id: string, active: boolean) {
  return updateReminderRule(id, { active });
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a reminder rule by UUID. */
export async function deleteReminderRule(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("reminder_rules").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
