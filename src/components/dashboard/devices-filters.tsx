"use client";

import { FilterTabs, SearchInput, type FilterTabOption } from "@/components/ui";

interface DevicesFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  deviceType: string;
  onDeviceTypeChange: (v: string) => void;
  deviceTypeOptions: FilterTabOption[];
  totalResults: number;
}

/**
 * Search + device-type filter bar for the devices page.
 *
 * This is a presentational client component — all filter state lives in the
 * parent (`DeviceGrid`) and is passed down via props.
 */
export function DevicesFilters({
  search,
  onSearchChange,
  deviceType,
  onDeviceTypeChange,
  deviceTypeOptions,
  totalResults,
}: DevicesFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search devices…"
          className="sm:max-w-xs"
        />
        <p className="text-xs text-slate-400 dark:text-slate-500 sm:ml-auto">
          {totalResults} device{totalResults === 1 ? "" : "s"}
        </p>
      </div>
      <FilterTabs
        options={deviceTypeOptions}
        selected={deviceType}
        onChange={onDeviceTypeChange}
      />
    </div>
  );
}
