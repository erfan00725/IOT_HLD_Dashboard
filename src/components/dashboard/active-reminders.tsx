import { Bell, Home, Lightbulb, KeyRound } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { CardPanel } from "@/components/ui/card-panel";
import { PanelHeader } from "@/components/ui/panel-header";
import { IconBubble } from "@/components/ui/icon-bubble";
import {
  type Priority,
  PRIORITY_BADGE_STYLES,
  ICON_BUBBLE_STYLES,
} from "@/lib/utils/tone-styles";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Reminder {
  icon: LucideIcon;
  title: string;
  sub: string;
  time: string;
  priority: Priority;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const REMINDERS: Reminder[] = [
  { icon: Home,      title: "Close garage door",          sub: "Garage is open",      time: "8:45 AM", priority: "High"   },
  { icon: Lightbulb, title: "Turn off living room lights", sub: "Lights are still on",  time: "8:45 AM", priority: "Medium" },
  { icon: KeyRound,  title: "Check if keys are with you", sub: "Keys not detected",    time: "8:42 AM", priority: "High"   },
];

// ---------------------------------------------------------------------------
// Priority badge
// ---------------------------------------------------------------------------
function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${PRIORITY_BADGE_STYLES[priority]}`}
    >
      {priority}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Single reminder row
// ---------------------------------------------------------------------------
function ReminderRow({ icon, title, sub, time, priority }: Reminder) {
  return (
    <li className="flex items-center gap-3">
      <IconBubble icon={icon} colorClass={ICON_BUBBLE_STYLES.teal} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</p>
        <p className="truncate text-xs text-slate-400 dark:text-slate-500">{sub}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-xs text-slate-400 dark:text-slate-500">{time}</span>
        <PriorityBadge priority={priority} />
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Active Reminders panel
// ---------------------------------------------------------------------------
export function ActiveReminders() {
  return (
    <CardPanel aria-labelledby="reminders-heading">
      <PanelHeader
        icon={Bell}
        title="Active Reminders"
        headingId="reminders-heading"
        viewAllHref="#reminders"
      />
      <ul className="grid gap-4">
        {REMINDERS.map((r) => (
          <ReminderRow key={r.title} {...r} />
        ))}
      </ul>
    </CardPanel>
  );
}
