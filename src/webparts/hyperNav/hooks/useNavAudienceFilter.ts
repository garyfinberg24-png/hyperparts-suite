import * as React from "react";
import type { IHyperNavLink } from "../models";
import { hyperPermissions } from "../../../common/services/HyperPermissions";
import { collectUniqueGroups, filterLinksByAudience } from "../utils/audienceUtils";

export interface INavAudienceFilterResult {
  /** Links filtered by audience targeting */
  visibleLinks: IHyperNavLink[];
  /** Whether audience check is still loading */
  loading: boolean;
}

/**
 * Batch audience targeting hook.
 * Collects all unique group names across entire link tree,
 * batch-checks membership via Promise.all, then recursively
 * filters the link tree. O(unique groups) API calls, not O(links).
 */
export function useNavAudienceFilter(
  links: IHyperNavLink[],
  enabled: boolean
): INavAudienceFilterResult {
  const [membershipMap, setMembershipMap] = React.useState<Record<string, boolean>>({});
  const [loading, setLoading] = React.useState(enabled);

  const uniqueGroups = React.useMemo(function () {
    if (!enabled) return [];
    return collectUniqueGroups(links);
  }, [links, enabled]);

  React.useEffect(function () {
    if (!enabled || uniqueGroups.length === 0) {
      setMembershipMap({});
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all(
      uniqueGroups.map(function (groupName) {
        return hyperPermissions.isUserInGroup(groupName).then(function (isMember) {
          return { group: groupName, isMember: isMember };
        });
      })
    ).then(function (results) {
      if (cancelled) return;
      const map: Record<string, boolean> = {};
      results.forEach(function (r) {
        map[r.group] = r.isMember;
      });
      setMembershipMap(map);
      setLoading(false);
    }).catch(function () {
      if (cancelled) return;
      setMembershipMap({});
      setLoading(false);
    });

    return function () { cancelled = true; };
  }, [enabled, uniqueGroups]);

  const visibleLinks = React.useMemo(function () {
    if (!enabled) return links;
    if (loading) return [];
    return filterLinksByAudience(links, membershipMap);
  }, [links, enabled, loading, membershipMap]);

  return { visibleLinks: visibleLinks, loading: loading };
}
