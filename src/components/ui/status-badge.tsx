import { cn } from "@/lib/utils/utils";
import {
  type ToneColor,
  STATUS_TILE_ICON_STYLES,
} from "@/lib/utils/tone-styles";

// Mapping tone to a soft background for the badge itself.
const BADGE_BG: Record<ToneColor, string> = {
  teal: "bg-teal-50 dark:bg-teal-900/30",
  amber: "bg-amber-50 dark:bg-amber-900/30",
  red: "bg-red-50 dark:bg-red-900/30",
  slate: "bg-slate-100 dark:bg-slate-800",
};

const DOT_COLOR: Record<ToneColor, string> = {
  teal: "bg-teal-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  slate: "bg-slate-400",
};

interface StatusBadgeProps {
  label: string;
  tone: ToneColor;
}

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        BADGE_BG[tone],
        STATUS_TILE_ICON_STYLES[tone],
      )}
    >
      <span className={cn("size-1.5 rounded-full", DOT_COLOR[tone])} />
      {label}
    </span>
  );
}
