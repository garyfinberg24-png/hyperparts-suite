import { useState, useEffect } from "react";
import type { ITickerItem } from "../models";
import { getGraph } from "../../../common/services/HyperPnP";

/**
 * Filters ticker items by audience group membership.
 * Items with no audienceGroups are shown to everyone.
 * Items with audienceGroups are only shown if the current user is a member of at least one group.
 */
export function useTickerAudience(
  items: ITickerItem[],
  enabled: boolean
): { filteredItems: ITickerItem[]; loading: boolean } {
  const [memberGroups, setMemberGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Collect unique audience groups from items
  const uniqueGroups: string[] = [];
  if (enabled) {
    items.forEach(function (item) {
      const groups = item.audienceGroups || [];
      groups.forEach(function (group) {
        if (group && uniqueGroups.indexOf(group) === -1) {
          uniqueGroups.push(group);
        }
      });
    });
  }

  useEffect(function () {
    if (!enabled || uniqueGroups.length === 0) {
      setLoaded(true);
      return;
    }
    if (loaded) return;

    let cancelled = false;
    setLoading(true);

    const fetchGroups = function (): void {
      const graph = getGraph();
      graph.me.memberOf()
        .then(function (groups) {
          if (!cancelled) {
            const names: string[] = [];
            (groups as unknown as Array<Record<string, unknown>>).forEach(function (g) {
              if (g.displayName) {
                names.push(String(g.displayName));
              }
            });
            setMemberGroups(names);
            setLoading(false);
            setLoaded(true);
          }
        })
        .catch(function () {
          if (!cancelled) {
            // Fail open — show all items if group check fails
            setMemberGroups([]);
            setLoading(false);
            setLoaded(true);
          }
        });
    };

    fetchGroups();

    return function () { cancelled = true; };
  }, [enabled, loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!enabled) {
    return { filteredItems: items, loading: false };
  }

  if (loading || !loaded) {
    return { filteredItems: [], loading: true };
  }

  const filtered: ITickerItem[] = [];
  items.forEach(function (item) {
    const groups = item.audienceGroups || [];
    // Items with no audience groups are visible to everyone
    if (groups.length === 0) {
      filtered.push(item);
      return;
    }
    // Check if user is member of at least one required group
    let isMember = false;
    groups.forEach(function (group) {
      if (memberGroups.indexOf(group) !== -1) {
        isMember = true;
      }
    });
    if (isMember) {
      filtered.push(item);
    }
  });

  return { filteredItems: filtered, loading: false };
}
