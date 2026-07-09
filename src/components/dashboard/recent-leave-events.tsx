"use client";
import { Clock, type LucideIcon } from "lucide-react";
import { CardPanel } from "@/components/ui/card-panel";
import { PanelHeader } from "@/components/ui/panel-header";
import { IconBubble } from "@/components/ui/icon-bubble";
import { ICON_BUBBLE_STYLES } from "@/lib/utils/tone-styles";
import { categoryToIcon } from "@/lib/utils/device-icons";
import { QueryStateWrapper } from "@/components/ui/query-state-wrapper";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentLeaveEvents } from "@/lib/api/dashboard";
import { formatTime } from "@/lib/utils/dashboard-mappers";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeaveEvent {
  icon: LucideIcon;
  time: string;
  title?: string;
  sub: string;
}

// ─── Single event row ─────────────────────────────────────────────────────────

function EventRow({ icon, time, title, sub }: LeaveEvent) {
  return (
    <li className="flex items-start gap-3">
      <IconBubble icon={icon} colorClass={ICON_BUBBLE_STYLES.slate} size="sm" />
      <span className="mt-0.5 shrink-0 text-xs text-slate-400 dark:text-slate-500">
        {time}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>
      </div>
    </li>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function NoEvents() {
  return (
    <li className="py-4 text-center text-sm text-slate-400 dark:text-slate-500">
      No recent events recorded yet.
    </li>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RecentLeaveEvents() {
  const {
    data: rawEvents = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recentLeaveEvents"],
    queryFn: fetchRecentLeaveEvents,
    staleTime: 30_000,
    retry: 1,
  });

  const events: LeaveEvent[] = rawEvents.map((ev) => ({
    icon: categoryToIcon(ev.devices?.category, Clock),
    time: formatTime(ev.observed_at),
    title: ev.devices?.name || "_",
    sub: `State: ${ev.state_value}`,
  }));

  return (
    <CardPanel aria-labelledby="leave-events-heading">
      <PanelHeader
        icon={Clock}
        title="Recent Leave Events"
        headingId="leave-events-heading"
        viewAllHref="#history"
      />
      <ul className="grid gap-4">
        <QueryStateWrapper
          isLoading={isLoading}
          error={error}
          loadingMessage="Loading…"
          errorMessage="Unable to load recent events."
        >
          {events.length > 0 ? (
            events.map((ev, i) => <EventRow key={i} {...ev} />)
          ) : (
            <NoEvents />
          )}
        </QueryStateWrapper>
      </ul>
    </CardPanel>
  );
}
