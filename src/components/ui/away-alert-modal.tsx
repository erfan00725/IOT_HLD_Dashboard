"use client";

import { useEffect, useRef } from "react";
import { Bell, PersonStanding, X, type LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchActiveReminders,
  type ActiveReminderRule,
} from "@/lib/api/dashboard";
import {
  severityToPriority,
  categoryToTone,
  formatTime,
} from "@/lib/utils/dashboard-mappers";
import {
  ICON_BUBBLE_STYLES,
  type Priority,
  type ToneColor,
} from "@/lib/utils/tone-styles";
import { categoryToIcon } from "@/lib/utils/device-icons";
import { PriorityBadge } from "@/components/ui/priority-badge";

interface AwayAlertModalProps {
  /** Whether the modal should be visible */
  isOpen: boolean;
  /** Called when the user clicks the close button or the backdrop */
  onClose: () => void;
  /** ISO timestamp of when the away session started */
  startedAt?: string | null;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReminderDisplayRow {
  icon: LucideIcon;
  title: string;
  sub: string;
  time: string;
  priority: Priority;
  tone: ToneColor;
}

/** Maps a raw reminder rule row into the display shape used by the modal. */
function mapReminderToRow(rule: ActiveReminderRule): ReminderDisplayRow {
  return {
    icon: categoryToIcon(rule.devices?.category),
    title: rule.reminder_text,
    sub: rule.devices?.name || "_",
    time: formatTime(rule.created_at ?? new Date().toISOString()),
    priority: severityToPriority(rule.severity),
    tone: categoryToTone(rule.devices?.category),
  };
}

/**
 * Plays a short beep using the Web Audio API.
 * No external files required — generates a pure 880 Hz sine tone.
 */
function playBeep() {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  } catch {
    // AudioContext not supported — fail silently
  }
}

// ─── Single reminder row (compact version for the modal) ───────────────────────

function ModalReminderRow({ row }: { row: ReminderDisplayRow }) {
  const Icon = row.icon;
  return (
    <li className="flex items-center gap-3">
      <div
        className={`grid size-8 shrink-0 place-items-center rounded-lg ${ICON_BUBBLE_STYLES[row.tone]}`}
      >
        <Icon className="size-4" strokeWidth={1.8} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
          {row.title}
        </p>
        <p className="truncate text-xs text-slate-400 dark:text-slate-500">
          {row.sub}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {row.time}
        </span>
        <PriorityBadge priority={row.priority} />
      </div>
    </li>
  );
}

/**
 * AwayAlertModal — full-screen overlay that appears when the user leaves
 * the house. Matches the dashboard's card style (rounded-2xl, same border
 * & background tokens), plays a short beep on open, and surfaces any
 * active reminders whose condition is currently met.
 */
export function AwayAlertModal({
  isOpen,
  onClose,
  startedAt,
}: AwayAlertModalProps) {
  const playedRef = useRef(false);

  // Fetch active reminders while the modal is open so we can show the user
  // any reminders whose condition is currently met. The query is enabled
  // only when the modal is visible to avoid unnecessary requests.
  const { data: rawRules = [], isLoading: remindersLoading } = useQuery({
    queryKey: ["activeReminders"],
    queryFn: fetchActiveReminders,
    enabled: isOpen,
    staleTime: 30_000,
    retry: 1,
  });

  const reminders: ReminderDisplayRow[] = rawRules.map(mapReminderToRow);

  // Play beep once per open transition
  useEffect(() => {
    if (isOpen && !playedRef.current) {
      playBeep();
      playedRef.current = true;
    }
    if (!isOpen) {
      playedRef.current = false;
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formattedTime = startedAt
    ? new Date(startedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const hasReminders = reminders.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Away alert"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card — mirrors CardPanel styling */}
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 shadow-lg items-center dark:border-slate-700/60 dark:bg-slate-900">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          aria-label="Close alert"
        >
          <X className="size-4" strokeWidth={2} />
        </button>

        {/* Icon bubble — matches the teal tone used by the dashboard */}
        <div className="flex size-16 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/30">
          <PersonStanding
            className="size-8 text-teal-600 dark:text-teal-400"
            strokeWidth={1.6}
            aria-hidden="true"
          />
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            You left the house
          </h2>
          {formattedTime ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Away since {formattedTime}
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your away session has started.
            </p>
          )}
        </div>

        {/* Active reminders — only shown when at least one reminder condition is met */}
        {hasReminders || remindersLoading ? (
          <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-700/60">
            <div className="mb-3 flex items-center gap-2">
              <Bell
                className="size-4 text-amber-500"
                strokeWidth={2}
                aria-hidden="true"
              />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Active Reminders
              </h3>
            </div>

            <ul className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto pr-1">
              {remindersLoading ? (
                <li className="py-3 text-center text-sm text-slate-400 dark:text-slate-500">
                  Checking reminders…
                </li>
              ) : (
                reminders.map((r) => (
                  <ModalReminderRow key={`${r.title}-${r.sub}`} row={r} />
                ))
              )}
            </ul>
          </div>
        ) : null}

        {/* Acknowledge button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
