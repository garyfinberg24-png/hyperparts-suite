import { useState, useEffect } from "react";
import { hyperPermissions } from "../../../common/services/HyperPermissions";
import type { IHyperLink } from "../models";

export interface ILinksAudienceFilterResult {
  filteredLinks: IHyperLink[];
  loading: boolean;
}

/**
 * Filters links by audience targeting.
 * For each link with audienceTarget.enabled, checks group membership.
 * Links without audience targeting pass through.
 */
export function useLinksAudienceFilter(
  links: IHyperLink[],
  enabled: boolean
): ILinksAudienceFilterResult {
  const [filteredLinks, setFilteredLinks] = useState<IHyperLink[]>(links);
  const [loading, setLoading] = useState<boolean>(enabled);

  useEffect(function () {
    if (!enabled) {
      setFilteredLinks(links);
      setLoading(false);
      return;
    }

    let cancelled = false;

    function checkAll(): Promise<void> {
      // Separate targeted vs non-targeted
      const nonTargeted: IHyperLink[] = [];
      const targeted: Array<{ link: IHyperLink; groups: string[]; matchAll: boolean }> = [];

      links.forEach(function (link) {
        if (link.audienceTarget && link.audienceTarget.enabled && link.audienceTarget.groups.length > 0) {
          targeted.push({
            link: link,
            groups: link.audienceTarget.groups,
            matchAll: link.audienceTarget.matchAll,
          });
        } else {
          nonTargeted.push(link);
        }
      });

      if (targeted.length === 0) {
        if (!cancelled) {
          setFilteredLinks(links);
          setLoading(false);
        }
        return Promise.resolve();
      }

      // Collect unique groups for batch check
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

        // Filter targeted links
        const visibleTargeted: IHyperLink[] = [];
        targeted.forEach(function (t) {
          if (t.matchAll) {
            const allMatch = t.groups.every(function (g) { return membershipMap[g] === true; });
            if (allMatch) visibleTargeted.push(t.link);
          } else {
            const anyMatch = t.groups.some(function (g) { return membershipMap[g] === true; });
            if (anyMatch) visibleTargeted.push(t.link);
          }
        });

        // Merge and preserve original order
        const visibleIds: Record<string, boolean> = {};
        nonTargeted.forEach(function (l) { visibleIds[l.id] = true; });
        visibleTargeted.forEach(function (l) { visibleIds[l.id] = true; });

        const result = links.filter(function (link) { return visibleIds[link.id] === true; });

        setFilteredLinks(result);
        setLoading(false);
      }).catch(function () {
        if (!cancelled) {
          // On error, show all links (fail open)
          setFilteredLinks(links);
          setLoading(false);
        }
      });
    }

    checkAll().catch(function () { /* handled inside */ });

    return function () { cancelled = true; };
  }, [links, enabled]);

  return { filteredLinks: filteredLinks, loading: loading };
}
