import React from "react";
import { cn } from "@/lib/utils/utils";

/**
 * CardPanel — shared wrapper used by every dashboard section panel.
 * Replaces the repeated `rounded-2xl border border-slate-200/80 dark:border-slate-700/60
 * bg-white dark:bg-slate-900 p-5 shadow-sm` pattern.
 */
export function CardPanel({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5 shadow-sm",
        className
      )}
      {...props}
    />
  );
}
