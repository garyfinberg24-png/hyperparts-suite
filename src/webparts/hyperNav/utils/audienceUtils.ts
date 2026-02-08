import type { IHyperNavLink } from "../models";

/**
 * Recursively collect all unique audience group names from a link tree.
 */
export function collectUniqueGroups(links: IHyperNavLink[]): string[] {
  const groupSet: Record<string, boolean> = {};

  function walk(items: IHyperNavLink[]): void {
    items.forEach(function (link) {
      if (link.audienceTarget && link.audienceTarget.enabled) {
        link.audienceTarget.groups.forEach(function (g) {
          groupSet[g] = true;
        });
      }
      if (link.children && link.children.length > 0) {
        walk(link.children);
      }
    });
  }

  walk(links);
  return Object.keys(groupSet);
}

/**
 * Recursively filter a link tree by audience membership.
 * membershipMap: group name → boolean (is user a member).
 * Links with audience targeting disabled are always visible.
 */
export function filterLinksByAudience(
  links: IHyperNavLink[],
  membershipMap: Record<string, boolean>
): IHyperNavLink[] {
  const result: IHyperNavLink[] = [];

  links.forEach(function (link) {
    // If audience targeting is not enabled, link is visible
    if (!link.audienceTarget || !link.audienceTarget.enabled) {
      const filteredChildren = filterLinksByAudience(link.children, membershipMap);
      result.push({ ...link, children: filteredChildren });
      return;
    }

    const groups = link.audienceTarget.groups;
    if (groups.length === 0) {
      const filteredChildren = filterLinksByAudience(link.children, membershipMap);
      result.push({ ...link, children: filteredChildren });
      return;
    }

    let isVisible: boolean;
    if (link.audienceTarget.matchAll) {
      isVisible = groups.every(function (g) { return !!membershipMap[g]; });
    } else {
      isVisible = groups.some(function (g) { return !!membershipMap[g]; });
    }

    if (isVisible) {
      const filteredChildren = filterLinksByAudience(link.children, membershipMap);
      result.push({ ...link, children: filteredChildren });
    }
  });

  return result;
}
