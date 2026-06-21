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
  type LucideIcon,
} from "lucide-react";

const DEVICE_ICON_BY_CATEGORY: Record<string, LucideIcon> = {
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
  return DEVICE_ICON_BY_CATEGORY[category] ?? Cpu;
}

/** Human-readable label for a device category slug. */
export function deviceCategoryLabel(category?: string | null): string {
  if (!category) return "Device";
  return category.charAt(0).toUpperCase() + category.slice(1);
}
