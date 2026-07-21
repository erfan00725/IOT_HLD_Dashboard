/**
 * Pure mapping/transformation helpers for dashboard data.
 * No Supabase imports — safe to use in both server and client code.
 */

import type { Priority, ToneColor } from "@/lib/utils/tone-styles";
import type { AutomationRule } from "@/lib/types/automation-rule";
import { RulesAutomationType } from "../types/customeTypes";

// ─────────────────────────────────────────────────────────────────────────────
// Shared types (inferred from the normalized query join shapes)
// ─────────────────────────────────────────────────────────────────────────────

export interface DeviceStateRow {
  external_key: string;
  state_key: string | null;
  is_safe_state: boolean | null;
  last_seen_at: string;
  devices: {
    name: string;
    device_type_id: string;
    device_type_label: string;
    active: boolean;
  };
}

export interface ReminderRuleRow {
  id: string;
  reminder_text: string;
  severity: number;
  external_key: string;
  devices: { name: string; device_type_id: string; device_type_label: string };
}

export interface StateEventRow {
  id: number;
  external_key: string;
  state_key: string | null;
  observed_at: string;
  devices: { name: string; device_type_id: string; device_type_label: string };
}

export interface AutomationRuleRow {
  id: string;
  reminder_text: string;
  severity: number;
  active: boolean;
  trigger_presence_state: string;
  trigger_state_key: string;
  external_key: string;
  devices: { name: string; device_type_id: string; device_type_label: string };
}

// ─────────────────────────────────────────────────────────────────────────────
// Priority mapping  (severity 1-5 → Low / Medium / High)
// ─────────────────────────────────────────────────────────────────────────────

export function severityToPriority(severity: number): Priority {
  if (severity >= 3) return "High";
  if ((severity = 2)) return "Medium";
  return "Low";
}

// ─────────────────────────────────────────────────────────────────────────────
// Device type → tone colour for icon bubbles
// ─────────────────────────────────────────────────────────────────────────────

export function deviceTypeToTone(deviceTypeId?: string): ToneColor {
  switch (deviceTypeId) {
    case "presence":
      return "teal";
    case "switch":
      return "amber";
    case "lock":
      return "slate";
    case "item":
      return "slate";
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
// The sibling `deviceTypeToIcon` in `device-icons.ts` returns a LucideIcon
// component for direct rendering in reminder/event rows and is a different
// concern, hence the distinct name here.
// ─────────────────────────────────────────────────────────────────────────────

export function deviceTypeToIconName(
  deviceTypeId?: string,
): AutomationRule["icon"] {
  switch (deviceTypeId) {
    case "switch":
      return "lightbulb";
    case "lock":
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
    icon: deviceTypeToIconName(row.devices?.device_type_id || undefined),
    iconColor: deviceTypeToTone(row.devices?.device_type_id || undefined),
    trigger: `Presence: ${row.trigger_presence_state}`,
    condition: `Device state = ${row.trigger_state_key}`,
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
