"use client";

import { Home, RefreshCw, Wifi } from "lucide-react";
import { CardPanel, PanelHeader, StatusTile, AwayAlertModal } from "../ui";
import { buildStatusTiles } from "@/lib/utils/dashboard-tiles";
import type { StatusTileData } from "@/lib/types/dashboard";
import { useDashboardStatus } from "@/context/dashboard-status-context";

// ─────────────────────────────────────────────────────────────────────────────
// Header actions (connection status + refresh button)
// ─────────────────────────────────────────────────────────────────────────────

const HeaderActions = ({
  isConnected,
  refetch,
}: {
  isConnected?: boolean;
  refetch: () => void;
}) => (
  <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
    <div className="flex items-center gap-1">
      <Wifi className="size-3.5" strokeWidth={2} aria-hidden="true" />
      <span>{isConnected ? "Connected" : "Disconnected"}</span>
    </div>
    <button
      type="button"
      className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label="Refresh home status"
      onClick={() => void refetch()}
    >
      <RefreshCw className="size-3.5" strokeWidth={2} aria-hidden="true" />
      <span>Refresh</span>
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Client component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `HomeStatusSectionClient`
 *
 * Thin presentation layer that consumes the `useDashboardStatusRefresh` hook
 * (React Query + MQTT debounce + away-alert transition) and renders the
 * status tile grid. All domain logic lives in the hook and in the pure
 * `buildStatusTiles()` helper under `src/lib/utils/`.
 */
export function HomeStatusSectionClient() {
  const {
    data,
    isLoading,
    error,
    isConnected,
    refetch,
    activeSession,
    showAwayAlert,
    awayStartedAt,
    dismissAwayAlert,
  } = useDashboardStatus();

  const home = data?.home;
  const deviceStates = data?.deviceStates ?? [];

  const tiles: StatusTileData[] = buildStatusTiles(
    home,
    deviceStates,
    activeSession,
    isLoading,
    error,
  );

  return (
    <>
      <AwayAlertModal
        isOpen={showAwayAlert}
        onClose={dismissAwayAlert}
        startedAt={awayStartedAt}
      />
      <CardPanel className="p-5 sm:p-6" aria-labelledby="home-status-heading">
        <PanelHeader
          icon={Home}
          title={home ? home.name : "Home Status"}
          headingId="home-status-heading"
          short_description="Live snapshot"
          actions={
            <HeaderActions isConnected={isConnected} refetch={refetch} />
          }
        />
        <div className="mt-5 flex items-center justify-between gap-3">
          {error ? (
            <span className="text-xs text-red-500">Unable to load status</span>
          ) : null}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {tiles.map((tile) => (
            <StatusTile key={tile.label} {...tile} />
          ))}
        </div>
      </CardPanel>
    </>
  );
}
