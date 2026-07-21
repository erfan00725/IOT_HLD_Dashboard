/**
 * Server-side CRUD actions for the application `user` table
 * (public."user" — the profile row mirroring auth.users, one per account).
 *
 * Replaces the former `profiles` table: `display_name` is now `full_name`,
 * and the table additionally carries `username`, `email`, `avatar_url`,
 * `role`, and `is_active`.
 */

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/supabase/server";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch the account row for the currently authenticated user. */
export async function getMyUser() {
  const user = await getCurrentUserOrThrow();
  return prisma.user.findUniqueOrThrow({ where: { id: user.id } });
}

/** Fetch any account row by UUID (admin/service use). */
export async function getUserById(id: string) {
  return prisma.user.findUniqueOrThrow({ where: { id } });
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/**
 * Insert an account row (normally handled by the `handle_new_auth_user`
 * trigger on auth.users).
 */
export async function createUser(payload: {
  id: string;
  username?: string | null;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
}) {
  return prisma.user.create({ data: payload });
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update the current user's own account row. */
export async function updateMyUser(payload: {
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
}) {
  const user = await getCurrentUserOrThrow();

  return prisma.user.update({
    where: { id: user.id },
    data: payload,
  });
}

/** Update any account row by UUID (admin/service use). */
export async function updateUserById(
  id: string,
  payload: {
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    role?: string;
    is_active?: boolean;
  },
) {
  return prisma.user.update({ where: { id }, data: payload });
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete an account row by UUID. */
export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
}
