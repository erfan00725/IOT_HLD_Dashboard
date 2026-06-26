"use server";

import { revalidatePath } from "next/cache";
import { toggleReminderRule } from "@/lib/prisma/queries/reminder_rules";

/**
 * Toggles the `active` flag of a reminder rule (as shown in the Automation
 * Rules table) and revalidates the dashboard so the new state is reflected.
 *
 * Note: this action trusts the authenticated Supabase session established by
 * `createClient()` (cookies-based). Row-level checks happen in the query layer
 * via the home ownership scoping. See `docs/app/guides/data-security` for the
 * recommendation to verify authorization inside every Server Action.
 */
export async function toggleReminderRuleAction(
  id: string,
  active: boolean,
): Promise<void> {
  await toggleReminderRule(id, active);
  revalidatePath("/");
}
