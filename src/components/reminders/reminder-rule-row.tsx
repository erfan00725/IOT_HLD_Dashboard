import { MoreVertical, type LucideIcon } from "lucide-react";
import { IconBubble, Toggle, PriorityBadge } from "@/components/ui";
import {
  ICON_BUBBLE_STYLES,
  type ToneColor,
  type Priority,
} from "@/lib/utils/tone-styles";
import { deviceTypeToIcon } from "@/lib/utils/device-icons";
import { severityToPriority } from "@/lib/utils/dashboard-mappers";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ReminderRuleRowData {
  id: string;
  reminder_text: string;
  severity: number;
  active: boolean;
  trigger_presence_state: string | null;
  trigger_state_key: string;
  device_name: string | null;
  device_type_id: string | null;
}

interface ReminderRuleRowProps {
  rule: ReminderRuleRowData;
  onToggle: (id: string, value: boolean) => void;
  pending: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Maps a device type to a tone colour for the icon bubble. */
function deviceTypeToTone(deviceTypeId?: string | null): ToneColor {
  switch (deviceTypeId) {
    case "presence":
      return "teal";
    case "switch":
      return "amber";
    case "lock":
      return "slate";
    default:
      return "slate";
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * A single presentational `<tr>` row for the reminder rules table.
 *
 * Displays: icon + rule name, device, trigger, condition, priority badge,
 * active toggle, and a context menu button.
 *
 * Pure presentational — no data fetching, no state management.
 */
export function ReminderRuleRow({
  rule,
  onToggle,
  pending,
}: ReminderRuleRowProps) {
  const Icon: LucideIcon = deviceTypeToIcon(rule.device_type_id);
  const tone: ToneColor = deviceTypeToTone(rule.device_type_id);
  const priority: Priority = severityToPriority(rule.severity);

  return (
    <tr className="group border-t border-slate-100 dark:border-slate-700/60 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/60">
      {/* Rule name */}
      <td className="py-3.5 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <IconBubble
            icon={Icon}
            colorClass={ICON_BUBBLE_STYLES[tone]}
            size="sm"
          />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {rule.reminder_text}
          </span>
        </div>
      </td>

      {/* Device */}
      <td className="hidden px-3 py-3.5 text-sm text-slate-500 dark:text-slate-400 sm:table-cell">
        {rule.device_name ?? "—"}
      </td>

      {/* Trigger */}
      <td className="hidden px-3 py-3.5 text-sm text-slate-500 dark:text-slate-400 md:table-cell">
        {rule.trigger_presence_state
          ? `Presence: ${rule.trigger_presence_state}`
          : "—"}
      </td>

      {/* Condition */}
      <td className="hidden px-3 py-3.5 text-sm text-slate-500 dark:text-slate-400 lg:table-cell">
        State = {rule.trigger_state_key}
      </td>

      {/* Priority */}
      <td className="py-3.5 px-3">
        <PriorityBadge priority={priority} />
      </td>

      {/* Toggle + Actions */}
      <td className="py-3.5 pl-3 pr-4">
        <div className="flex items-center justify-end gap-3">
          <Toggle
            enabled={rule.active}
            disabled={pending}
            onChange={(v) => onToggle(rule.id, v)}
          />
          <button
            aria-label={`More options for ${rule.reminder_text}`}
            className="rounded-lg p-1 text-slate-400 dark:text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:opacity-100"
          >
            <MoreVertical
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>
        </div>
      </td>
    </tr>
  );
}
