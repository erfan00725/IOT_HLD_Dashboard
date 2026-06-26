/**
 * Server-side CRUD actions for the `leave_sessions` table.
 */

import { prisma } from "@/lib/prisma";
import { InputJsonValue } from "@prisma/client/runtime/client";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch all leave sessions for a home, newest first. */
export async function getLeaveSessionsByHomeId(homeId: string) {
  return prisma.leave_sessions.findMany({
    where: { home_id: homeId },
    orderBy: { started_at: "desc" },
  });
}

/** Fetch the current open leave session (no ended_at) for a home, or null. */
export async function getActiveLeaveSession(homeId: string) {
  return prisma.leave_sessions.findFirst({
    where: { home_id: homeId, ended_at: null },
    orderBy: { started_at: "desc" },
  });
}

/** Fetch a single leave session by UUID. */
export async function getLeaveSessionById(id: string) {
  return prisma.leave_sessions.findUniqueOrThrow({ where: { id } });
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Start a new leave session. */
export async function createLeaveSession(payload: {
  home_id: string;
  user_id: string;
  ended_at?: Date | null;
  metadata?: unknown;
}) {
  return prisma.leave_sessions.create({ data: payload as never });
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update a leave session by UUID. */
export async function updateLeaveSession(
  id: string,
  payload: {
    ended_at?: Date | null;
    metadata?: InputJsonValue;
  },
) {
  return prisma.leave_sessions.update({ where: { id }, data: payload });
}

/** Convenience: close an open leave session by setting ended_at to now. */
export async function endLeaveSession(id: string) {
  return updateLeaveSession(id, { ended_at: new Date() });
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a leave session by UUID. */
export async function deleteLeaveSession(id: string) {
  await prisma.leave_sessions.delete({ where: { id } });
}
