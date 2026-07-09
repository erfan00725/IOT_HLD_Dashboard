/**
 * Pure helpers that derive dashboard status-tile data from raw query results.
 *
 * Extracted from `home-status-section-client.tsx` (Step 6 + feedback round) so
 * the domain logic is decoupled from the React view layer and can be tested
 * in isolation.
 */

import {
  PersonStanding,
  Lightbulb,
  Grid2x2,
  KeyRound,
  LockKeyhole,
} from "lucide-react";

import { formatTime } from "@/lib/utils/dashboard-mappers";
import type {
  StatusTileData,
  DashboardDeviceState,
  ActiveSession,
  HomeRecord,
} from "@/lib/types/dashboard";

// ─────────────────────────────────────────────────────────────────────────────
// Selectors — pure domain helpers (no React import)
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the first device-state row matching a category, or undefined. */
export function findByCategory(
  states: DashboardDeviceState[],
  category: string,
): DashboardDeviceState | undefined {
  return states.find((d) => d.devices?.category === category);
}

/** Returns the raw `state_value` for a category, or `null` when absent. */
export function stateOf(
  states: DashboardDeviceState[],
  category: string,
): string | null {
  return findByCategory(states, category)?.state_value ?? null;
}

/** Counts lighting devices whose state is not "off". */
export function countLightsOn(states: DashboardDeviceState[]): number {
  return states.filter(
    (d) =>
      d.devices?.category === "lighting" &&
      d.state_value.toLowerCase() !== "off",
  ).length;
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading placeholder tiles — shared by every loading/error branch
// ─────────────────────────────────────────────────────────────────────────────

const LOADING_TILE_DEFINITIONS = [
  { icon: PersonStanding, label: "Home", sub: "Loading…" },
  { icon: Lightbulb, label: "Lights", sub: "Loading…" },
  { icon: Grid2x2, label: "Stove", sub: "Loading…" },
  { icon: KeyRound, label: "Keys", sub: "Loading…" },
  { icon: LockKeyhole, label: "Door", sub: "Loading…" },
] as const;

/**
 * Factory returning the five loading-placeholder tiles.
 *
 * Replaces the repeated inline object literals that appeared five times in the
 * original loading branch of `buildStatusTiles`.
 */
export function createLoadingTiles(): StatusTileData[] {
  return LOADING_TILE_DEFINITIONS.map((t) => ({
    ...t,
    tone: "slate" as const,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// buildStatusTiles — the main pure function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds the array of `<StatusTile>` data for the home-status section.
 *
 * @param homeData       The `home` record (may be undefined while loading).
 * @param states         Raw device-state rows from the dashboard query.
 * @param session        The active away-session, or `null` when the user is home.
 * @param loading        Whether the query (or debounced refetch) is in flight.
 * @param queryError     Error from the query, if any.
 */
export function buildStatusTiles(
  homeData: HomeRecord | undefined,
  states: DashboardDeviceState[],
  session: ActiveSession,
  loading: boolean,
  queryError: Error | null,
): StatusTileData[] {
  if (loading || queryError || !homeData) {
    return createLoadingTiles();
  }

  // ── Presence ─────────────────────────────────────────────────────────
  const presenceTile: StatusTileData = session
    ? {
        icon: PersonStanding,
        label: "Away",
        sub: `Since ${formatTime(session.started_at)}`,
        tone: "teal",
      }
    : {
        icon: PersonStanding,
        label: "Home",
        sub: "You are home",
        tone: "slate",
      };

  // ── Lighting ─────────────────────────────────────────────────────────
  const lightsOnCount = countLightsOn(states);
  const lightingTile: StatusTileData =
    lightsOnCount > 0
      ? {
          icon: Lightbulb,
          label: "Lights On",
          sub: `${lightsOnCount} device${lightsOnCount > 1 ? "s" : ""}`,
          tone: "amber",
        }
      : {
          icon: Lightbulb,
          label: "Lights Off",
          sub: "All clear",
          tone: "teal",
        };

  // ── Safety / Stove ──────────────────────────────────────────────────
  const safetyState = stateOf(states, "safety");
  const stoveTile: StatusTileData =
    safetyState === null
      ? { icon: Grid2x2, label: "Stove", sub: "No sensor", tone: "slate" }
      : safetyState.toLowerCase() === "safe"
        ? {
            icon: Grid2x2,
            label: "Stove Off",
            sub: "All Clear",
            tone: "teal",
          }
        : {
            icon: Grid2x2,
            label: "Stove On",
            sub: "Check stove",
            tone: "red",
          };

  // ── Access / Keys ────────────────────────────────────────────────────
  const accessState = stateOf(states, "access");
  const keyTile: StatusTileData =
    accessState === null
      ? { icon: KeyRound, label: "Keys", sub: "No tracker", tone: "slate" }
      : accessState.toLowerCase() === "detected"
        ? {
            icon: KeyRound,
            label: "Keys Detected",
            sub: "Found nearby",
            tone: "teal",
          }
        : {
            icon: KeyRound,
            label: "Keys Missing",
            sub: "Not detected",
            tone: "red",
          };

  // ── Opening / Door ──────────────────────────────────────────────────
  const doorState = stateOf(states, "opening");
  const doorTile: StatusTileData =
    doorState === null
      ? {
          icon: LockKeyhole,
          label: "Door",
          sub: "No sensor",
          tone: "slate",
        }
      : doorState.toLowerCase() === "locked"
        ? {
            icon: LockKeyhole,
            label: "Door Locked",
            sub: "Front Door",
            tone: "teal",
          }
        : {
            icon: LockKeyhole,
            label: "Door Unlocked",
            sub: "Front Door",
            tone: "red",
          };

  return [presenceTile, lightingTile, stoveTile, keyTile, doorTile];
}
