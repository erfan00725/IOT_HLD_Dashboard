import { Cpu, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { SummaryPanel } from "@/components/ui/summary-panel";

interface DevicesSummaryProps {
  total: number;
  online: number;
  offline: number;
  warning: number;
}

/**
 * A compact row of summary tiles shown at the top of the devices page:
 * Total, Online, Offline, Warnings.
 *
 * Delegates layout to the shared `<SummaryPanel>` component.
 */
export function DevicesSummary({
  total,
  online,
  offline,
  warning,
}: DevicesSummaryProps) {
  return (
    <SummaryPanel
      headingId="devices-summary-heading"
      tiles={[
        {
          icon: Cpu,
          label: String(total),
          sub: "Total devices",
          tone: "slate",
        },
        { icon: Wifi, label: String(online), sub: "Online", tone: "teal" },
        {
          icon: AlertTriangle,
          label: String(warning),
          sub: "Warnings",
          tone: "amber",
        },
        { icon: WifiOff, label: String(offline), sub: "Offline", tone: "red" },
      ]}
    />
  );
}
