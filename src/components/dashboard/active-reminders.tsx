import { Bell, Home, Lightbulb, ShieldAlert, KeyRound, type LucideIcon } from "lucide-react";
import { CardPanel } from "@/components/ui/card-panel";
import { PanelHeader } from "@/components/ui/panel-header";
import { IconBubble } from "@/components/ui/icon-bubble";
import {
  type Priority,
  PRIORITY_BADGE_STYLES,
  ICON_BUBBLE_STYLES,
} from "@/lib/utils/tone-styles";
import {
  getActiveReminderRulesForDashboard,
  getFirstHome,
} from "@/lib/supabase/queries/dashboard";
import {
  severityToPriority,
  categoryToTone,
  formatTime,
} from "@/lib/utils/dashboard-mappers";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReminderDisplayRow {
  icon: LucideIcon;
  title: string;
  sub: string;
  time: string;
  priority: Priority;
}

// ─── Category → icon ─────────────────────────────────────────────────────────

function categoryToIcon(category: string): LucideIcon {
  switch (category) {
    case "lighting": return Lightbulb;
    case "safety":   return ShieldAlert;
    case "access":   return KeyRound;
    default:         return Home;
  }
}

// ─── Priority badge ────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
        PRIORITY_BADGE_STYLES[priority]
      }`}
    >
      {priority}
    </span>
  );
}

// ─── Single reminder row ──────────────────────────────────────────────────────

function ReminderRow({ icon, title, sub, time, priority }: ReminderDisplayRow) {
  const tone = "teal";
  return (
    <li className="flex items-center gap-3">
      <IconBubble icon={icon} colorClass={ICON_BUBBLE_STYLES[tone]} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </p>
        <p className="truncate text-xs text-slate-400 dark:text-slate-500">{sub}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-xs text-slate-400 dark:text-slate-500">{time}</span>
        <PriorityBadge priority={priority} />
      </div>
    </li>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function NoReminders() {
  return (
    <li className="py-4 text-center text-sm text-slate-400 dark:text-slate-500">
      No active reminders 🎉
    </li>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export async function ActiveReminders() {
  const home = await getFirstHome();

  const rawRules = home
    ? await getActiveReminderRulesForDashboard(home.id)
    : [];

  const reminders: ReminderDisplayRow[] = rawRules.map((rule) => ({
    icon:     categoryToIcon(rule.devices.category),
    title:    rule.reminder_text,
    sub:      rule.devices.name,
    time:     formatTime(rule.created_at ?? new Date().toISOString()),
    priority: severityToPriority(rule.severity),
  }));

  return (
    <CardPanel aria-labelledby="reminders-heading">
      <PanelHeader
        icon={Bell}
        title="Active Reminders"
        headingId="reminders-heading"
        viewAllHref="#reminders"
      />
      <ul className="grid gap-4">
        {reminders.length > 0
          ? reminders.map((r) => <ReminderRow key={r.title} {...r} />)
          : <NoReminders />}
      </ul>
    </CardPanel>
  );
}
