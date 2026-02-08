import type { IHyperNavLink } from "../models";

/**
 * Score how well a link matches a search query.
 * Weights: title = 3, description = 2, url = 1.
 * Returns 0 for no match.
 */
export function scoreLinkMatch(link: IHyperNavLink, query: string): number {
  const q = query.toLowerCase();
  let score = 0;

  if (link.title.toLowerCase().indexOf(q) !== -1) {
    score += 3;
  }
  if (link.description && link.description.toLowerCase().indexOf(q) !== -1) {
    score += 2;
  }
  if (link.url.toLowerCase().indexOf(q) !== -1) {
    score += 1;
  }

  return score;
}

/**
 * Flatten a recursive link tree into a single array.
 */
export function flattenLinks(links: IHyperNavLink[]): IHyperNavLink[] {
  const result: IHyperNavLink[] = [];
  links.forEach(function (link) {
    result.push(link);
    if (link.children && link.children.length > 0) {
      flattenLinks(link.children).forEach(function (child) {
        result.push(child);
      });
    }
  });
  return result;
}

/**
 * Recursively filter links by search query, keeping parents if any child matches.
 */
export function filterLinksByQuery(
  links: IHyperNavLink[],
  query: string
): IHyperNavLink[] {
  if (!query) return links;

  const result: IHyperNavLink[] = [];

  links.forEach(function (link) {
    const selfScore = scoreLinkMatch(link, query);
    const filteredChildren = filterLinksByQuery(link.children, query);

    if (selfScore > 0 || filteredChildren.length > 0) {
      result.push({
        ...link,
        children: filteredChildren,
      });
    }
  });

  return result;
}
