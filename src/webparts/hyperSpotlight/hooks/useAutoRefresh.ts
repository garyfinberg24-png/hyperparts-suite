import { useEffect, useRef } from "react";

/**
 * Calls `callback` on a repeating interval when `enabled` is true.
 * @param callback — the function to call on each tick
 * @param intervalMinutes — interval in minutes
 * @param enabled — whether auto-refresh is active
 */
export function useAutoRefresh(
  callback: () => void,
  intervalMinutes: number,
  enabled: boolean
): void {
  // eslint-disable-next-line @rushstack/no-new-null
  const savedCallback = useRef<(() => void) | null>(null);

  // Keep the latest callback ref up-to-date
  useEffect(function () {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(function () {
    if (!enabled || intervalMinutes <= 0) return;

    const intervalMs = intervalMinutes * 60 * 1000;
    const id = window.setInterval(function () {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }, intervalMs);

    return function () {
      window.clearInterval(id);
    };
  }, [enabled, intervalMinutes]);
}
