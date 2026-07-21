"use client";

import { useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";
import { EventItem, EmptyEvents } from "./event-item";
import { EventsFilters } from "./events-filters";
import {
  CardPanel,
  PanelHeader,
  type FilterTabOption,
} from "@/components/ui";
import { deviceTypeToIcon, deviceTypeLabel } from "@/lib/utils/device-icons";
import {
  deviceTypeToTone,
  formatTime,
} from "@/lib/utils/dashboard-mappers";
import {
  eventStateLabel,
  eventStateToTone,
  groupByDay,
} from "@/lib/utils/events";
import type { EventsPageEvent } from "@/lib/prisma/queries/dashboard";

interface EventsTimelineProps {
  events: EventsPageEvent[];
}

const ALL_TYPES = "all";

export function EventsTimeline({ events }: EventsTimelineProps) {
  const [search, setSearch] = useState("");
  const [deviceType, setDeviceType] = useState<string>(ALL_TYPES);

  // Build device-type filter options dynamically from the events present.
  const deviceTypeOptions: FilterTabOption[] = useMemo(() => {
    const present = new Set(events.map((e) => e.device_type_id));
    return [
      { label: "All", value: ALL_TYPES },
      ...Array.from(present)
        .sort()
        .map((t) => ({ label: deviceTypeLabel(t), value: t })),
    ];
  }, [events]);

  // Filter by search term + device type. Events arrive newest-first from the
  // server, and that order is preserved through filtering and grouping.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      const matchesType =
        deviceType === ALL_TYPES || e.device_type_id === deviceType;
      if (!matchesType) return false;
      if (!q) return true;
      return (
        e.device_name.toLowerCase().includes(q) ||
        deviceTypeLabel(e.device_type_id).toLowerCase().includes(q) ||
        (e.state_key?.toLowerCase().includes(q) ?? false) ||
        (e.room_name?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [events, search, deviceType]);

  const dayBuckets = useMemo(
    () => groupByDay(filtered, (e) => e.observed_at),
    [filtered],
  );

  return (
    <div className="grid gap-6">
      <EventsFilters
        search={search}
        onSearchChange={setSearch}
        deviceType={deviceType}
        onDeviceTypeChange={setDeviceType}
        deviceTypeOptions={deviceTypeOptions}
        totalResults={filtered.length}
      />

      {filtered.length > 0 ? (
        <div className="grid gap-5">
          {dayBuckets.map((bucket) => (
            <CardPanel key={bucket.key} className="gap-2 p-4 sm:p-5">
              <PanelHeader
                icon={CalendarClock}
                title={bucket.label}
                headingId={`events-${bucket.key}`}
                short_description={`${bucket.items.length} event${bucket.items.length === 1 ? "" : "s"}`}
              />
              <ul role="list" className="mt-2 divide-y divide-slate-100 dark:divide-slate-800/70">
                {bucket.items.map((event) => (
                  <li key={event.id}>
                    <EventItem
                      icon={deviceTypeToIcon(event.device_type_id)}
                      tone={deviceTypeToTone(event.device_type_id)}
                      time={formatTime(event.observed_at)}
                      title={event.device_name}
                      sub={`${deviceTypeLabel(event.device_type_id)} · ${eventStateLabel(event.state_key)}`}
                      statusLabel={eventStateLabel(event.state_key)}
                      statusTone={eventStateToTone(event.state_key)}
                      room={event.room_name}
                    />
                  </li>
                ))}
              </ul>
            </CardPanel>
          ))}
        </div>
      ) : (
        <EmptyEvents hasEvents={events.length > 0} />
      )}
    </div>
  );
}
