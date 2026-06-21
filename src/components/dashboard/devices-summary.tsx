import { Cpu, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { CardPanel, StatusTile } from "@/components/ui";

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
 * Reuses the shared `StatusTile` primitive (the same one the dashboard
 * hero row uses) so the visual language stays consistent.
 */
export function DevicesSummary({
  total,
  online,
  offline,
  warning,
}: DevicesSummaryProps) {
  return (
    <CardPanel className="gap-4 p-5 sm:p-6" aria-labelledby="devices-summary-heading">
      <h2
        id="devices-summary-heading"
        className="text-sm font-semibold text-slate-900 dark:text-slate-100"
      >
        Overview
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatusTile
          icon={Cpu}
          label={String(total)}
          sub="Total devices"
          tone="slate"
        />
        <StatusTile
          icon={Wifi}
          label={String(online)}
          sub="Online"
          tone="teal"
        />
        <StatusTile
          icon={AlertTriangle}
          label={String(warning)}
          sub="Warnings"
          tone="amber"
        />
        <StatusTile
          icon={WifiOff}
          label={String(offline)}
          sub="Offline"
          tone="red"
        />
      </div>
    </CardPanel>
  );
}
