"use client";

import { useMemo, useState, useTransition } from "react";
import { Settings2 } from "lucide-react";
import {
  CardPanel,
  PanelHeader,
  SearchInput,
  FilterTabs,
  type FilterTabOption,
} from "@/components/ui";
import { severityToPriority } from "@/lib/utils/dashboard-mappers";
import {
  saveReminderRuleAction,
  toggleReminderRuleAction,
} from "@/lib/supabase/actions/reminder-rules";
import { ReminderRuleRow, type ReminderRuleRowData } from "./reminder-rule-row";
import type {
  ReminderDeviceOption,
  ReminderStateOption,
} from "./edit-reminder-modal";

// ─── Types ───────────────────────────────────────────────────────────────────

interface RemindersTableProps {
  rules: ReminderRuleRowData[];
  devices: ReminderDeviceOption[];
  stateOptions: ReminderStateOption[];
  canEdit?: boolean;
}

// ─── Static filter options ───────────────────────────────────────────────────

const STATUS_FILTERS: FilterTabOption[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "High Priority", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyReminders({ hasRules }: { hasRules: boolean }) {
  return (
    <CardPanel className="items-center py-12 text-center">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {hasRules ? "No rules match your filters" : "No reminder rules yet"}
      </p>
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
        {hasRules
          ? "Try adjusting your search or filter selection."
          : "Create reminder rules to get notified about important device states."}
      </p>
    </CardPanel>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

/**
 * Client component that renders the search bar, filter tabs, and reminder
 * rules table. All filter state is local; the initial data is passed in
 * from the server page.
 */
export function RemindersTable({
  rules: initialRules,
  devices,
  stateOptions,
  canEdit = false,
}: RemindersTableProps) {
  const [rules, setRules] = useState(initialRules);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [savingRuleId, setSavingRuleId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ── Filter logic ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rules.filter((rule) => {
      // Status / priority filter
      if (statusFilter !== "all") {
        const priority = severityToPriority(rule.severity).toLowerCase();
        switch (statusFilter) {
          case "active":
            if (!rule.active) return false;
            break;
          case "inactive":
            if (rule.active) return false;
            break;
          default:
            // "high", "medium", "low"
            if (priority !== statusFilter) return false;
        }
      }

      // Text search
      if (!q) return true;
      return (
        rule.reminder_text.toLowerCase().includes(q) ||
        (rule.device_name?.toLowerCase().includes(q) ?? false) ||
        rule.trigger_state_key.toLowerCase().includes(q) ||
        (rule.trigger_presence_state?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [rules, search, statusFilter]);

  // ── Toggle handler (optimistic) ───────────────────────────────────────────
  function handleToggle(id: string, value: boolean) {
    const previous = rules;
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: value } : r)),
    );

    startTransition(async () => {
      try {
        await toggleReminderRuleAction(id, value);
      } catch {
        setRules(previous);
      }
    });
  }

  async function handleSave(payload: {
    id?: string;
    device_id: string;
    trigger_device_type_state_id: number;
    trigger_presence_state?: string | null;
    reminder_text: string;
    severity: number;
    active: boolean;
  }) {
    if (!payload.id) {
      throw new Error("Reminder rule id is required for saves.");
    }

    const previous = rules;
    const device = devices.find((item) => item.id === payload.device_id);

    setSavingRuleId(payload.id);
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === payload.id
          ? {
              ...rule,
              device_id: payload.device_id,
              device_name: device?.name ?? rule.device_name,
              device_type_id: device?.typeLabel ?? rule.device_type_id,
              trigger_device_type_state_id:
                payload.trigger_device_type_state_id,
              trigger_presence_state: payload.trigger_presence_state ?? null,
              reminder_text: payload.reminder_text,
              severity: payload.severity,
              active: payload.active,
            }
          : rule,
      ),
    );

    try {
      await saveReminderRuleAction({
        ...payload,
        id: payload.id,
        trigger_presence_state: payload.trigger_presence_state ?? undefined,
      });
    } catch {
      setRules(previous);
    } finally {
      setSavingRuleId(null);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="grid gap-6">
      {/* ── Search + filter bar ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search rules…"
            className="sm:max-w-xs"
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 sm:ml-auto">
            {filtered.length} rule{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <FilterTabs
          options={STATUS_FILTERS}
          selected={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <CardPanel aria-labelledby="reminder-rules-heading">
          <div className="px-5 pt-5 pb-0">
            <PanelHeader
              icon={Settings2}
              title="Reminder Rules"
              headingId="reminder-rules-heading"
              short_description="Manage automation triggers and reminder conditions"
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
                    Device
                  </th>
                  <th className="hidden px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 md:table-cell">
                    Trigger
                  </th>
                  <th className="hidden px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 lg:table-cell">
                    Condition
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Priority
                  </th>
                  <th className="py-3 pl-3 pr-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rule) => (
                  <ReminderRuleRow
                    key={rule.id}
                    rule={rule}
                    onToggle={handleToggle}
                    onSave={handleSave}
                    devices={devices}
                    stateOptions={stateOptions}
                    pending={isPending}
                    isSaving={savingRuleId === rule.id}
                    canEdit={canEdit}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </CardPanel>
      ) : (
        <EmptyReminders hasRules={rules.length > 0} />
      )}
    </div>
  );
}
