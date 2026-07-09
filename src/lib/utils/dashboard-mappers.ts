/**
 * Pure mapping/transformation helpers for dashboard data.
 * No Supabase imports — safe to use in both server and client code.
 */

import type { Priority, ToneColor } from "@/lib/utils/tone-styles";
import type { AutomationRule } from "@/lib/types/automation-rule";
import { RulesAutomationType } from "../types/customeTypes";

// ─────────────────────────────────────────────────────────────────────────────
// Shared types (inferred from Supabase join shapes)
// ─────────────────────────────────────────────────────────────────────────────

export interface DeviceStateRow {
  device_external_key: string;
  state_value: string;
  last_seen_at: string;
  devices: {
    name: string;
    category: string;
    expected_safe_state: string;
    active: boolean;
  };
}

export interface ReminderRuleRow {
  id: string;
  reminder_text: string;
  severity: number;
  device_external_key: string;
  devices: { name: string; category: string };
}

export interface StateEventRow {
  id: number;
  device_external_key: string;
  state_value: string;
  observed_at: string;
  devices: { name: string; category: string };
}

export interface AutomationRuleRow {
  id: string;
  reminder_text: string;
  severity: number;
  active: boolean;
  trigger_presence_state: string;
  trigger_device_state: string;
  device_external_key: string;
  devices: { name: string; category: string };
}

// ─────────────────────────────────────────────────────────────────────────────
// Priority mapping  (severity 1-5 → Low / Medium / High)
// ─────────────────────────────────────────────────────────────────────────────

export function severityToPriority(severity: number): Priority {
  if (severity >= 4) return "High";
  if (severity >= 2) return "Medium";
  return "Low";
}

// ─────────────────────────────────────────────────────────────────────────────
// Category → tone colour for icon bubbles
// ─────────────────────────────────────────────────────────────────────────────

export function categoryToTone(category?: string): ToneColor {
  switch (category) {
    case "presence":
      return "teal";
    case "lighting":
      return "amber";
    case "safety":
      return "red";
    case "access":
    case "opening":
      return "slate";
    case "climate":
      return "teal";
    default:
      return "slate";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Device icon name (string) used by the AutomationRules component
//
// NOTE: This helper intentionally returns the icon *name* (a string), not a
// LucideIcon component — it matches the `AutomationRule["icon"]` type so the
// AutomationRules UI can dynamically render the correct icon by name.
//
// The sibling `categoryToIcon` in `device-icons.ts` returns a LucideIcon
// component for direct rendering in reminder/event rows and is a different
// concern, hence the distinct name here.
// ─────────────────────────────────────────────────────────────────────────────

export function categoryToIconName(category?: string): AutomationRule["icon"] {
  switch (category) {
    case "lighting":
      return "lightbulb";
    case "safety":
      return "shield";
    default:
      return "home";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Automation rule mapper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts a raw `reminder_rules` row (with joined `devices`) into the
 * `AutomationRule` shape expected by the `<AutomationRules>` client component.
 */
export function mapRuleToAutomation(row: RulesAutomationType): AutomationRule {
  return {
    id: row.id,
    name: row.reminder_text,
    icon: categoryToIconName(row.devices?.category || undefined),
    iconColor: categoryToTone(row.devices?.category || undefined),
    trigger: `Presence: ${row.trigger_presence_state}`,
    condition: `Device state = ${row.trigger_device_state}`,
    action: row.reminder_text,
    enabled: row.active,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Time formatter
// ─────────────────────────────────────────────────────────────────────────────

/** Formats an ISO timestamp to a short wall-clock string, e.g. "8:42 AM" */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
