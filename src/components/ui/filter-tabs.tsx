"use client";

import { cn } from "@/lib/utils/utils";

export interface FilterTabOption {
  label: string;
  value: string;
}

interface FilterTabsProps {
  options: FilterTabOption[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterTabs({
  options,
  selected,
  onChange,
  className,
}: FilterTabsProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)} role="tablist">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={selected === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            selected === opt.value
              ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
