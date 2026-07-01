import { type Priority, PRIORITY_BADGE_STYLES } from "@/lib/utils/tone-styles";

/**
 * PriorityBadge — small pill showing a reminder's priority level (High / Medium / Low).
 *
 * Extracted from the dashboard's ActiveReminders widget so it can be reused across
 * the Reminders page table and any other context that needs a priority indicator.
 */
export function PriorityBadge({ priority }: { priority: Priority }) {
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
