import type { IHyperLink, IHyperLinkGroup } from "../models";
import { DEFAULT_HYPER_LINK } from "../models";

/** Parse JSON-stringified links array, returning empty array on failure */
export function parseLinks(linksJson: string): IHyperLink[] {
  try {
    const parsed = JSON.parse(linksJson);
    return Array.isArray(parsed) ? parsed as IHyperLink[] : [];
  } catch {
    return [];
  }
}

/** Stringify links array to JSON */
export function stringifyLinks(links: IHyperLink[]): string {
  return JSON.stringify(links);
}

/** Parse JSON-stringified groups array */
export function parseGroups(groupsJson: string): IHyperLinkGroup[] {
  try {
    const parsed = JSON.parse(groupsJson);
    return Array.isArray(parsed) ? parsed as IHyperLinkGroup[] : [];
  } catch {
    return [];
  }
}

/** Stringify groups array to JSON */
export function stringifyGroups(groups: IHyperLinkGroup[]): string {
  return JSON.stringify(groups);
}

/** Generate a unique link ID */
export function generateLinkId(): string {
  return "link-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Generate a unique group ID */
export function generateGroupId(): string {
  return "group-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Create a new link with defaults */
export function createLink(title: string, sortOrder: number): IHyperLink {
  return {
    ...DEFAULT_HYPER_LINK,
    id: generateLinkId(),
    title: title,
    sortOrder: sortOrder,
  };
}

/** Create a new group with defaults */
export function createGroup(name: string, sortOrder: number): IHyperLinkGroup {
  return {
    id: generateGroupId(),
    name: name,
    sortOrder: sortOrder,
    collapsed: false,
  };
}

/** Reorder a link from one index to another */
export function reorderLink(
  links: IHyperLink[],
  fromIndex: number,
  toIndex: number
): IHyperLink[] {
  if (fromIndex < 0 || fromIndex >= links.length) return links;
  if (toIndex < 0 || toIndex >= links.length) return links;
  if (fromIndex === toIndex) return links;

  const reordered: IHyperLink[] = [];
  links.forEach(function (l) { reordered.push({ ...l }); });

  const moved = reordered.splice(fromIndex, 1)[0];
  reordered.splice(toIndex, 0, moved);

  reordered.forEach(function (link, idx) {
    link.sortOrder = idx;
  });

  return reordered;
}

/** Remove a link by ID */
export function removeLink(
  links: IHyperLink[],
  linkId: string
): IHyperLink[] {
  const filtered = links.filter(function (l) { return l.id !== linkId; });
  filtered.forEach(function (link, idx) {
    link.sortOrder = idx;
  });
  return filtered;
}

/** Remove a group by ID */
export function removeGroup(
  groups: IHyperLinkGroup[],
  groupId: string
): IHyperLinkGroup[] {
  const filtered = groups.filter(function (g) { return g.id !== groupId; });
  filtered.forEach(function (group, idx) {
    group.sortOrder = idx;
  });
  return filtered;
}
