import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";
import { RemindersSummary } from "@/components/reminders/reminders-summary";
import { RemindersTable } from "@/components/reminders/reminders-table";
import { getRemindersPageData, getFirstHome } from "@/lib/prisma/queries/dashboard";
import { ROUT_PATHS } from "@/lib/constants/routPaths";

/**
 * Server-side protected page for the full Reminders view.
 * Users who are not authenticated are redirected to /login.
 */
export default async function RemindersPage() {
  const supabase = await createClient();

  // Fast local JWT validation (no network call).
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    redirect(ROUT_PATHS.LOGIN);
  }

  const home = await getFirstHome();
  const rules = home ? await getRemindersPageData(home.id) : [];

  // Map rules to the flat shape expected by the client components.
  const rows = rules.map((rule) => ({
    id: rule.id,
    reminder_text: rule.reminder_text,
    severity: rule.severity,
    active: rule.active,
    trigger_presence_state: rule.trigger_presence_state,
    trigger_device_state: rule.trigger_device_state,
    device_name: rule.devices?.name ?? null,
    device_category: rule.devices?.category ?? null,
  }));

  return (
    <AppShell
      pageTitle="Reminders"
      pageSubtitle="Manage your reminder rules and notification triggers"
    >
      <div className="grid gap-6">
        {/* ── Summary row ───────────────────────────────────────────────── */}
        <RemindersSummary rules={rules} />

        {/* ── Search + filters + rules table ─────────────────────────────── */}
        <RemindersTable rules={rows} />
      </div>
    </AppShell>
  );
}
