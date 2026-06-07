import React from "react";
import { type LucideIcon } from "lucide-react";

interface PanelHeaderProps {
  /** Lucide icon shown left of the title. */
  icon: LucideIcon;
  /** Panel title text. */
  title: string;
  /** Stable DOM id used by `aria-labelledby`. */
  headingId: string;
  /** Optional "View all" link href. */
  viewAllHref?: string;
  /** Optional short description text shown under the title. */
  short_description?: string;
  /** Optional extra actions shown right of the title. */
  actions?: React.ReactNode;
}

/**
 * PanelHeader — shared header row used by all small dashboard panels.
 * Renders: [Icon  Title]  [View all →]
 */
export function PanelHeader({
  icon: Icon,
  title,
  headingId,
  viewAllHref,
  short_description,
  actions,
}: PanelHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon
          className="size-4 text-slate-500 dark:text-slate-400"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <div>
          <h2
            id={headingId}
            className="text-sm font-semibold text-slate-900 dark:text-slate-100"
          >
            {title}
          </h2>
          {short_description && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {short_description}
            </p>
          )}
        </div>
      </div>
      {!!actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : (
        viewAllHref && (
          <a
            href={viewAllHref}
            className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline"
          >
            View all
          </a>
        )
      )}
    </div>
  );
}
