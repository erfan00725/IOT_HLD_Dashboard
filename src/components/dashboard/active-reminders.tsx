"use client";
import { Bell } from "lucide-react";
import { CardPanel } from "@/components/ui/card-panel";
import { PanelHeader } from "@/components/ui/panel-header";
import { categoryToIcon } from "@/lib/utils/device-icons";
import { QueryStateWrapper } from "@/components/ui/query-state-wrapper";
import {
  ReminderRow,
  type ReminderDisplayRow,
} from "@/components/ui/reminder-row";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveReminders } from "@/lib/api/dashboard";
import { severityToPriority, formatTime } from "@/lib/utils/dashboard-mappers";

// ─── Empty state ──────────────────────────────────────────────────────────────

function NoReminders() {
  return (
    <li className="py-4 text-center text-sm text-slate-400 dark:text-slate-500">
      No active reminders 🎉
    </li>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ActiveReminders() {
  const {
    data: rawRules = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activeReminders"],
    queryFn: fetchActiveReminders,
    staleTime: 30_000,
    retry: 1,
  });

  const reminders: ReminderDisplayRow[] = rawRules.map((rule) => ({
    icon: categoryToIcon(rule.devices?.category),
    title: rule.reminder_text,
    sub: rule.devices?.name || "_",
    time: formatTime(rule.created_at ?? new Date().toISOString()),
    priority: severityToPriority(rule.severity),
  }));

  return (
    <CardPanel aria-labelledby="reminders-heading">
      <PanelHeader
        icon={Bell}
        title="Active Reminders"
        headingId="reminders-heading"
        viewAllHref="#reminders"
      />
      <QueryStateWrapper
        isLoading={isLoading}
        error={error}
        loadingMessage="Loading…"
        errorMessage="Unable to load active reminders."
      >
        <ul className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto pr-1">
          {reminders.length > 0 ? (
            reminders.map((r) => <ReminderRow key={r.title} {...r} />)
          ) : (
            <NoReminders />
          )}
        </ul>
      </QueryStateWrapper>
    </CardPanel>
  );
}
