"use client";

import { useState, useTransition } from "react";
import {
  Settings2,
  Home,
  Lightbulb,
  ShieldAlert,
  MoreVertical,
  type LucideIcon,
} from "lucide-react";
import { CardPanel, PanelHeader, IconBubble, Toggle } from "@/components/ui";
import { ICON_BUBBLE_STYLES } from "@/lib/utils/tone-styles";
import { toggleReminderRuleAction } from "@/lib/supabase/actions/reminder-rules";
import type { AutomationRule } from "@/lib/types/automation-rule";

const ICON_MAP: Record<AutomationRule["icon"], LucideIcon> = {
  home: Home,
  lightbulb: Lightbulb,
  shield: ShieldAlert,
};

function RuleRow({
  rule,
  onToggle,
  pending,
}: {
  rule: AutomationRule;
  onToggle: (id: string, v: boolean) => void;
  pending: boolean;
}) {
  const icon = ICON_MAP[rule.icon];
  return (
    <tr className="group border-t border-slate-100 dark:border-slate-700/60 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/60">
      <td className="py-3.5 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <IconBubble
            icon={icon}
            colorClass={ICON_BUBBLE_STYLES[rule.iconColor]}
            size="sm"
          />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {rule.name}
          </span>
        </div>
      </td>
      <td className="hidden px-3 py-3.5 text-sm text-slate-500 dark:text-slate-400 sm:table-cell">
        {rule.trigger}
      </td>
      <td className="hidden px-3 py-3.5 text-sm text-slate-500 dark:text-slate-400 md:table-cell">
        {rule.condition}
      </td>
      <td className="hidden px-3 py-3.5 text-sm text-slate-500 dark:text-slate-400 lg:table-cell">
        {rule.action}
      </td>
      <td className="py-3.5 pl-3 pr-4">
        <div className="flex items-center justify-end gap-3">
          <Toggle
            enabled={rule.enabled}
            disabled={pending}
            onChange={(v) => onToggle(rule.id, v)}
          />
          <button
            aria-label={`More options for ${rule.name}`}
            className="rounded-lg p-1 text-slate-400 dark:text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:opacity-100"
          >
            <MoreVertical
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function AutomationRules({
  rules: initialRules,
}: {
  rules: AutomationRule[];
}) {
  const [rules, setRules] = useState(initialRules);
  const [isPending, startTransition] = useTransition();

  function handleToggle(id: string, value: boolean) {
    // Optimistic update so the toggle reacts instantly.
    const previous = rules;
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: value } : r)),
    );

    // Persist to the database; revert on failure.
    startTransition(async () => {
      try {
        await toggleReminderRuleAction(id, value);
      } catch {
        setRules(previous);
      }
    });
  }

  return (
    <CardPanel aria-labelledby="automation-rules-heading">
      <div className="px-5 pt-5 pb-0">
        <PanelHeader
          icon={Settings2}
          title="Automation Rules"
          headingId="automation-rules-heading"
          viewAllHref="#automations"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-700/60">
              <th className="py-3 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Rule
              </th>
              <th className="hidden px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 sm:table-cell">
                Trigger
              </th>
              <th className="hidden px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 md:table-cell">
                Condition
              </th>
              <th className="hidden px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 lg:table-cell">
                Action
              </th>
              <th className="py-3 pl-3 pr-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <RuleRow
                key={rule.id}
                rule={rule}
                onToggle={handleToggle}
                pending={isPending}
              />
            ))}
          </tbody>
        </table>
      </div>
    </CardPanel>
  );
}
