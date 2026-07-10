import { type LucideIcon } from "lucide-react";
import { IconBubble } from "./icon-bubble";
import { PriorityBadge } from "./priority-badge";
import {
  ICON_BUBBLE_STYLES,
  type Priority,
  type ToneColor,
} from "@/lib/utils/tone-styles";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReminderDisplayRow {
  icon: LucideIcon;
  title: string;
  sub: string;
  time: string;
  priority: Priority;
  tone?: ToneColor;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Shared reminder row used in both the dashboard panel and the away-alert
 * modal. Defaults to the teal tone so callers only need to supply it when
 * they want a different colour.
 */
export function ReminderRow({
  icon,
  title,
  sub,
  time,
  priority,
  tone = "teal" as ToneColor,
}: ReminderDisplayRow) {
  return (
    <li className="flex items-center gap-3">
      <IconBubble icon={icon} colorClass={ICON_BUBBLE_STYLES[tone]} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="max-w-full truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </p>
        <p className="truncate text-xs text-slate-400 dark:text-slate-500">
          {sub}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {time}
        </span>
        <PriorityBadge priority={priority} />
      </div>
    </li>
  );
}
