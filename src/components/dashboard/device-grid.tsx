"use client";

import { useMemo, useState } from "react";
import { Cpu } from "lucide-react";
import { DeviceCard } from "./device-card";
import { DevicesFilters } from "./devices-filters";
import { deviceTypeLabel } from "@/lib/utils/device-icons";
import type { DevicesPageDevice } from "@/lib/prisma/queries/dashboard";
import type { FilterTabOption } from "@/components/ui";

interface DeviceGridProps {
  devices: DevicesPageDevice[];
}

const ALL_TYPES = "all";

export function DeviceGrid({ devices }: DeviceGridProps) {
  const [search, setSearch] = useState("");
  const [deviceType, setDeviceType] = useState<string>(ALL_TYPES);

  // Build the device-type filter options dynamically from the devices present.
  const deviceTypeOptions: FilterTabOption[] = useMemo(() => {
    const present = new Set(devices.map((d) => d.device_type_id));
    return [
      { label: "All", value: ALL_TYPES },
      ...Array.from(present)
        .sort()
        .map((t) => ({ label: deviceTypeLabel(t), value: t })),
    ];
  }, [devices]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return devices.filter((d) => {
      const matchesType =
        deviceType === ALL_TYPES || d.device_type_id === deviceType;
      if (!matchesType) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        deviceTypeLabel(d.device_type_id).toLowerCase().includes(q) ||
        (d.room_name?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [devices, search, deviceType]);

  return (
    <div className="grid gap-6">
      <DevicesFilters
        search={search}
        onSearchChange={setSearch}
        deviceType={deviceType}
        onDeviceTypeChange={setDeviceType}
        deviceTypeOptions={deviceTypeOptions}
        totalResults={filtered.length}
      />

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      ) : (
        <EmptyState hasDevices={devices.length > 0} />
      )}
    </div>
  );
}

// ─── Empty states ───────────────────────────────────────────────────────────

function EmptyState({ hasDevices }: { hasDevices: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-center dark:border-slate-700/60">
      <div className="grid size-12 place-items-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <Cpu className="size-6" strokeWidth={1.6} aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {hasDevices ? "No devices match your filters" : "No devices yet"}
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {hasDevices
            ? "Try adjusting your search or device type filter."
            : "Devices paired with this home will appear here."}
        </p>
      </div>
    </div>
  );
}
