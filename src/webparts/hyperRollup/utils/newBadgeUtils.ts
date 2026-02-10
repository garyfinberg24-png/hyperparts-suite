import type { IHyperRollupItem } from "../models";

/**
 * Determine whether an item should display the "NEW" badge.
 * Compares the item's modified date against the configured threshold.
 *
 * @param item - The rollup item to check
 * @param days - Number of days threshold (0 = disabled)
 * @returns true if the item was modified within the last `days` days
 */
export function isNewItem(item: IHyperRollupItem, days: number): boolean {
  if (days <= 0) return false;
  if (!item.modified) return false;

  const modifiedTime = new Date(item.modified).getTime();
  if (isNaN(modifiedTime)) return false;

  const thresholdMs = days * 24 * 60 * 60 * 1000;
  const now = Date.now();

  return (now - modifiedTime) < thresholdMs;
}
