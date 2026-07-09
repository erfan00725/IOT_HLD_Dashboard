/**
 * Centralised Tailwind colour token maps shared across dashboard components.
 * Every component that renders a coloured icon bubble, badge, or status tile
 * imports from here — the palette is defined exactly once.
 */

// ---------------------------------------------------------------------------
// Icon bubble colours (background + icon text)
// ---------------------------------------------------------------------------
export type ToneColor = "teal" | "amber" | "red" | "slate";

export const ICON_BUBBLE_STYLES: Record<ToneColor, string> = {
  teal: "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
  amber: "bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400",
  red: "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400",
  slate: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
};

// ---------------------------------------------------------------------------
// Priority badge colours (for PriorityBadge in active-reminders)
// ---------------------------------------------------------------------------
export type Priority = "High" | "Medium" | "Low";

export const PRIORITY_BADGE_STYLES: Record<Priority, string> = {
  High: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 ring-red-200 dark:ring-red-700",
  Medium:
    "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 ring-amber-200 dark:ring-amber-700",
  Low: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 ring-slate-200 dark:ring-slate-600",
};

// ---------------------------------------------------------------------------
// StatusCard hint-badge colours
// ---------------------------------------------------------------------------
export const STATUS_CARD_TONE_STYLES: Record<
  "teal" | "slate" | "amber",
  string
> = {
  teal: "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 ring-1 ring-inset ring-teal-200 dark:ring-teal-700",
  slate:
    "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-200 dark:ring-slate-600",
  amber:
    "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-200 dark:ring-amber-700",
};

// ---------------------------------------------------------------------------
// Device classification → tone (used in DeviceCard status badges)
// ---------------------------------------------------------------------------

export type DeviceClassification = "Online" | "Warning" | "Offline";

export function classificationToTone(
  classification: DeviceClassification,
): ToneColor {
  const MAP: Record<DeviceClassification, ToneColor> = {
    Online: "teal",
    Warning: "amber",
    Offline: "red",
  };
  return MAP[classification];
}

// ---------------------------------------------------------------------------
// Status tile icon colours (used in HomeStatusSection)
// ---------------------------------------------------------------------------

export const STATUS_TILE_ICON_STYLES: Record<ToneColor, string> = {
  teal: "text-teal-600 dark:text-teal-400",
  amber: "text-amber-500 dark:text-amber-400",
  red: "text-red-500 dark:text-red-400",
  slate: "text-slate-500 dark:text-slate-400",
};
