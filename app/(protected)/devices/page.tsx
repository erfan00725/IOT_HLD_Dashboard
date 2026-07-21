import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getDevicesPageData,
  getFirstHome,
  type DevicesPageDevice,
} from "@/lib/prisma/queries/dashboard";
import { AppShell } from "@/components/layout/app-shell";
import { DevicesSummary } from "@/components/dashboard/devices-summary";
import { DeviceGrid } from "@/components/dashboard/device-grid";
import { ROUT_PATHS } from "@/lib/constants/routPaths";
import { classifyDevice } from "@/lib/utils/device-health";

/**
 * A server-side protected page.
 * Users who are not authenticated are redirected to /login.
 */
export default async function DevicesPage() {
  const supabase = await createClient();

  // Fast local JWT validation (no network call).
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    redirect(ROUT_PATHS.LOGIN);
  }

  const home = await getFirstHome();
  const devices = home ? await getDevicesPageData(home.id) : [];

  const summary = computeSummary(devices);

  return (
    <AppShell
      pageTitle="Devices"
      pageSubtitle="Manage and monitor every device in your home"
    >
      <div className="grid gap-6">
        {/* ── Summary row ─────────────────────────────────────────────── */}
        <DevicesSummary {...summary} />

        {/* ── Search + filter + grid ──────────────────────────────────── */}
        <DeviceGrid devices={devices} />
      </div>
    </AppShell>
  );
}

// ─── Summary helper ────────────────────────────────────────────────────────

function computeSummary(devices: DevicesPageDevice[]) {
  let online = 0;
  let warning = 0;
  let offline = 0;

  for (const d of devices) {
    if (!d.active) continue;
    if (!d.state_key) {
      offline += 1;
      continue;
    }
    const c = classifyDevice(d.state_key, d.is_safe_state);
    if (c === "Online") online += 1;
    else if (c === "Warning") warning += 1;
    else offline += 1;
  }

  return { total: devices.length, online, warning, offline };
}
