/**
 * Pure helpers that derive dashboard status-tile data from raw query results.
 *
 * Extracted from `home-status-section-client.tsx` (Step 6 + feedback round) so
 * the domain logic is decoupled from the React view layer and can be tested
 * in isolation.
 *
 * The five hero tiles map to specific seeded devices by `external_key`
 * (presence_main / kitchen_light / kitchen_gas_stove / house_keys /
 * front_door_lock) because several of them share the same `device_type_id`
 * (e.g. the light and the stove are both `switch`).
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

// Seeded external keys for the five hero devices.
const DEVICE_KEYS = {
  presence: "presence_main",
  light: "kitchen_light",
  stove: "kitchen_gas_stove",
  keys: "house_keys",
  door: "front_door_lock",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Selectors — pure domain helpers (no React import)
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the device-state row for a given external key, or undefined. */
export function findByKey(
  states: DashboardDeviceState[],
  externalKey: string,
): DashboardDeviceState | undefined {
  return states.find((d) => d.external_key === externalKey);
}

/** Returns the raw `state_key` for a device external key, or `null`. */
export function stateOf(
  states: DashboardDeviceState[],
  externalKey: string,
): string | null {
  return findByKey(states, externalKey)?.state_key ?? null;
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

  // ── Lighting (kitchen_light switch: "on"/"off") ──────────────────────
  const lightState = stateOf(states, DEVICE_KEYS.light);
  const lightingTile: StatusTileData =
    lightState === null
      ? { icon: Lightbulb, label: "Lights", sub: "No sensor", tone: "slate" }
      : lightState.toLowerCase() === "on"
        ? {
            icon: Lightbulb,
            label: "Lights On",
            sub: "Kitchen light",
            tone: "amber",
          }
        : {
            icon: Lightbulb,
            label: "Lights Off",
            sub: "All clear",
            tone: "teal",
          };

  // ── Safety / Stove (kitchen_gas_stove switch: "on"/"off") ────────────
  const stoveState = stateOf(states, DEVICE_KEYS.stove);
  const stoveTile: StatusTileData =
    stoveState === null
      ? { icon: Grid2x2, label: "Stove", sub: "No sensor", tone: "slate" }
      : stoveState.toLowerCase() === "off"
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

  // ── Item / Keys (house_keys item: "taken"/"missing") ─────────────────
  const keysState = stateOf(states, DEVICE_KEYS.keys);
  const keyTile: StatusTileData =
    keysState === null
      ? { icon: KeyRound, label: "Keys", sub: "No tracker", tone: "slate" }
      : keysState.toLowerCase() === "taken"
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

  // ── Lock / Door (front_door_lock lock: "locked"/"unlocked") ──────────
  const doorState = stateOf(states, DEVICE_KEYS.door);
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
