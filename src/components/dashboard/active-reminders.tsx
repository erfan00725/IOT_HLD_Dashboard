import { Bell, Home, Lightbulb, KeyRound } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Priority = 'High' | 'Medium' | 'Low';

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
  { icon: Home,      title: 'Close garage door',          sub: 'Garage is open',      time: '8:45 AM', priority: 'High'   },
  { icon: Lightbulb, title: 'Turn off living room lights', sub: 'Lights are still on',  time: '8:45 AM', priority: 'Medium' },
  { icon: KeyRound,  title: 'Check if keys are with you', sub: 'Keys not detected',    time: '8:42 AM', priority: 'High'   },
];

// ---------------------------------------------------------------------------
// Priority badge
// ---------------------------------------------------------------------------
const PRIORITY_STYLES: Record<Priority, string> = {
  High:   'bg-red-50   text-red-600   ring-red-200',
  Medium: 'bg-amber-50 text-amber-600 ring-amber-200',
  Low:    'bg-slate-100 text-slate-500 ring-slate-200',
};

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
        PRIORITY_STYLES[priority]
      }`}
    >
      {priority}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Single reminder row
// ---------------------------------------------------------------------------
function ReminderRow({ icon: Icon, title, sub, time, priority }: Reminder) {
  return (
    <li className="flex items-center gap-3">
      {/* Icon bubble */}
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-teal-50">
        <Icon className="size-4 text-teal-600" strokeWidth={1.8} aria-hidden="true" />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
        <p className="truncate text-xs text-slate-400">{sub}</p>
      </div>

      {/* Time + badge */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-xs text-slate-400">{time}</span>
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
    <section
      className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
      aria-labelledby="reminders-heading"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-slate-500" strokeWidth={1.8} aria-hidden="true" />
          <h2 id="reminders-heading" className="text-sm font-semibold text-slate-900">
            Active Reminders
          </h2>
        </div>
        <a href="#reminders" className="text-xs font-medium text-teal-600 hover:underline">
          View all
        </a>
      </div>

      {/* List */}
      <ul className="grid gap-4">
        {REMINDERS.map((r) => (
          <ReminderRow key={r.title} {...r} />
        ))}
      </ul>
    </section>
  );
}
