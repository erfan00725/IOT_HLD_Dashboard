"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { X } from "lucide-react";

export type ReminderDeviceOption = {
  id: string;
  name: string;
  typeId?: string | null;
  typeLabel?: string | null;
};

export type ReminderStateOption = {
  id: number;
  state_key: string;
  label?: string | null;
  device_type_id?: string | null;
};

export interface EditReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (payload: {
    id?: string;
    device_id: string;
    trigger_device_type_state_id: number;
    trigger_presence_state?: string | null;
    reminder_text: string;
    severity: number;
    active: boolean;
  }) => Promise<void>;
  devices: ReminderDeviceOption[];
  stateOptions: ReminderStateOption[];
  currentRule?: {
    id?: string;
    device_id: string;
    trigger_device_type_state_id: number;
    trigger_presence_state?: string | null;
    reminder_text: string;
    severity: number;
    active: boolean;
  };
  isSaving?: boolean;
  errorMessage?: string;
}

const INPUT_STYLES =
  "mt-1 block w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-500 dark:focus:ring-teal-500/20";

const PRESENCE_OPTIONS = [
  //   { value: "", label: "None" },
  { value: "left", label: "Left" },
  { value: "home", label: "Home" },
];

const PRIORITY_OPTIONS = [
  { value: 3, label: "High" },
  { value: 2, label: "Medium" },
  { value: 1, label: "Low" },
];

export default function EditReminderModal({
  isOpen,
  onClose,
  onSave = async () => {},
  devices,
  stateOptions,
  currentRule,
  isSaving = false,
  errorMessage,
}: EditReminderModalProps) {
  const [reminderText, setReminderText] = useState("");
  const [severity, setSeverity] = useState(2);
  const [active, setActive] = useState(true);
  const [presenceState, setPresenceState] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState(devices[0]?.id ?? "");
  const [selectedStateId, setSelectedStateId] = useState<number | undefined>(
    undefined,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedDeviceTypeId = useMemo(
    () => devices.find((device) => device.id === deviceId)?.typeId ?? null,
    [deviceId, devices],
  );

  const availableStates = useMemo(() => {
    if (!deviceId) return stateOptions;
    const filtered = stateOptions.filter(
      (option) =>
        option.device_type_id == null ||
        option.device_type_id === selectedDeviceTypeId,
    );
    return filtered.length > 0 ? filtered : stateOptions;
  }, [deviceId, selectedDeviceTypeId, stateOptions]);

  useEffect(() => {
    if (!isOpen) return;

    setReminderText(currentRule?.reminder_text ?? "");
    setSeverity(currentRule?.severity ?? 2);
    setActive(currentRule?.active ?? true);
    setPresenceState(currentRule?.trigger_presence_state ?? null);
    setDeviceId(currentRule?.device_id ?? devices[0]?.id ?? "");
    setSelectedStateId(
      currentRule?.trigger_device_type_state_id ?? availableStates[0]?.id,
    );
    setSubmitError(null);
  }, [isOpen, currentRule, devices, availableStates]);

  useEffect(() => {
    if (!availableStates.length) {
      setSelectedStateId(undefined);
      return;
    }
    if (
      selectedStateId == null ||
      !availableStates.some((option) => option.id === selectedStateId)
    ) {
      setSelectedStateId(availableStates[0].id);
    }
  }, [availableStates, selectedStateId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    if (!deviceId || selectedStateId == null) {
      setSubmitError("Please choose a device and a state condition.");
      return;
    }

    try {
      await onSave({
        id: currentRule?.id,
        device_id: deviceId,
        trigger_device_type_state_id: selectedStateId,
        trigger_presence_state: presenceState || undefined,
        reminder_text: reminderText.trim(),
        severity,
        active,
      });
      onClose();
    } catch (error) {
      setSubmitError(
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Unable to save reminder rule.",
      );
    }
  }

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="Edit reminder rule"
    >
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl p-5 overflow-hidden rounded-[28px] border border-slate-200/80 bg-whiteshadow-2xl shadow-slate-900/10 dark:border-slate-700/60 dark:bg-slate-950">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Close edit reminder dialog"
        >
          <X className="size-5" strokeWidth={2} />
        </button>

        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
            Reminder rule
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {currentRule ? "Edit reminder" : "Create reminder"}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Update the device trigger, reminder text, and notification priority.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Device
              <select
                className={INPUT_STYLES}
                value={deviceId}
                onChange={(event) => setDeviceId(event.target.value)}
              >
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                    {device.typeLabel ? ` — ${device.typeLabel}` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Priority
              <select
                className={INPUT_STYLES}
                value={severity}
                onChange={(event) => setSeverity(Number(event.target.value))}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Reminder text
            <textarea
              rows={4}
              className={`${INPUT_STYLES} resize-none`}
              value={reminderText}
              onChange={(event) => setReminderText(event.target.value)}
              placeholder="For example: Notify me when the front door is left unlocked"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Condition
              <select
                className={INPUT_STYLES}
                value={selectedStateId ?? ""}
                onChange={(event) =>
                  setSelectedStateId(Number(event.target.value))
                }
              >
                {availableStates.length === 0 ? (
                  <option value="">No states available</option>
                ) : (
                  availableStates.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label ?? option.state_key}
                    </option>
                  ))
                )}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Presence trigger
              <select
                className={INPUT_STYLES}
                value={presenceState ?? ""}
                onChange={(event) =>
                  setPresenceState(event.target.value || null)
                }
              >
                {PRESENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {submitError || errorMessage ? (
            <div className="rounded-2xl border border-rose-200/80 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-900/10 dark:text-rose-200">
              {submitError || errorMessage}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex justify-center rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              {isSaving
                ? "Saving…"
                : currentRule
                  ? "Save changes"
                  : "Create rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(modal, document.body);
}
