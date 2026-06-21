"use client";

import { FilterTabs, SearchInput, type FilterTabOption } from "@/components/ui";

interface DevicesFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  categoryOptions: FilterTabOption[];
  totalResults: number;
}

/**
 * Search + category filter bar for the devices page.
 *
 * This is a presentational client component — all filter state lives in the
 * parent (`DeviceGrid`) and is passed down via props.
 */
export function DevicesFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categoryOptions,
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
        options={categoryOptions}
        selected={category}
        onChange={onCategoryChange}
      />
    </div>
  );
}
