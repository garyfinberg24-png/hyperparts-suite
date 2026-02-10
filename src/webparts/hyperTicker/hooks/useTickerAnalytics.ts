import { useEffect, useRef } from "react";
import type { ITickerItem } from "../models";
import {
  trackTickerClick,
  trackTickerDismiss,
  trackTickerAcknowledge,
  trackTickerViewTime,
} from "../utils/analyticsTracker";

export interface UseTickerAnalyticsResult {
  onItemClick: (item: ITickerItem) => void;
  onItemDismiss: (item: ITickerItem) => void;
  onItemAcknowledge: (item: ITickerItem) => void;
}

/**
 * Hook that tracks ticker analytics events.
 * Automatically tracks view time on mount/unmount.
 * Provides callbacks for click/dismiss/acknowledge tracking.
 */
export function useTickerAnalytics(
  webPartId: string,
  enabled: boolean,
  itemCount: number
): UseTickerAnalyticsResult {
  const mountTimeRef = useRef<number>(0);

  // Track view time on mount/unmount
  useEffect(function () {
    if (!enabled) return;
    mountTimeRef.current = Date.now();

    return function () {
      if (mountTimeRef.current > 0) {
        const durationMs = Date.now() - mountTimeRef.current;
        trackTickerViewTime(webPartId, durationMs, itemCount);
        mountTimeRef.current = 0;
      }
    };
  }, [enabled, webPartId]); // eslint-disable-line react-hooks/exhaustive-deps

  const onItemClick = function (item: ITickerItem): void {
    if (!enabled) return;
    trackTickerClick(webPartId, item);
  };

  const onItemDismiss = function (item: ITickerItem): void {
    if (!enabled) return;
    trackTickerDismiss(webPartId, item);
  };

  const onItemAcknowledge = function (item: ITickerItem): void {
    if (!enabled) return;
    trackTickerAcknowledge(webPartId, item);
  };

  return {
    onItemClick: onItemClick,
    onItemDismiss: onItemDismiss,
    onItemAcknowledge: onItemAcknowledge,
  };
}
