/**
 * Pure helpers for the Events page: date bucketing, relative day labels,
 * and event-state → tone mapping. No Supabase or React imports, so they are
 * safe to call from both server and client components.
 */

import type { ToneColor } from "@/lib/utils/tone-styles";

// ---------------------------------------------------------------------------
// Day bucketing
// ---------------------------------------------------------------------------

export interface DayBucket<T> {
  /** ISO date key, e.g. "2026-06-21". */
  key: string;
  /** Human-readable label, e.g. "Today", "Yesterday", "Jun 19". */
  label: string;
  items: T[];
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isoDateKey(d: Date): string {
  // Local YYYY-MM-DD, so events group by the user's calendar day.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Computes the label for a given date relative to "today".
 * Returns "Today" / "Yesterday" / "<Weekday>" (within 7 days) / "Mon D".
 */
export function relativeDayLabel(date: Date, now: Date = new Date()): string {
  const today = startOfDay(now);
  const target = startOfDay(date);
  const diffDays = Math.round(
    (today.getTime() - target.getTime()) / 86_400_000,
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 0 && diffDays < 7) {
    return target.toLocaleDateString("en-US", { weekday: "long" });
  }
  return target.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Groups a list of timestamped items into day buckets, newest day first.
 * Within each day the original order of `items` is preserved — so pass the
 * items pre-sorted (newest first) to keep the timeline chronological.
 */
export function groupByDay<T>(
  items: T[],
  getTimestamp: (item: T) => string | Date,
  now: Date = new Date(),
): DayBucket<T>[] {
  const buckets = new Map<string, DayBucket<T>>();

  for (const item of items) {
    const raw = getTimestamp(item);
    const date = raw instanceof Date ? raw : new Date(raw);
    const key = isoDateKey(date);

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { key, label: relativeDayLabel(date, now), items: [] };
      buckets.set(key, bucket);
    }
    bucket.items.push(item);
  }

  // Sort buckets by date descending (newest first).
  return Array.from(buckets.values()).sort((a, b) =>
    a.key < b.key ? 1 : a.key > b.key ? -1 : 0,
  );
}

// ---------------------------------------------------------------------------
// Event-state → tone
// ---------------------------------------------------------------------------

/**
 * Maps a raw device-state value to a semantic tone for badges and accents.
 * - "warning" / "on" (when unsafe) → amber
 * - "off" / safe states → teal
 * - unknown → slate
 */
export function eventStateToTone(stateValue?: string | null): ToneColor {
  const v = stateValue?.toLowerCase() ?? "";
  if (!v) return "slate";
  if (v === "warning") return "amber";
  if (v === "off" || v === "locked" || v === "safe" || v === "home")
    return "teal";
  if (v === "on" || v === "unlocked" || v === "taken") return "amber";
  if (v === "alert" || v === "triggered") return "red";
  return "slate";
}

/** Title-cased label for a raw state value, e.g. "on" → "On". */
export function eventStateLabel(stateValue?: string | null): string {
  if (!stateValue) return "Unknown";
  return stateValue.charAt(0).toUpperCase() + stateValue.slice(1).toLowerCase();
}

/** Checks whether an event's ISO timestamp falls on the same day as `now`. */
export function isToday(
  timestamp: string | Date,
  now: Date = new Date(),
): boolean {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return isoDateKey(date) === isoDateKey(now);
}
