import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getAllRulesForAutomationTable,
  getFirstHome,
} from "@/lib/supabase/queries/dashboard";
import { mapRuleToAutomation } from "@/lib/utils/dashboard-mappers";
import { AppShell } from "@/components/layout/app-shell";
import { HomeStatusSection } from "@/components/dashboard/home-status-section";
import { ActiveReminders } from "@/components/dashboard/active-reminders";
import { DeviceHealth } from "@/components/dashboard/device-health-server";
import { RecentLeaveEvents } from "@/components/dashboard/recent-leave-events";
import { AutomationRules } from "@/components/dashboard/automation-rules";
import { ROUT_PATHS } from "@/lib/constants/routPaths";

/**
 * A server-side protected page.
 * Users who are not authenticated are redirected to /login.
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  // Use getClaims() for fast local JWT validation (no network call)
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    // Not authenticated — redirect to login
    redirect(ROUT_PATHS.LOGIN);
  }

  // const { claims } = claimsData;
  // console.log(claims);

  // Fetch automation rules data at the page level (server-side)
  const home = await getFirstHome();
  const rawRules = home ? await getAllRulesForAutomationTable(home.id) : [];
  // @ts-ignore
  const automationRules = rawRules.map(mapRuleToAutomation);

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
