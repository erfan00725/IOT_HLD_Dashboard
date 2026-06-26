/**
 * Server-side CRUD actions for the `reminder_events` table.
 */

import { prisma } from "@/lib/prisma";
import type { delivery_status } from "@/generated/prisma/client";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch all reminder events for a home. */
export async function getReminderEventsByHomeId(homeId: string) {
  return prisma.reminder_events.findMany({
    where: { home_id: homeId },
    orderBy: { created_at: "desc" },
  });
}

/** Fetch reminder events tied to a specific leave session. */
export async function getReminderEventsByLeaveSession(leaveSessionId: string) {
  return prisma.reminder_events.findMany({
    where: { leave_session_id: leaveSessionId },
    orderBy: { created_at: "desc" },
  });
}

/** Fetch a single reminder event by ID. */
export async function getReminderEventById(id: number) {
  return prisma.reminder_events.findUniqueOrThrow({
    where: { id: BigInt(id) },
  });
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a new reminder event. */
export async function createReminderEvent(payload: {
  home_id: string;
  leave_session_id?: string | null;
  reminder_count?: number;
  reminders?: unknown;
  message?: string | null;
  source?: string;
  delivery_status?: delivery_status;
  payload?: unknown;
}) {
  return prisma.reminder_events.create({ data: payload as never });
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update a reminder event by ID. */
export async function updateReminderEvent(
  id: number,
  payload: {
    reminder_count?: number;
    reminders?: unknown;
    message?: string | null;
    delivery_status?: delivery_status;
    payload?: unknown;
  },
) {
  return prisma.reminder_events.update({
    where: { id: BigInt(id) },
    data: payload as never,
  });
}

/** Convenience: mark a reminder event as delivered or failed. */
export async function setReminderDeliveryStatus(
  id: number,
  status: delivery_status,
) {
  return updateReminderEvent(id, { delivery_status: status });
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a reminder event by ID. */
export async function deleteReminderEvent(id: number) {
  await prisma.reminder_events.delete({
    where: { id: BigInt(id) },
  });
}
