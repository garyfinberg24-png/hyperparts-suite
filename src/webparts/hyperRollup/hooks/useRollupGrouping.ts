import { useMemo } from "react";
import type { IHyperRollupItem, IHyperRollupGroup } from "../models";

export interface UseRollupGroupingOptions {
  items: IHyperRollupItem[];
  groupByField: string;
}

export interface UseRollupGroupingResult {
  groups: IHyperRollupGroup[];
  isGrouped: boolean;
}

/**
 * Gets a string value from an item for grouping purposes.
 */
function getGroupValue(item: IHyperRollupItem, fieldName: string): string {
  if (fieldName === "author") return item.author || "(No Author)";
  if (fieldName === "fileType") return item.fileType || "(No Type)";
  if (fieldName === "contentType") return item.contentType || "(No Content Type)";
  if (fieldName === "category") return item.category || "(No Category)";
  if (fieldName === "sourceSiteName") return item.sourceSiteName || "(Unknown Site)";
  if (fieldName === "sourceListName") return item.sourceListName || "(Unknown List)";

  // For date fields, group by date portion only
  if (fieldName === "created" || fieldName === "modified") {
    const dateStr = fieldName === "created" ? item.created : item.modified;
    if (!dateStr) return "(No Date)";
    return new Date(dateStr).toLocaleDateString();
  }

  const raw = item.fields[fieldName];
  if (raw === undefined) return "(Empty)";
  return String(raw);
}

/**
 * Groups items by a specified field.
 * Returns groups sorted alphabetically by key.
 */
export function useRollupGrouping(options: UseRollupGroupingOptions): UseRollupGroupingResult {
  const { items, groupByField } = options;

  const result = useMemo(function (): UseRollupGroupingResult {
    if (!groupByField) {
      return {
        groups: [{
          key: "all",
          label: "All Items",
          items: items,
          count: items.length,
        }],
        isGrouped: false,
      };
    }

    // Build groups using Map
    const groupMap = new Map<string, IHyperRollupItem[]>();

    items.forEach(function (item) {
      const value = getGroupValue(item, groupByField);
      const existing = groupMap.get(value);
      if (existing) {
        existing.push(item);
      } else {
        groupMap.set(value, [item]);
      }
    });

    // Convert to array and sort
    const groups: IHyperRollupGroup[] = [];
    groupMap.forEach(function (groupItems, key) {
      groups.push({
        key: key,
        label: key,
        items: groupItems,
        count: groupItems.length,
      });
    });

    groups.sort(function (a, b) {
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    });

    return {
      groups: groups,
      isGrouped: true,
    };
  }, [items, groupByField]);

  return result;
}
