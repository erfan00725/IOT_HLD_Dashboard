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
import { deviceCategoryToIcon, deviceCategoryLabel } from "@/lib/utils/device-icons";
import {
  categoryToTone,
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

const ALL_CATEGORIES = "all";

export function EventsTimeline({ events }: EventsTimelineProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);

  // Build category filter options dynamically from the events present.
  const categoryOptions: FilterTabOption[] = useMemo(() => {
    const present = new Set(events.map((e) => e.device_category));
    return [
      { label: "All", value: ALL_CATEGORIES },
      ...Array.from(present)
        .sort()
        .map((c) => ({ label: deviceCategoryLabel(c), value: c })),
    ];
  }, [events]);

  // Filter by search term + category. Events arrive newest-first from the
  // server, and that order is preserved through filtering and grouping.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      const matchesCategory =
        category === ALL_CATEGORIES || e.device_category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        e.device_name.toLowerCase().includes(q) ||
        deviceCategoryLabel(e.device_category).toLowerCase().includes(q) ||
        e.state_value.toLowerCase().includes(q) ||
        (e.room_name?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [events, search, category]);

  const dayBuckets = useMemo(
    () => groupByDay(filtered, (e) => e.observed_at),
    [filtered],
  );

  return (
    <div className="grid gap-6">
      <EventsFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categoryOptions={categoryOptions}
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
                      icon={deviceCategoryToIcon(event.device_category)}
                      tone={categoryToTone(event.device_category)}
                      time={formatTime(event.observed_at)}
                      title={event.device_name}
                      sub={`${deviceCategoryLabel(event.device_category)} · ${eventStateLabel(event.state_value)}`}
                      statusLabel={eventStateLabel(event.state_value)}
                      statusTone={eventStateToTone(event.state_value)}
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
