import {
  Clock,
  PersonStanding,
  Lightbulb,
  KeyRound,
  LockKeyhole,
  type LucideIcon,
} from "lucide-react";
import { CardPanel } from "@/components/ui/card-panel";
import { PanelHeader } from "@/components/ui/panel-header";
import { IconBubble } from "@/components/ui/icon-bubble";
import { ICON_BUBBLE_STYLES } from "@/lib/utils/tone-styles";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface LeaveEvent {
  icon: LucideIcon;
  time: string;
  title: string;
  sub: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const EVENTS: LeaveEvent[] = [
  { icon: PersonStanding, time: "8:42 AM", title: "You left home",         sub: "Motion not detected"   },
  { icon: Lightbulb,      time: "8:42 AM", title: "Living room lights on",  sub: "Lights were on"        },
  { icon: KeyRound,       time: "8:41 AM", title: "Keys not detected",      sub: "Key tracker not found" },
  { icon: LockKeyhole,    time: "8:41 AM", title: "Front door locked",      sub: "Door locked after exit" },
];

// ---------------------------------------------------------------------------
// Single event row
// ---------------------------------------------------------------------------
function EventRow({ icon, time, title, sub }: LeaveEvent) {
  return (
    <li className="flex items-start gap-3">
      <IconBubble icon={icon} colorClass={ICON_BUBBLE_STYLES.slate} size="sm" />

      <span className="mt-0.5 shrink-0 text-xs text-slate-400 dark:text-slate-500">{time}</span>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Recent Leave Events panel
// ---------------------------------------------------------------------------
export function RecentLeaveEvents() {
  return (
    <CardPanel aria-labelledby="leave-events-heading">
      <PanelHeader
        icon={Clock}
        title="Recent Leave Events"
        headingId="leave-events-heading"
        viewAllHref="#history"
      />
      <ul className="grid gap-4">
        {EVENTS.map((ev) => (
          <EventRow key={ev.title} {...ev} />
        ))}
      </ul>
    </CardPanel>
  );
}
