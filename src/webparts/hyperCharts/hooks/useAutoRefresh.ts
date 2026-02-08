import { useEffect, useRef } from "react";

export interface IUseAutoRefreshOptions {
  /** Interval in seconds (0 = disabled) */
  interval: number;
  /** Callback to invoke on each tick */
  onRefresh: () => void;
}

/**
 * Configurable auto-refresh timer.
 * Calls onRefresh at the specified interval. 0 disables.
 */
export function useAutoRefresh(options: IUseAutoRefreshOptions): void {
  const timerRef = useRef<number>(0);
  const onRefreshRef = useRef(options.onRefresh);
  onRefreshRef.current = options.onRefresh;

  useEffect(function () {
    if (options.interval <= 0) return;

    timerRef.current = window.setInterval(function () {
      onRefreshRef.current();
    }, options.interval * 1000);

    return function () {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = 0;
      }
    };
  }, [options.interval]);
}
