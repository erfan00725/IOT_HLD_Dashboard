/**
 * Device-health classification helpers.
 *
 * Pure functions — no Supabase imports — so they can be used safely in both
 * server components (DeviceHealth chart, AppShell SystemStatus) and tests.
 */

// Shape returned by `getDashboardDeviceStates` in `queries/dashboard.ts`.
export interface DeviceStateEntry {
  state_value: string;
  devices: {
    expected_safe_state: string;
    active: boolean;
  };
}

export type DeviceClass = "Online" | "Warning" | "Offline";

/** A device is considered online when its state matches expected_safe_state. */
export function classifyDevice(
  stateValue: string,
  expectedSafeState: string,
): DeviceClass {
  const v = stateValue?.toLowerCase() ?? "";
  // Explicit offline markers
  if (["offline", "disconnected", "unreachable", "error"].includes(v))
    return "Offline";
  // If state matches the expected safe state → online
  if (v === expectedSafeState?.toLowerCase()) return "Online";
  // Otherwise it's active but in an unsafe state → warning
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
  states: DeviceStateEntry[],
): DeviceHealthSummary {
  const active = states.filter((s) => s.devices.active);
  const total = active.length;
  if (total === 0) return EMPTY_SUMMARY;

  const counts = { Online: 0, Warning: 0, Offline: 0 };
  for (const s of active) {
    counts[classifyDevice(s.state_value, s.devices.expected_safe_state)]++;
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
