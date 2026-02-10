import { useState, useEffect } from "react";
import { hyperPermissions } from "../../../common/services/HyperPermissions";
import type { IHyperRollupItem } from "../models";

export interface IUseRollupAudienceFilterResult {
  filteredItems: IHyperRollupItem[];
  loading: boolean;
}

/**
 * Filters rolled-up items by audience targeting.
 * Checks the configured audienceTargetField on each item.
 * Items without a target group pass through (fail-open).
 * Pattern adapted from HyperLinks useLinksAudienceFilter.
 *
 * @param items - Raw items from data source
 * @param enabled - Whether audience targeting is enabled
 * @param targetField - The field name containing audience group IDs (comma-separated)
 */
export function useRollupAudienceFilter(
  items: IHyperRollupItem[],
  enabled: boolean,
  targetField: string
): IUseRollupAudienceFilterResult {
  const [filteredItems, setFilteredItems] = useState<IHyperRollupItem[]>(items);
  const [loading, setLoading] = useState<boolean>(enabled);

  useEffect(function () {
    if (!enabled || !targetField) {
      setFilteredItems(items);
      setLoading(false);
      return;
    }

    let cancelled = false;

    function checkAll(): Promise<void> {
      // Separate targeted vs non-targeted items
      const nonTargeted: IHyperRollupItem[] = [];
      const targeted: Array<{ item: IHyperRollupItem; groups: string[] }> = [];

      items.forEach(function (item) {
        const fieldVal = item.fields[targetField];
        if (fieldVal !== undefined && String(fieldVal).length > 0) {
          const groups = String(fieldVal).split(",").map(function (g) { return g.trim(); });
          if (groups.length > 0 && groups[0] !== "") {
            targeted.push({ item: item, groups: groups });
          } else {
            nonTargeted.push(item);
          }
        } else {
          nonTargeted.push(item);
        }
      });

      if (targeted.length === 0) {
        if (!cancelled) {
          setFilteredItems(items);
          setLoading(false);
        }
        return Promise.resolve();
      }

      // Collect unique group IDs for batch check
      const uniqueGroups: string[] = [];
      targeted.forEach(function (t) {
        t.groups.forEach(function (g) {
          if (uniqueGroups.indexOf(g) === -1) {
            uniqueGroups.push(g);
          }
        });
      });

      // Check membership for all unique groups
      const promises = uniqueGroups.map(function (group) {
        return hyperPermissions.isUserInGroup(group).then(function (result) {
          return { group: group, isMember: result };
        });
      });

      return Promise.all(promises).then(function (results) {
        if (cancelled) return;

        // Build membership map
        const membershipMap: Record<string, boolean> = {};
        results.forEach(function (r) {
          membershipMap[r.group] = r.isMember;
        });

        // Filter: item passes if user is member of ANY of its target groups
        const visibleTargeted: IHyperRollupItem[] = [];
        targeted.forEach(function (t) {
          let anyMatch = false;
          t.groups.forEach(function (g) {
            if (membershipMap[g] === true) anyMatch = true;
          });
          if (anyMatch) visibleTargeted.push(t.item);
        });

        // Merge and preserve original order
        const visibleIds: Record<string, boolean> = {};
        nonTargeted.forEach(function (item) { visibleIds[item.id] = true; });
        visibleTargeted.forEach(function (item) { visibleIds[item.id] = true; });

        const result = items.filter(function (item) { return visibleIds[item.id] === true; });

        setFilteredItems(result);
        setLoading(false);
      }).catch(function () {
        if (!cancelled) {
          // On error, show all items (fail open)
          setFilteredItems(items);
          setLoading(false);
        }
      });
    }

    checkAll().catch(function () { /* handled inside */ });

    return function () { cancelled = true; };
  }, [items, enabled, targetField]);

  return { filteredItems: filteredItems, loading: loading };
}
