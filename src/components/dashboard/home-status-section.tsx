import {
  PersonStanding,
  Lightbulb,
  Grid2x2,
  KeyRound,
  LockKeyhole,
  Home,
  Wifi,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { type ToneColor } from "@/lib/utils/tone-styles";
import { CardPanel, PanelHeader, StatusTile } from "../ui";
import {
  getDashboardDeviceStates,
  getActiveLeaveSessionForDashboard,
  getFirstHome,
} from "@/lib/prisma/queries/dashboard";
import { formatTime } from "@/lib/utils/dashboard-mappers";

// ─── Types ───────────────────────────────────────────────────────────────────

interface StatusTileData {
  icon: LucideIcon;
  label: string;
  sub: string;
  tone: ToneColor;
}

const HeaderActions = () => (
  <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
    <div className="flex items-center gap-1">
      <Wifi className="size-3.5" strokeWidth={2} aria-hidden="true" />
      <span>Connected</span>
    </div>
    <button
      type="button"
      className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label="Refresh home status"
    >
      <RefreshCw className="size-3.5" strokeWidth={2} aria-hidden="true" />
      <span>Refresh</span>
    </button>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export async function HomeStatusSection() {
  // ── Fetch data ──────────────────────────────────────────────────────────
  const home = await getFirstHome();

  // When no home exists yet, render with sensible placeholder tiles
  const tiles: StatusTileData[] = await (async () => {
    if (!home) {
      return [
        {
          icon: PersonStanding,
          label: "Home",
          sub: "No home configured",
          tone: "slate" as ToneColor,
        },
        {
          icon: Lightbulb,
          label: "Lights",
          sub: "No data",
          tone: "slate" as ToneColor,
        },
        {
          icon: Grid2x2,
          label: "Stove",
          sub: "No data",
          tone: "slate" as ToneColor,
        },
        {
          icon: KeyRound,
          label: "Keys",
          sub: "No data",
          tone: "slate" as ToneColor,
        },
        {
          icon: LockKeyhole,
          label: "Door",
          sub: "No data",
          tone: "slate" as ToneColor,
        },
      ];
    }

    const deviceStates = await getDashboardDeviceStates(home.id);
    const activeSession = await getActiveLeaveSessionForDashboard(home.id);

    // ── Presence tile ──────────────────────────────────────────────────────
    const presenceTile: StatusTileData = activeSession
      ? {
          icon: PersonStanding,
          label: "Away",
          sub: `Since ${formatTime(activeSession.started_at)}`,
          tone: "teal",
        }
      : {
          icon: PersonStanding,
          label: "Home",
          sub: "You are home",
          tone: "slate",
        };

    // ── Helpers ────────────────────────────────────────────────────────────
    const findByCategory = (cat: string) =>
      deviceStates.find((d) => d.devices?.category === cat);

    const stateOf = (cat: string) => findByCategory(cat)?.state_value ?? null;

    // ── Lighting tile ──────────────────────────────────────────────────────
    const lightingStates = deviceStates.filter(
      (d) => d.devices?.category === "lighting",
    );
    const lightsOnCount = lightingStates.filter(
      (d) => d.state_value.toLowerCase() !== "off",
    ).length;
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

    // ── Safety (stove) tile ────────────────────────────────────────────────
    const safetyState = stateOf("safety");
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

    // ── Presence / key tile ────────────────────────────────────────────────
    const accessState = stateOf("access");
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

    // ── Door tile ──────────────────────────────────────────────────────────
    const doorState = stateOf("opening");
    const doorTile: StatusTileData =
      doorState === null
        ? { icon: LockKeyhole, label: "Door", sub: "No sensor", tone: "slate" }
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
  })();

  return (
    <CardPanel className="p-5 sm:p-6" aria-labelledby="home-status-heading">
      <PanelHeader
        icon={Home}
        title={home ? home.name : "Home Status"}
        headingId="home-status-heading"
        short_description="Live snapshot"
        actions={<HeaderActions />}
      />
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {tiles.map((tile) => (
          <StatusTile key={tile.label} {...tile} />
        ))}
      </div>
    </CardPanel>
  );
}
