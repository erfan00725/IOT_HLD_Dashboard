import type { LucideIcon } from "lucide-react";
import type { ToneColor } from "@/lib/utils/tone-styles";
import type { fetchDashboardStatus } from "@/lib/api/dashboard";

/**
 * UI-facing tile data produced by `buildStatusTiles()` and consumed by the
 * `<StatusTile>` grid in `home-status-section-client.tsx`.
 */
export interface StatusTileData {
  icon: LucideIcon;
  label: string;
  sub: string;
  tone: ToneColor;
}

/**
 * A single device-state row from the dashboard status response, inferred from
 * `fetchDashboardStatus`.
 */
export type DashboardDeviceState =
  Awaited<ReturnType<typeof fetchDashboardStatus>> extends {
    deviceStates: (infer S)[];
  }
    ? S
    : never;

/** The `home` record from the dashboard status response. */
export type HomeRecord = Awaited<
  ReturnType<typeof fetchDashboardStatus>
>["home"];

/** The `activeSession` record from the dashboard status response. */
export type ActiveSession = Awaited<
  ReturnType<typeof fetchDashboardStatus>
>["activeSession"];
