import { CalendarClock, Activity, CalendarDays, AlertTriangle } from "lucide-react";
import { CardPanel, StatusTile } from "@/components/ui";

interface EventsSummaryProps {
  total: number;
  today: number;
  /** Unique number of days that contain at least one event. */
  activeDays: number;
  /** Count of events flagged as needing attention (amber/red). */
  alerts: number;
}

/**
 * A compact row of summary tiles shown at the top of the events page:
 * Total, Today, Active Days, Alerts.
 *
 * Reuses the shared `StatusTile` primitive (the same one the dashboard
 * hero row and devices summary use) so the visual language stays consistent.
 */
export function EventsSummary({
  total,
  today,
  activeDays,
  alerts,
}: EventsSummaryProps) {
  return (
    <CardPanel
      className="gap-4 p-5 sm:p-6"
      aria-labelledby="events-summary-heading"
    >
      <h2
        id="events-summary-heading"
        className="text-sm font-semibold text-slate-900 dark:text-slate-100"
      >
        Overview
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatusTile
          icon={CalendarClock}
          label={String(total)}
          sub="Total events"
          tone="slate"
        />
        <StatusTile
          icon={Activity}
          label={String(today)}
          sub="Today"
          tone="teal"
        />
        <StatusTile
          icon={CalendarDays}
          label={String(activeDays)}
          sub="Active days"
          tone="slate"
        />
        <StatusTile
          icon={AlertTriangle}
          label={String(alerts)}
          sub="Alerts"
          tone="amber"
        />
      </div>
    </CardPanel>
  );
}
