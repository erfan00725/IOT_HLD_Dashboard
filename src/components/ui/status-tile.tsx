import type { LucideIcon } from "lucide-react";
import {
  type ToneColor,
  ICON_BUBBLE_STYLES,
  STATUS_TILE_ICON_STYLES,
} from "@/lib/utils/tone-styles";

interface StatusTileProps {
  icon: LucideIcon;
  label: string;
  sub: string;
  tone: ToneColor;
}

export function StatusTile({ icon: Icon, label, sub, tone }: StatusTileProps) {
  return (
    <div
      className={`flex flex-col items-start gap-3 rounded-2xl ${
        ICON_BUBBLE_STYLES[tone]
      } p-4 transition-shadow hover:shadow-sm`}
    >
      <Icon
        className={`size-7 ${STATUS_TILE_ICON_STYLES[tone]}`}
        strokeWidth={1.6}
        aria-hidden="true"
      />
      <div className="leading-tight">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {sub}
        </p>
      </div>
    </div>
  );
}
