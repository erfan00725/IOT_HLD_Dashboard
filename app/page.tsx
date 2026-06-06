import { AppShell } from "@/components/layout/app-shell";
import { HomeStatusSection } from "@/components/dashboard/home-status-section";
import { ActiveReminders } from "@/components/dashboard/active-reminders";
import { DeviceHealth } from "@/components/dashboard/device-health";
import { RecentLeaveEvents } from "@/components/dashboard/recent-leave-events";
import { AutomationRules } from "@/components/dashboard/automation-rules";
import { automationRules } from "@/data/mock";

export default function Home() {
  return (
    <AppShell>
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
        {/* @ts-ignore */}
        <AutomationRules rules={automationRules} />
      </div>
    </AppShell>
  );
}
