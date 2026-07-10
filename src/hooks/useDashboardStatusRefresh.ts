"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchDashboardStatus } from "@/lib/api/dashboard";
import { useMqttTopic } from "@/hooks/useMqttTopic";
import type { ActiveSession } from "@/lib/types/dashboard";

/** Debounce delay before refetching after an MQTT payload arrives. */
const MQTT_DEBOUNCE_MS = 4_000;

/** The shape returned by the hook — everything the component needs to render. */
export interface DashboardStatusRefresh {
  /** Combined loading flag: true while the query *or* a debounced refetch is in flight. */
  isLoading: boolean;
  /** Error from React Query, if any. */
  error: Error | null;
  /** The full dashboard status payload. */
  data: Awaited<ReturnType<typeof fetchDashboardStatus>> | undefined;
  /** Whether the MQTT source is currently connected. */
  isConnected: boolean;
  /** The latest MQTT payload (changes on every message). */
  payload: unknown;
  /** Imperatively trigger a refetch (resets the query + sets loading). */
  refetch: () => void;
  /** Latest `activeSession` value — `null` when the user is home. */
  activeSession: ActiveSession;
  /** True when the away-alert modal should be shown. */
  showAwayAlert: boolean;
  /** ISO timestamp of when the current away session started. */
  awayStartedAt: string | null;
  /** Dismiss the away-alert modal. */
  dismissAwayAlert: () => void;
}

/**
 * `useDashboardStatusRefresh`
 *
 * Encapsulates all the non-view concerns of `home-status-section-client.tsx`:
 *
 * 1. React Query for the dashboard status endpoint.
 * 2. MQTT subscription that triggers a debounced refetch on every payload.
 * 3. Detection of the home → away transition to open the `<AwayAlertModal>`.
 *
 * The hook returns a plain object; the component maps it to JSX.
 */
export function useDashboardStatusRefresh(): DashboardStatusRefresh {
  const { connected, payload } = useMqttTopic("home/presence_main/state");
  const queryClient = useQueryClient();

  const {
    data,
    error,
    refetch: queryRefetch,
  } = useQuery({
    queryKey: ["dashboardStatus"],
    queryFn: fetchDashboardStatus,
    staleTime: 0,
    retry: 1,
  });

  // `isLoading` stays true across both the initial query *and* a debounced
  // MQTT-triggered refetch so the UI can show the loading tile set.
  const [isLoading, setIsLoading] = useState(false);

  // ── Away-alert modal state ──────────────────────────────────────────
  const [showAwayAlert, setShowAwayAlert] = useState(false);
  const [awayStartedAt, setAwayStartedAt] = useState<string | null>(null);

  const activeSession: ActiveSession = data?.activeSession ?? null;
  const prevActiveSessionRef = useRef<ActiveSession>(activeSession);

  console.log(data);

  // Detect the home → away transition (activeSession goes null → present).
  useEffect(() => {
    const prev = prevActiveSessionRef.current;
    prevActiveSessionRef.current = activeSession;

    if (!prev && activeSession) {
      setAwayStartedAt(activeSession.started_at);
      setShowAwayAlert(true);
    }
  }, [activeSession]);

  // ── Debounced refetch after MQTT state change ──────────────────────
  //
  // We use `setTimeout` + effect cleanup so rapid MQTT updates cancel the
  // previous pending refresh rather than stacking stale promises.
  useEffect(() => {
    setIsLoading(true);

    const timerId = setTimeout(() => {
      queryClient
        .resetQueries({ queryKey: ["dashboardStatus"] })
        .finally(() => setIsLoading(false));
    }, MQTT_DEBOUNCE_MS);

    return () => {
      clearTimeout(timerId);
      setIsLoading(false);
    };
    // We intentionally depend on `payload` only — every new MQTT message
    // should reset the debounce window.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload]);

  // ── Imperative refetch (Refresh button) ─────────────────────────────
  const refetch = () => {
    setIsLoading(true);
    queryClient
      .resetQueries({ queryKey: ["dashboardStatus"] })
      .finally(() => setIsLoading(false));
  };

  return {
    isLoading,
    error,
    data,
    isConnected: connected,
    payload,
    refetch,
    activeSession,
    showAwayAlert,
    awayStartedAt,
    dismissAwayAlert: () => setShowAwayAlert(false),
  };
}
