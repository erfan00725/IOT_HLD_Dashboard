/**
 * Server-side CRUD actions for the `profiles` table.
 */

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/supabase/server";

// ─── Read ──────────────────────────────────────────────────────────────────────────────

/** Fetch the profile for the currently authenticated user. */
export async function getMyProfile() {
  const user = await getCurrentUserOrThrow();
  return prisma.profiles.findUniqueOrThrow({ where: { id: user.id } });
}

/** Fetch any profile by UUID (admin/service use). */
export async function getProfileById(id: string) {
  return prisma.profiles.findUniqueOrThrow({ where: { id } });
}

// ─── Create ─────────────────────────────────────────────────────────────────────────────

/** Insert a profile record (normally handled by a DB trigger on auth.users). */
export async function createProfile(payload: {
  id: string;
  display_name?: string | null;
}) {
  return prisma.profiles.create({ data: payload });
}

// ─── Update ─────────────────────────────────────────────────────────────────────────────

/** Update the current user's own profile. */
export async function updateMyProfile(payload: {
  display_name?: string | null;
}) {
  const user = await getCurrentUserOrThrow();

  return prisma.profiles.update({
    where: { id: user.id },
    data: payload,
  });
}

/** Update any profile by UUID (admin/service use). */
export async function updateProfileById(
  id: string,
  payload: { display_name?: string | null },
) {
  return prisma.profiles.update({ where: { id }, data: payload });
}

// ─── Delete ─────────────────────────────────────────────────────────────────────────────

/** Delete a profile by UUID. */
export async function deleteProfile(id: string) {
  await prisma.profiles.delete({ where: { id } });
}
