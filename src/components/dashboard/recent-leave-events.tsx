import {
  Clock,
  PersonStanding,
  Lightbulb,
  KeyRound,
  LockKeyhole,
  ShieldAlert,
  type LucideIcon,
  Home,
} from "lucide-react";
import { CardPanel } from "@/components/ui/card-panel";
import { PanelHeader } from "@/components/ui/panel-header";
import { IconBubble } from "@/components/ui/icon-bubble";
import { ICON_BUBBLE_STYLES } from "@/lib/utils/tone-styles";
import {
  getRecentStateEventsForDashboard,
  getFirstHome,
} from "@/lib/prisma/queries/dashboard";
import { formatTime } from "@/lib/utils/dashboard-mappers";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeaveEvent {
  icon: LucideIcon;
  time: string;
  title?: string;
  sub: string;
}

// ─── Category → icon ─────────────────────────────────────────────────────────

function categoryToIcon(category?: string): LucideIcon {
  switch (category) {
    case "presence":
      return PersonStanding;
    case "lighting":
      return Lightbulb;
    case "access":
      return KeyRound;
    case "opening":
      return LockKeyhole;
    case "safety":
      return ShieldAlert;
    default:
      return Clock;
  }
}

// ─── Single event row ─────────────────────────────────────────────────────────

function EventRow({ icon, time, title, sub }: LeaveEvent) {
  return (
    <li className="flex items-start gap-3">
      <IconBubble icon={icon} colorClass={ICON_BUBBLE_STYLES.slate} size="sm" />
      <span className="mt-0.5 shrink-0 text-xs text-slate-400 dark:text-slate-500">
        {time}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>
      </div>
    </li>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function NoEvents() {
  return (
    <li className="py-4 text-center text-sm text-slate-400 dark:text-slate-500">
      No recent events recorded yet.
    </li>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export async function RecentLeaveEvents() {
  const home = await getFirstHome();

  const rawEvents = home ? await getRecentStateEventsForDashboard(home.id) : [];

  const events: LeaveEvent[] = rawEvents.map((ev) => ({
    // Supabase types `devices` as an array; runtime is a single object.
    icon: categoryToIcon(ev.devices?.category),
    time: formatTime(ev.observed_at),
    // see above.
    title: ev.devices?.name || "_",
    sub: `State: ${ev.state_value}`,
  }));

  return (
    <CardPanel aria-labelledby="leave-events-heading">
      <PanelHeader
        icon={Clock}
        title="Recent Leave Events"
        headingId="leave-events-heading"
        viewAllHref="#history"
      />
      <ul className="grid gap-4">
        {events.length > 0 ? (
          events.map((ev, i) => <EventRow key={i} {...ev} />)
        ) : (
          <NoEvents />
        )}
      </ul>
    </CardPanel>
  );
}
