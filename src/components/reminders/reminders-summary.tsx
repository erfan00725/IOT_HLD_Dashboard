import { Bell, Zap, AlertTriangle, Ban } from "lucide-react";
import { CardPanel, StatusTile } from "@/components/ui";
import { severityToPriority } from "@/lib/utils/dashboard-mappers";
import type { RemindersPageRule } from "@/lib/prisma/queries/dashboard";

interface RemindersSummaryProps {
  rules: RemindersPageRule[];
}

/**
 * A compact row of summary tiles shown at the top of the reminders page:
 * Total Rules, Active, High Priority, Inactive.
 *
 * Reuses the shared `StatusTile` primitive (the same one the dashboard
 * hero row, events summary, and devices summary use) so the visual
 * language stays consistent across the entire app.
 */
export function RemindersSummary({ rules }: RemindersSummaryProps) {
  const total = rules.length;
  const active = rules.filter((r) => r.active).length;
  const highPriority = rules.filter(
    (r) => severityToPriority(r.severity) === "High",
  ).length;
  const inactive = rules.filter((r) => !r.active).length;

  return (
    <CardPanel
      className="gap-4 p-5 sm:p-6"
      aria-labelledby="reminders-summary-heading"
    >
      <h2
        id="reminders-summary-heading"
        className="text-sm font-semibold text-slate-900 dark:text-slate-100"
      >
        Overview
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatusTile
          icon={Bell}
          label={String(total)}
          sub="Total rules"
          tone="slate"
        />
        <StatusTile
          icon={Zap}
          label={String(active)}
          sub="Active"
          tone="teal"
        />
        <StatusTile
          icon={AlertTriangle}
          label={String(highPriority)}
          sub="High priority"
          tone="red"
        />
        <StatusTile
          icon={Ban}
          label={String(inactive)}
          sub="Inactive"
          tone="amber"
        />
      </div>
    </CardPanel>
  );
}
