import * as React from "react";
import type { IHyperNavLink } from "../models";
import { filterLinksByQuery } from "../utils/searchUtils";

export interface INavSearchResult {
  /** Filtered links matching search query */
  filteredLinks: IHyperNavLink[];
}

/**
 * Debounced search hook for navigation links.
 * Recursively filters link tree, keeping parents if any child matches.
 */
export function useNavSearch(
  links: IHyperNavLink[],
  searchQuery: string,
  debounceMs?: number
): INavSearchResult {
  const delay = debounceMs !== undefined ? debounceMs : 250;
  const [debouncedQuery, setDebouncedQuery] = React.useState(searchQuery);

  React.useEffect(function () {
    const timer = window.setTimeout(function () {
      setDebouncedQuery(searchQuery);
    }, delay);
    return function () { clearTimeout(timer); };
  }, [searchQuery, delay]);

  const filteredLinks = React.useMemo(function () {
    return filterLinksByQuery(links, debouncedQuery);
  }, [links, debouncedQuery]);

  return { filteredLinks: filteredLinks };
}
