"use client";

import { useCallback, useTransition } from "react";

/**
 * Wraps the optimistic-toggle pattern: perform an immediate local update,
 * call a server action inside a transition, and revert on failure.
 *
 * @typeParam T - The type of the toggle value (defaults to `boolean`).
 *
 * @example
 * ```tsx
 * const { trigger, isPending } = useOptimisticToggle(
 *   (val) => toggleDeviceActiveAction(device.id, val),
 * );
 *
 * function handleChange(value: boolean) {
 *   const snapshot = device;
 *   trigger(
 *     value,
 *     () => setDevice(d => ({ ...d, active: value })),   // optimistic
 *     () => setDevice(snapshot),                           // revert
 *   );
 * }
 * ```
 */
export function useOptimisticToggle<T = boolean>(
  serverAction: (value: T) => Promise<void>,
) {
  const [isPending, startTransition] = useTransition();

  const trigger = useCallback(
    (value: T, optimisticUpdate: () => void, revertUpdate: () => void) => {
      optimisticUpdate();
      startTransition(async () => {
        try {
          await serverAction(value);
        } catch {
          revertUpdate();
        }
      });
    },
    [serverAction],
  );

  return { trigger, isPending } as const;
}
