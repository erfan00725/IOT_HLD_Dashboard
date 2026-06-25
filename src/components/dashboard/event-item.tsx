import { MapPin, type LucideIcon } from "lucide-react";
import { CardPanel, IconBubble, StatusBadge } from "@/components/ui";
import { ICON_BUBBLE_STYLES, type ToneColor } from "@/lib/utils/tone-styles";

export interface EventItemProps {
  /** Lucide icon shown in the bubble. */
  icon: LucideIcon;
  /** Tone driving the icon bubble colour. */
  tone: ToneColor;
  /** Short wall-clock time, e.g. "8:42 AM". */
  time: string;
  /** Primary line — typically the device name. */
  title: string;
  /** Secondary line — state detail or description. */
  sub: string;
  /** Optional status label rendered as a badge (e.g. "On", "Locked"). */
  statusLabel?: string;
  /** Tone for the status badge. Defaults to `tone`. */
  statusTone?: ToneColor;
  /** Optional location hint, e.g. a room name. */
  room?: string | null;
}

/**
 * A single timeline entry: icon bubble + time + title/description +
 * optional status badge and room.
 *
 * Presentational only — no data fetching, no client state. Reused across
 * the Events timeline and anywhere a compact event row is needed.
 */
export function EventItem({
  icon: Icon,
  tone,
  time,
  title,
  sub,
  statusLabel,
  statusTone,
  room,
}: EventItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
      <IconBubble
        icon={Icon}
        colorClass={ICON_BUBBLE_STYLES[tone]}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
            {title}
          </p>
          <span className="shrink-0 text-xs tabular-nums text-slate-400 dark:text-slate-500">
            {time}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
          {sub}
        </p>
        {(statusLabel || room) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {statusLabel && (
              <StatusBadge label={statusLabel} tone={statusTone ?? tone} />
            )}
            {room && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <MapPin
                  className="size-3.5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                {room}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

export function EmptyEvents({
  hasEvents,
}: {
  hasEvents: boolean;
}) {
  return (
    <CardPanel className="items-center py-12 text-center">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {hasEvents ? "No events match your filters" : "No events yet"}
      </p>
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
        {hasEvents
          ? "Try adjusting your search or category filter."
          : "Device activity will be logged here as it happens."}
      </p>
    </CardPanel>
  );
}
