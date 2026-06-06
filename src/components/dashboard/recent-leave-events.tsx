import {
  Clock,
  PersonStanding,
  Lightbulb,
  KeyRound,
  LockKeyhole,
  type LucideIcon,
} from 'lucide-react';

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
  { icon: PersonStanding, time: '8:42 AM', title: 'You left home',         sub: 'Motion not detected'    },
  { icon: Lightbulb,      time: '8:42 AM', title: 'Living room lights on',  sub: 'Lights were on'         },
  { icon: KeyRound,       time: '8:41 AM', title: 'Keys not detected',      sub: 'Key tracker not found'  },
  { icon: LockKeyhole,    time: '8:41 AM', title: 'Front door locked',      sub: 'Door locked after exit'  },
];

// ---------------------------------------------------------------------------
// Single event row
// ---------------------------------------------------------------------------
function EventRow({ icon: Icon, time, title, sub }: LeaveEvent) {
  return (
    <li className="flex items-start gap-3">
      {/* Icon bubble */}
      <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800">
        <Icon className="size-4 text-slate-500 dark:text-slate-400" strokeWidth={1.8} aria-hidden="true" />
      </div>

      {/* Time */}
      <span className="mt-0.5 shrink-0 text-xs text-slate-400 dark:text-slate-500">{time}</span>

      {/* Text */}
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
    <section
      className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5 shadow-sm"
      aria-labelledby="leave-events-heading"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-slate-500 dark:text-slate-400" strokeWidth={1.8} aria-hidden="true" />
          <h2 id="leave-events-heading" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Recent Leave Events
          </h2>
        </div>
        <a href="#history" className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline">
          View all
        </a>
      </div>

      {/* Timeline list */}
      <ul className="grid gap-4">
        {EVENTS.map((ev) => (
          <EventRow key={ev.title} {...ev} />
        ))}
      </ul>
    </section>
  );
}
