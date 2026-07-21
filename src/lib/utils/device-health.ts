/**
 * Device-health classification helpers.
 *
 * Pure functions — no Supabase imports — so they can be used safely in both
 * server components (DeviceHealth chart, AppShell SystemStatus) and tests.
 */

import { DashboardDeviceStateType } from "../types/customeTypes";

export type DeviceClass = "Online" | "Warning" | "Offline";

/**
 * Classifies a device from its latest reported state.
 *
 * - No state reported yet → Offline.
 * - State is the device type's safe state → Online.
 * - State is a non-safe (attention) state → Warning.
 *
 * `isSafeState` comes from the joined `device_type_states.is_safe_state`.
 */
export function classifyDevice(
  stateKey?: string | null,
  isSafeState?: boolean | null,
): DeviceClass {
  if (!stateKey) return "Offline";
  if (isSafeState) return "Online";
  return "Warning";
}

/** Coarse health status for chrome/UI badges. */
export type SystemHealthStatus = "secure" | "warning" | "offline";

export interface DeviceHealthSummary {
  online: number;
  warning: number;
  offline: number;
  total: number;
  status: SystemHealthStatus;
}

const EMPTY_SUMMARY: DeviceHealthSummary = {
  online: 0,
  warning: 0,
  offline: 0,
  total: 0,
  status: "secure",
};

/**
 * Tally a set of device states into Online/Warning/Offline counts and derive
 * a coarse `status`. Only `active` devices are counted.
 */
export function summarizeDeviceHealth(
  states: DashboardDeviceStateType[],
): DeviceHealthSummary {
  const active = states.filter((s) => s.devices?.active);
  const total = active.length;
  if (total === 0) return EMPTY_SUMMARY;

  const counts = { Online: 0, Warning: 0, Offline: 0 };
  for (const s of active) {
    counts[classifyDevice(s.state_key, s.is_safe_state)]++;
  }

  let status: SystemHealthStatus = "secure";
  if (counts.Offline > 0) status = "offline";
  else if (counts.Warning > 0) status = "warning";

  return {
    online: counts.Online,
    warning: counts.Warning,
    offline: counts.Offline,
    total,
    status,
  };
}
