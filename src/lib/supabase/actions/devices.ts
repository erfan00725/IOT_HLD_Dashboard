"use server";

import { revalidatePath } from "next/cache";
import { toggleDeviceActive, toggleDeviceReminder } from "@/lib/prisma/queries/devices";

/**
 * Toggles a device's `active` flag and revalidates the devices page.
 *
 * Authorization is enforced by the authenticated Supabase session (cookies-based)
 * together with home-ownership scoping in the query layer.
 */
export async function toggleDeviceActiveAction(
  id: string,
  active: boolean,
): Promise<void> {
  await toggleDeviceActive(id, active);
  revalidatePath("/devices");
}

/**
 * Toggles a device's `reminder_enabled` flag and revalidates the devices page.
 */
export async function toggleDeviceReminderAction(
  id: string,
  reminderEnabled: boolean,
): Promise<void> {
  await toggleDeviceReminder(id, reminderEnabled);
  revalidatePath("/devices");
}
