import {
  CalendarClock,
  Activity,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";
import { SummaryPanel } from "@/components/ui/summary-panel";

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
 * Delegates layout to the shared `<SummaryPanel>` component.
 */
export function EventsSummary({
  total,
  today,
  activeDays,
  alerts,
}: EventsSummaryProps) {
  return (
    <SummaryPanel
      headingId="events-summary-heading"
      tiles={[
        {
          icon: CalendarClock,
          label: String(total),
          sub: "Total events",
          tone: "slate",
        },
        { icon: Activity, label: String(today), sub: "Today", tone: "teal" },
        {
          icon: CalendarDays,
          label: String(activeDays),
          sub: "Active days",
          tone: "slate",
        },
        {
          icon: AlertTriangle,
          label: String(alerts),
          sub: "Alerts",
          tone: "amber",
        },
      ]}
    />
  );
}
