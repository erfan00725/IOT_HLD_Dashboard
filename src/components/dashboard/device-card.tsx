"use client";

import { useState } from "react";
import {
  MoreVertical,
  MapPin,
  Clock,
  Bell,
  Power,
  type LucideIcon,
} from "lucide-react";
import { CardPanel, IconBubble, StatusBadge, Toggle } from "@/components/ui";
import {
  ICON_BUBBLE_STYLES,
  classificationToTone,
} from "@/lib/utils/tone-styles";
import { deviceTypeToTone, formatTime } from "@/lib/utils/dashboard-mappers";
import { classifyDevice } from "@/lib/utils/device-health";
import {
  deviceTypeToIcon,
  deviceTypeLabel,
} from "@/lib/utils/device-icons";
import {
  toggleDeviceActiveAction,
  toggleDeviceReminderAction,
} from "@/lib/supabase/actions/devices";
import { useOptimisticToggle } from "@/hooks/useOptimisticToggle";
import type { DevicesPageDevice } from "@/lib/prisma/queries/dashboard";

export interface DeviceCardProps {
  device: DevicesPageDevice;
}

// ─────────────────────────────────────────────────────────────────────────────
// Local state — only the two fields that can be toggled optimistically.
// Keeping these separate from the full device object avoids copying the
// whole record on every toggle and makes rollback a simple boolean restore.
// ─────────────────────────────────────────────────────────────────────────────

interface DeviceToggleState {
  active: boolean;
  reminder_enabled: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Toggle configuration — declarative description of each toggle row.
// Rendering from this array replaces the two hand-written `<ToggleRow>` nodes
// that differed only by icon, label, value, and handler.
// ─────────────────────────────────────────────────────────────────────────────

interface ToggleConfig {
  icon: LucideIcon;
  label: string;
  field: keyof DeviceToggleState;
  /** Partially-applied server action: `value` already carries the device id. */
  action: (value: boolean) => Promise<void>;
}

/**
 * Builds a toggle config array by partially applying the device id to each
 * server action. The returned array drives the declarative `<ToggleRow>`
 * rendering in the component.
 */
function buildToggleConfigs(deviceId: string): ToggleConfig[] {
  return [
    {
      icon: Power,
      label: "Active",
      field: "active",
      action: (val: boolean) => toggleDeviceActiveAction(deviceId, val),
    },
    {
      icon: Bell,
      label: "Reminders",
      field: "reminder_enabled",
      action: (val: boolean) => toggleDeviceReminderAction(deviceId, val),
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: a single labeled toggle
// ─────────────────────────────────────────────────────────────────────────────

function ToggleRow({
  icon: Icon,
  label,
  enabled,
  disabled,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  enabled: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <Icon
        className={`size-4 ${
          enabled
            ? "text-teal-600 dark:text-teal-400"
            : "text-slate-400 dark:text-slate-500"
        }`}
        strokeWidth={1.8}
        aria-hidden="true"
      />
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
      <Toggle enabled={enabled} onChange={onChange} disabled={disabled} />
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function DeviceCard({ device }: DeviceCardProps) {
  // Only the two mutable fields live in state — rollback is a boolean restore
  // rather than a full-object copy.
  const [toggleState, setToggleState] = useState<DeviceToggleState>({
    active: device.active,
    reminder_enabled: device.reminder_enabled,
  });

  const { trigger: triggerActive, isPending: isPendingActive } =
    useOptimisticToggle((val: boolean) =>
      toggleDeviceActiveAction(device.id, val),
    );

  const { trigger: triggerReminder, isPending: isPendingReminder } =
    useOptimisticToggle((val: boolean) =>
      toggleDeviceReminderAction(device.id, val),
    );

  // Map each toggle field to its trigger function + pending flag so the
  // config array can render a generic `<ToggleRow>` for every field.
  const fieldToTrigger: Record<
    keyof DeviceToggleState,
    {
      trigger: (
        value: boolean,
        optimistic: () => void,
        revert: () => void,
      ) => void;
      isPending: boolean;
    }
  > = {
    active: { trigger: triggerActive, isPending: isPendingActive },
    reminder_enabled: {
      trigger: triggerReminder,
      isPending: isPendingReminder,
    },
  };

  function handleToggle(
    field: keyof DeviceToggleState,
    trigger: (
      value: boolean,
      optimistic: () => void,
      revert: () => void,
    ) => void,
    value: boolean,
  ) {
    const previous = toggleState[field];
    trigger(
      value,
      () => setToggleState((s) => ({ ...s, [field]: value })),
      () => setToggleState((s) => ({ ...s, [field]: previous })),
    );
  }

  const Icon = deviceTypeToIcon(device.device_type_id);
  const tone = deviceTypeToTone(device.device_type_id);
  const deviceClass =
    device.state_key != null
      ? classifyDevice(device.state_key, device.is_safe_state)
      : "Offline";
  const statusTone = toggleState.active
    ? classificationToTone(deviceClass)
    : "slate";
  const statusLabel = toggleState.active ? deviceClass : "Disabled";

  const toggleConfigs = buildToggleConfigs(device.id);

  return (
    <CardPanel className="group gap-0 p-5" aria-label={`Device ${device.name}`}>
      {/* ─── Header: icon + name + menu ───────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <IconBubble
            icon={Icon}
            colorClass={ICON_BUBBLE_STYLES[tone]}
            size="md"
          />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              {device.name}
            </h3>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              {deviceTypeLabel(device.device_type_id)}
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label={`More options for ${device.name}`}
          className="rounded-lg p-1 text-slate-400 transition-opacity hover:bg-slate-100 hover:text-slate-600 focus-visible:opacity-100 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300 group-hover:opacity-100"
        >
          <MoreVertical
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* ─── Status + room ────────────────────────────────────────────── */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <StatusBadge label={statusLabel} tone={statusTone} />
        {device.room_name && (
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
            {device.room_name}
          </span>
        )}
      </div>

      {/* ─── Last seen ────────────────────────────────────────────────── */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
        <Clock className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
        <span>
          {device.last_seen_at
            ? `Last seen ${formatTime(device.last_seen_at)}`
            : "No data yet"}
        </span>
      </div>

      {/* ─── Divider ──────────────────────────────────────────────────── */}
      <div className="my-4 h-px bg-slate-100 dark:bg-slate-800" />

      {/* ─── Toggle rows (rendered from the config array) ─────────────── */}
      <div className="flex items-center justify-between gap-4">
        {toggleConfigs.map((cfg) => {
          const { trigger, isPending } = fieldToTrigger[cfg.field];
          return (
            <ToggleRow
              key={cfg.label}
              icon={cfg.icon}
              label={cfg.label}
              enabled={toggleState[cfg.field]}
              disabled={isPending}
              onChange={(value) => handleToggle(cfg.field, trigger, value)}
            />
          );
        })}
      </div>
    </CardPanel>
  );
}
