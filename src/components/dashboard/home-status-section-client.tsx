"use client";

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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type ToneColor } from "@/lib/utils/tone-styles";
import { CardPanel, PanelHeader, StatusTile, AwayAlertModal } from "../ui";
import { formatTime } from "@/lib/utils/dashboard-mappers";
import { useMqttTopic } from "@/hooks/useMqttTopic";
import { fetchDashboardStatus } from "@/lib/api/dashboard";
import { useEffect, useRef, useState } from "react";

interface StatusTileData {
  icon: LucideIcon;
  label: string;
  sub: string;
  tone: ToneColor;
}

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

export function HomeStatusSectionClient() {
  const { connected, payload } = useMqttTopic("home/presence_main/state");
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: isQueryLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboardStatus"],
    queryFn: fetchDashboardStatus,
    staleTime: 0,
    retry: 1,
  });

  const [isLoading, setIsLoading] = useState(isQueryLoading);

  const home = data?.home;
  const deviceStates = data?.deviceStates ?? [];
  const activeSession = data?.activeSession ?? null;

  // --- Away-alert modal state ---
  const [showAwayAlert, setShowAwayAlert] = useState(false);
  const [awayStartedAt, setAwayStartedAt] = useState<string | null>(null);
  const prevActiveSessionRef = useRef<typeof activeSession>(activeSession);

  // Detect the transition from "home" → "away" (activeSession goes from null to present)
  useEffect(() => {
    const prev = prevActiveSessionRef.current;
    prevActiveSessionRef.current = activeSession;

    if (!prev && activeSession) {
      setAwayStartedAt(activeSession.started_at);
      setShowAwayAlert(true);
    }
  }, [activeSession]);

  useEffect(() => {
    setIsLoading(true);
    new Promise((resolve) => setTimeout(resolve, 4000)).then(() => {
      queryClient
        .resetQueries({ queryKey: ["dashboardStatus"] })
        .then((res) => {
          console.log(res);
          // TODO: continue from here
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  }, [payload]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  // Remove console.log of data (keep only the away transition logic above)

  const tiles: StatusTileData[] = (() => {
    if (isLoading || error || !home) {
      return [
        { icon: PersonStanding, label: "Home", sub: "Loading…", tone: "slate" },
        { icon: Lightbulb, label: "Lights", sub: "Loading…", tone: "slate" },
        { icon: Grid2x2, label: "Stove", sub: "Loading…", tone: "slate" },
        { icon: KeyRound, label: "Keys", sub: "Loading…", tone: "slate" },
        { icon: LockKeyhole, label: "Door", sub: "Loading…", tone: "slate" },
      ];
    }

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

    const findByCategory = (cat: string) =>
      deviceStates.find((d) => d.devices?.category === cat);

    const stateOf = (cat: string) => findByCategory(cat)?.state_value ?? null;

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
    <>
      <AwayAlertModal
        isOpen={showAwayAlert}
        onClose={() => setShowAwayAlert(false)}
        startedAt={awayStartedAt}
      />
      <CardPanel className="p-5 sm:p-6" aria-labelledby="home-status-heading">
        <PanelHeader
          icon={Home}
          title={home ? home.name : "Home Status"}
          headingId="home-status-heading"
          short_description="Live snapshot"
          actions={
            <HeaderActions
              isConnected={connected}
              refetch={() => {
                setIsLoading(true);
                queryClient
                  .resetQueries({ queryKey: ["dashboardStatus"] })
                  .finally(() => {
                    setIsLoading(false);
                  });
              }}
            />
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
