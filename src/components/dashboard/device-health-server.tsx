/**
 * Server wrapper that fetches real device health data and passes
 * pre-computed segment counts to the <DeviceHealthChart> client component.
 */
import { DeviceHealthChart } from "./device-health";
import {
  getDashboardDeviceStates,
  getFirstHome,
} from "@/lib/supabase/queries/dashboard";

/** A device is considered online when its state matches expected_safe_state. */
function classifyDevice(stateValue: string, expectedSafeState: string): "Online" | "Warning" | "Offline" {
  const v = stateValue?.toLowerCase() ?? "";
  // Explicit offline markers
  if (["offline", "disconnected", "unreachable", "error"].includes(v))
    return "Offline";
  // If state matches the expected safe state → online
  if (v === expectedSafeState?.toLowerCase()) return "Online";
  // Otherwise it's active but in an unsafe state → warning
  return "Warning";
}

export async function DeviceHealth() {
  const home = await getFirstHome();

  // Default segments when no home / no devices
  const fallback = {
    segments: [
      { label: "Online",  count: 0, pct: 0,   color: "#0d9488" },
      { label: "Warning", count: 0, pct: 0,   color: "#f59e0b" },
      { label: "Offline", count: 0, pct: 100, color: "#ef4444" },
    ],
    total: 0,
    hasWarning: false,
  };

  if (!home) return <DeviceHealthChart {...fallback} />;

  const deviceStates = await getDashboardDeviceStates(home.id);

  // Only count active devices
  const activeStates = deviceStates.filter((d) => d.devices.active);
  const total = activeStates.length;

  if (total === 0) return <DeviceHealthChart {...fallback} />;

  // Tally by classification
  const counts = { Online: 0, Warning: 0, Offline: 0 };
  for (const d of activeStates) {
    const cls = classifyDevice(d.state_value, d.devices.expected_safe_state);
    counts[cls]++;
  }

  const pct = (n: number) => Math.round((n / total) * 100);

  const segments = [
    { label: "Online",  count: counts.Online,  pct: pct(counts.Online),  color: "#0d9488" },
    { label: "Warning", count: counts.Warning, pct: pct(counts.Warning), color: "#f59e0b" },
    { label: "Offline", count: counts.Offline, pct: pct(counts.Offline), color: "#ef4444" },
  ];

  return (
    <DeviceHealthChart
      segments={segments}
      total={total}
      hasWarning={counts.Warning > 0 || counts.Offline > 0}
    />
  );
}
