import { useEffect, useRef } from "react";

export interface IUseRollupAutoRefreshOptions {
  /** Whether auto-refresh is enabled */
  enabled: boolean;
  /** Interval in seconds (0 = disabled) */
  interval: number;
  /** Callback to invoke on each tick */
  onRefresh: () => void;
}

/**
 * Configurable auto-refresh timer for HyperRollup.
 * Calls onRefresh at the specified interval. Disabled when enabled=false or interval<=0.
 * Pattern adapted from HyperCharts useAutoRefresh.
 */
export function useRollupAutoRefresh(options: IUseRollupAutoRefreshOptions): void {
  const timerRef = useRef<number>(0);
  const onRefreshRef = useRef(options.onRefresh);
  onRefreshRef.current = options.onRefresh;

  useEffect(function () {
    if (!options.enabled || options.interval <= 0) return undefined;

    timerRef.current = window.setInterval(function () {
      onRefreshRef.current();
    }, options.interval * 1000);

    return function () {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = 0;
      }
    };
  }, [options.enabled, options.interval]);
}
