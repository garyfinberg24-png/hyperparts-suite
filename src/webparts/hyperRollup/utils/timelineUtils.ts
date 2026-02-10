import type { IHyperRollupItem } from "../models";

var MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Extract a date string from an item using the configured dateField,
 * falling back to modified/created.
 */
export function getItemDateString(item: IHyperRollupItem, dateField: string): string {
  if (dateField && item.fields && item.fields[dateField] !== undefined) {
    return String(item.fields[dateField]);
  }
  return item.modified || item.created;
}

/**
 * Format an ISO date string to a human-readable label,
 * e.g. "March 15, 2025".
 */
export function formatDateMarker(isoDate: string): string {
  var d = new Date(isoDate);
  if (isNaN(d.getTime())) return "Unknown date";
  return MONTH_NAMES[d.getMonth()] + " " + String(d.getDate()) + ", " + String(d.getFullYear());
}

/** A single date group for the timeline */
export interface ITimelineDateGroup {
  dateLabel: string;
  dateKey: string;
  items: IHyperRollupItem[];
}

/**
 * Group items by calendar day (YYYY-MM-DD key).
 * Items are placed into groups in encounter order.
 */
export function groupItemsByDate(
  items: IHyperRollupItem[],
  dateField: string
): ITimelineDateGroup[] {
  var groups: ITimelineDateGroup[] = [];
  var groupMap: Record<string, number> = {};

  items.forEach(function (item) {
    var dateStr = getItemDateString(item, dateField);
    var d = new Date(dateStr);
    var key = isNaN(d.getTime()) ? "unknown" : d.toISOString().substring(0, 10);

    if (groupMap[key] !== undefined) {
      groups[groupMap[key]].items.push(item);
    } else {
      groupMap[key] = groups.length;
      groups.push({
        dateLabel: formatDateMarker(dateStr),
        dateKey: key,
        items: [item],
      });
    }
  });

  return groups;
}
