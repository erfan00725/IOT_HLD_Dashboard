/**
 * Server-side CRUD actions for the `reminder_rules` table.
 *
 * Rules are attached to a device via `device_id` and fire when the device
 * reaches the state referenced by `trigger_device_type_state_id` →
 * `device_type_states.id`. There is no `home_id` column; home scoping is done
 * through the `devices` relation.
 */

import { prisma } from "@/lib/prisma";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch all reminder rules for a given home. */
export async function getReminderRulesByHomeId(homeId: string) {
  return prisma.reminder_rules.findMany({
    where: { devices: { home_id: homeId } },
    orderBy: { created_at: "desc" },
  });
}

/** Fetch only active reminder rules for a home, ordered by severity desc. */
export async function getActiveReminderRules(homeId: string) {
  return prisma.reminder_rules.findMany({
    where: { devices: { home_id: homeId }, active: true },
    orderBy: { severity: "desc" },
  });
}

/** Fetch a single reminder rule by UUID. */
export async function getReminderRuleById(id: string) {
  return prisma.reminder_rules.findUniqueOrThrow({ where: { id } });
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a new reminder rule. */
export async function createReminderRule(payload: {
  device_id: string;
  trigger_device_type_state_id: number;
  trigger_presence_state?: string;
  reminder_text: string;
  severity?: number;
  active?: boolean;
}) {
  return prisma.reminder_rules.create({ data: payload });
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update a reminder rule by UUID. */
export async function updateReminderRule(
  id: string,
  payload: {
    device_id?: string;
    trigger_presence_state?: string;
    trigger_device_type_state_id?: number;
    reminder_text?: string;
    severity?: number;
    active?: boolean;
  },
) {
  return prisma.reminder_rules.update({ where: { id }, data: payload });
}

/** Toggle the `active` flag of a reminder rule. */
export async function toggleReminderRule(id: string, active: boolean) {
  return updateReminderRule(id, { active });
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a reminder rule by UUID. */
export async function deleteReminderRule(id: string) {
  await prisma.reminder_rules.delete({ where: { id } });
}
