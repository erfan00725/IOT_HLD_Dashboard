/**
 * Device-category → Lucide icon mapping, shared by device page components.
 *
 * Kept separate from `dashboard-mappers.ts` so the latter can stay free of
 * React/Lucide imports (it is imported from both server and client code).
 */

import {
  PersonStanding,
  Lightbulb,
  ShieldAlert,
  KeyRound,
  LockKeyhole,
  Thermometer,
  Plug,
  Cpu,
  Clock,
  Home,
  type LucideIcon,
} from "lucide-react";

/**
 * Comprehensive category → icon mapping used across dashboard components.
 * Covers presence, lighting, safety, access, opening, climate, and utility.
 */
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  presence: PersonStanding,
  lighting: Lightbulb,
  safety: ShieldAlert,
  access: KeyRound,
  opening: LockKeyhole,
  climate: Thermometer,
  utility: Plug,
};

/** Returns a Lucide icon for a device category, falling back to `Cpu`. */
export function deviceCategoryToIcon(category?: string | null): LucideIcon {
  if (!category) return Cpu;
  return CATEGORY_ICON_MAP[category] ?? Cpu;
}

/**
 * Maps a device category to a Lucide icon for display in reminder/event rows.
 * Falls back to `Home` for unknown categories by default (configurable).
 */
export function categoryToIcon(
  category?: string,
  fallback: LucideIcon = Home,
): LucideIcon {
  if (!category) return fallback;
  return CATEGORY_ICON_MAP[category] ?? fallback;
}

/** Human-readable label for a device category slug. */
export function deviceCategoryLabel(category?: string | null): string {
  if (!category) return "Device";
  return category.charAt(0).toUpperCase() + category.slice(1);
}
