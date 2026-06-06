"use client";

import { useState } from "react";
import {
  Settings2,
  Home,
  Lightbulb,
  ShieldAlert,
  MoreVertical,
  type LucideIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface AutomationRule {
  id: number;
  name: string;
  icon: "home" | "lightbulb" | "shield";
  iconColor: "teal" | "amber" | "red";
  trigger: string;
  condition: string;
  action: string;
  enabled: boolean;
}

// ---------------------------------------------------------------------------
// Icon + color maps
// ---------------------------------------------------------------------------
const ICON_MAP: Record<AutomationRule["icon"], LucideIcon> = {
  home: Home,
  lightbulb: Lightbulb,
  shield: ShieldAlert,
};

const ICON_STYLE: Record<AutomationRule["iconColor"], string> = {
  teal: "bg-teal-50  text-teal-600",
  amber: "bg-amber-50 text-amber-500",
  red: "bg-red-50   text-red-500",
};

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------
function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-500 ${
        enabled ? "bg-teal-500" : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block size-4 rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Table row
// ---------------------------------------------------------------------------
function RuleRow({
  rule,
  onToggle,
}: {
  rule: AutomationRule;
  onToggle: (id: number, v: boolean) => void;
}) {
  const Icon = ICON_MAP[rule.icon];

  return (
    <tr className="group border-t border-slate-100 transition-colors hover:bg-slate-50/60">
      {/* Rule name + icon */}
      <td className="py-3.5 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <div
            className={`grid size-8 shrink-0 place-items-center rounded-xl ${
              ICON_STYLE[rule.iconColor]
            }`}
          >
            <Icon className="size-4" strokeWidth={1.8} aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold text-slate-800">
            {rule.name}
          </span>
        </div>
      </td>

      {/* Trigger */}
      <td className="hidden px-3 py-3.5 text-sm text-slate-500 sm:table-cell">
        {rule.trigger}
      </td>

      {/* Condition */}
      <td className="hidden px-3 py-3.5 text-sm text-slate-500 md:table-cell">
        {rule.condition}
      </td>

      {/* Action */}
      <td className="hidden px-3 py-3.5 text-sm text-slate-500 lg:table-cell">
        {rule.action}
      </td>

      {/* Status (toggle + 3-dot) */}
      <td className="py-3.5 pl-3 pr-4">
        <div className="flex items-center justify-end gap-3">
          <Toggle
            enabled={rule.enabled}
            onChange={(v) => onToggle(rule.id, v)}
          />
          <button
            aria-label={`More options for ${rule.name}`}
            className="rounded-lg p-1 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-600 focus-visible:opacity-100"
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

// ---------------------------------------------------------------------------
// Automation Rules panel
// ---------------------------------------------------------------------------
export function AutomationRules({
  rules: initialRules,
}: {
  rules: AutomationRule[];
}) {
  const [rules, setRules] = useState(initialRules);

  function handleToggle(id: number, value: boolean) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: value } : r)),
    );
  }

  return (
    <section
      className="rounded-2xl border border-slate-200/80 bg-white shadow-sm"
      aria-labelledby="automation-rules-heading"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <Settings2
            className="size-4 text-slate-500"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <h2
            id="automation-rules-heading"
            className="text-sm font-semibold text-slate-900"
          >
            Automation Rules
          </h2>
        </div>
        <a
          href="#automations"
          className="text-xs font-medium text-teal-600 hover:underline"
        >
          View all
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full" aria-label="Automation rules">
          {/* Column headers */}
          <thead>
            <tr className="border-t border-slate-100 bg-slate-50/70">
              <th
                scope="col"
                className="py-2.5 pl-4 pr-3 text-left text-xs font-semibold text-slate-400 tracking-wide"
              >
                Rule
              </th>
              <th
                scope="col"
                className="hidden px-3 py-2.5 text-left text-xs font-semibold text-slate-400 tracking-wide sm:table-cell"
              >
                Trigger
              </th>
              <th
                scope="col"
                className="hidden px-3 py-2.5 text-left text-xs font-semibold text-slate-400 tracking-wide md:table-cell"
              >
                Condition
              </th>
              <th
                scope="col"
                className="hidden px-3 py-2.5 text-left text-xs font-semibold text-slate-400 tracking-wide lg:table-cell"
              >
                Action
              </th>
              <th
                scope="col"
                className="py-2.5 pl-3 pr-4 text-right text-xs font-semibold text-slate-400 tracking-wide"
              >
                Status
              </th>
            </tr>
          </thead>

          {/* Rows */}
          <tbody>
            {rules.map((rule) => (
              <RuleRow key={rule.id} rule={rule} onToggle={handleToggle} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
