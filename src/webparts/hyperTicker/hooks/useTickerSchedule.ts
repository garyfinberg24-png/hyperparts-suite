import { useMemo } from "react";
import type { ITickerItem } from "../models";
import type { TickerRecurPattern } from "../models";
import { isItemScheduledNow } from "../utils/scheduleUtils";

/**
 * Filter ticker items by their schedule (startsAt, expiresAt, recurPattern).
 * Items without scheduling fields are always shown.
 */
export function useTickerSchedule(
  items: ITickerItem[],
  enabled: boolean
): ITickerItem[] {
  return useMemo(function () {
    if (!enabled) return items;

    const result: ITickerItem[] = [];
    items.forEach(function (item) {
      const startsAt = item.startsAt || "";
      const expiresAt = item.expiresAt || "";
      const recurPattern: TickerRecurPattern = item.recurPattern || "none";

      // If no scheduling info, always show
      if (!startsAt && !expiresAt && recurPattern === "none") {
        result.push(item);
        return;
      }

      if (isItemScheduledNow(startsAt, expiresAt, recurPattern)) {
        result.push(item);
      }
    });

    return result;
  }, [items, enabled]);
}
