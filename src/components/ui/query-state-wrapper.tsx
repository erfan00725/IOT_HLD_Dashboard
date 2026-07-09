"use client";

import { type ReactNode } from "react";

/**
 * Replaces the repeated `isLoading ? … : error ? … : …` pattern
 * found across dashboard client components.
 *
 * @example
 * ```tsx
 * <QueryStateWrapper isLoading={isLoading} error={error}>
 *   {data.length > 0 ? data.map(…) : <Empty />}
 * </QueryStateWrapper>
 * ```
 */
interface QueryStateWrapperProps {
  isLoading: boolean;
  error: Error | null;
  loadingMessage?: string;
  errorMessage?: string;
  children: ReactNode;
}

export function QueryStateWrapper({
  isLoading,
  error,
  loadingMessage = "Loading…",
  errorMessage = "Unable to load data.",
  children,
}: QueryStateWrapperProps) {
  if (isLoading) {
    return (
      <span className="py-4 text-center text-sm text-slate-400 dark:text-slate-500">
        {loadingMessage}
      </span>
    );
  }

  if (error) {
    return (
      <span className="py-4 text-center text-sm text-red-500">
        {errorMessage}
      </span>
    );
  }

  return <>{children}</>;
}
