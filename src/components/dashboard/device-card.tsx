"use client";

import { useState, useTransition } from "react";
import { MoreVertical, MapPin, Clock, Bell, Power } from "lucide-react";
import { CardPanel, IconBubble, StatusBadge, Toggle } from "@/components/ui";
import { ICON_BUBBLE_STYLES, type ToneColor } from "@/lib/utils/tone-styles";
import {
  categoryToTone,
  formatTime,
} from "@/lib/utils/dashboard-mappers";
import { classifyDevice } from "@/lib/utils/device-health";
import {
  deviceCategoryToIcon,
  deviceCategoryLabel,
} from "@/lib/utils/device-icons";
import {
  toggleDeviceActiveAction,
  toggleDeviceReminderAction,
} from "@/lib/supabase/actions/devices";
import type { DevicesPageDevice } from "@/lib/prisma/queries/dashboard";

// Map a device classification to the tone used for the status badge.
const CLASS_TO_TONE: Record<"Online" | "Warning" | "Offline", ToneColor> = {
  Online: "teal",
  Warning: "amber",
  Offline: "red",
};

function classToLabel(c: "Online" | "Warning" | "Offline"): string {
  return c === "Online"
    ? "Online"
    : c === "Warning"
      ? "Warning"
      : "Offline";
}

export interface DeviceCardProps {
  device: DevicesPageDevice;
}

export function DeviceCard({ device: initialDevice }: DeviceCardProps) {
  const [device, setDevice] = useState(initialDevice);
  const [pendingField, setPendingField] = useState<
    "active" | "reminder" | null
  >(null);
  const [, startTransition] = useTransition();

  function handleToggleActive(value: boolean) {
    const previous = device;
    setDevice((d) => ({ ...d, active: value }));
    setPendingField("active");
    startTransition(async () => {
      try {
        await toggleDeviceActiveAction(device.id, value);
      } catch {
        setDevice(previous);
      } finally {
        setPendingField(null);
      }
    });
  }

  function handleToggleReminder(value: boolean) {
    const previous = device;
    setDevice((d) => ({ ...d, reminder_enabled: value }));
    setPendingField("reminder");
    startTransition(async () => {
      try {
        await toggleDeviceReminderAction(device.id, value);
      } catch {
        setDevice(previous);
      } finally {
        setPendingField(null);
      }
    });
  }

  const Icon = deviceCategoryToIcon(device.category);
  const tone = categoryToTone(device.category);
  const deviceClass =
    device.state_value != null && device.expected_safe_state
      ? classifyDevice(
          device.state_value as Parameters<typeof classifyDevice>[0],
          device.expected_safe_state,
        )
      : "Offline";
  const statusTone = device.active ? CLASS_TO_TONE[deviceClass] : "slate";
  const statusLabel = device.active
    ? classToLabel(deviceClass)
    : "Disabled";

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
              {deviceCategoryLabel(device.category)}
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label={`More options for ${device.name}`}
          className="rounded-lg p-1 text-slate-400 transition-opacity hover:bg-slate-100 hover:text-slate-600 focus-visible:opacity-100 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300 group-hover:opacity-100"
        >
          <MoreVertical className="size-4" strokeWidth={1.8} aria-hidden="true" />
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

      {/* ─── Toggle row ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <ToggleRow
          icon={Power}
          label="Active"
          enabled={device.active}
          disabled={pendingField === "active"}
          onChange={handleToggleActive}
        />
        <ToggleRow
          icon={Bell}
          label="Reminders"
          enabled={device.reminder_enabled}
          disabled={pendingField === "reminder"}
          onChange={handleToggleReminder}
        />
      </div>
    </CardPanel>
  );
}

// ─── Sub-component: a single labeled toggle ─────────────────────────────────

function ToggleRow({
  icon: Icon,
  label,
  enabled,
  disabled,
  onChange,
}: {
  icon: typeof Power;
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
