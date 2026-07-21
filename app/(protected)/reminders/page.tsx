import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";
import { RemindersSummary } from "@/components/reminders/reminders-summary";
import { RemindersTable } from "@/components/reminders/reminders-table";
import {
  getRemindersPageData,
  getFirstHome,
} from "@/lib/prisma/queries/dashboard";
import {
  getDevicesByHomeId,
  getAllDeviceTypeStates,
} from "@/lib/prisma/queries/devices";
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
  const devices = home ? await getDevicesByHomeId(home.id) : [];
  const deviceTypeStates = await getAllDeviceTypeStates();

  // Map rules to the flat shape expected by the client components.
  const rows = rules.map((rule) => ({
    id: rule.id,
    reminder_text: rule.reminder_text,
    severity: rule.severity,
    active: rule.active,
    trigger_presence_state: rule.trigger_presence_state,
    trigger_state_key: rule.trigger_state_key,
    trigger_device_type_state_id: rule.trigger_device_type_state_id,
    device_id: rule.devices?.id ?? null,
    device_name: rule.devices?.name ?? null,
    device_type_id: rule.devices?.device_type_id ?? null,
    device_type_states: rule.device_type_states,
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
        <RemindersTable
          rules={rows}
          devices={devices.map((device) => ({
            id: device.id,
            name: device.name,
            typeId: device.device_type_id,
            typeLabel: device.device_type_id,
          }))}
          stateOptions={deviceTypeStates.map((state) => ({
            id: Number(state.id),
            state_key: state.state_key,
            label: state.label || state.state_key,
            device_type_id: state.device_type_id,
          }))}
          canEdit
        />
      </div>
    </AppShell>
  );
}
