import { AppShell } from "@/components/layout/app-shell";
import { HomeStatusSection } from "@/components/dashboard/home-status-section";
import { ActiveReminders } from "@/components/dashboard/active-reminders";
import { DeviceHealth } from "@/components/dashboard/device-health-server";
import { RecentLeaveEvents } from "@/components/dashboard/recent-leave-events";
import { AutomationRules } from "@/components/dashboard/automation-rules";
import {
  getAllRulesForAutomationTable,
  getFirstHome,
} from "@/lib/supabase/queries/dashboard";
import { mapRuleToAutomation } from "@/lib/utils/dashboard-mappers";
import { getHomes } from "@/lib/supabase/queries";

export default async function Home() {
  // Fetch automation rules data at the page level (server-side)
  const home = await getFirstHome();
  const rawRules = home ? await getAllRulesForAutomationTable(home.id) : [];
  const automationRules = rawRules.map(mapRuleToAutomation);

  const users = await getHomes();

  return (
    <AppShell pageTitle={home?.name}>
      <div className="grid gap-6">
        {/* ── Home Status hero row ───────────────────────────────── */}
        <HomeStatusSection />

        {/* ── Middle row: Reminders | Device Health | Leave Events ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          <ActiveReminders />
          <DeviceHealth />
          <RecentLeaveEvents />
        </div>

        {/* ── Bottom: Automation Rules table ────────────────────── */}
        <AutomationRules rules={automationRules} />
      </div>
    </AppShell>
  );
}
