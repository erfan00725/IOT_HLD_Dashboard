"use client";

import React, { createContext, useContext } from "react";

import { useDashboardStatusRefresh } from "@/hooks/useDashboardStatusRefresh";
import type { DashboardStatusRefresh } from "@/hooks/useDashboardStatusRefresh";

const DashboardStatusContext = createContext<
  DashboardStatusRefresh | undefined
>(undefined);

/**
 * DashboardStatusProvider wraps the app and exposes the data returned by
 * `useDashboardStatusRefresh` globally so any nested component can
 * consume dashboard status, MQTT connection, and away-alert state
 * without prop-drilling or re-instantiating the hook.
 *
 * IMPORTANT: Must be mounted **inside** `ReactQueryProvider` because the
 * underlying hook relies on `useQuery` / `useQueryClient`.
 */
export function DashboardStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useDashboardStatusRefresh();

  return (
    <DashboardStatusContext.Provider value={value}>
      {children}
    </DashboardStatusContext.Provider>
  );
}

/**
 * Consume the {@link DashboardStatusContext}.
 *
 * Must be used within a `<DashboardStatusProvider>` — throws otherwise
 * to surface missing-provider bugs early.
 */
export function useDashboardStatus(): DashboardStatusRefresh {
  const ctx = useContext(DashboardStatusContext);
  if (!ctx) {
    throw new Error(
      "useDashboardStatus must be used within a DashboardStatusProvider",
    );
  }
  return ctx;
}
