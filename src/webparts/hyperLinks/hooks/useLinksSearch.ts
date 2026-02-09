/**
 * useLinksSearch — Real-time search/filter within link collections.
 *
 * Performs weighted search across title (weight 3), description (weight 2),
 * and group name (weight 1). Debounced at 200ms for performance.
 */

import * as React from "react";
import type { IHyperLink } from "../models";

export interface ILinksSearchResult {
  query: string;
  setQuery: (q: string) => void;
  filteredLinks: IHyperLink[];
  isFiltering: boolean;
}

/** Normalize a string for case-insensitive search */
function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

/** Check if a string contains the search term */
function containsTerm(text: string, term: string): boolean {
  return normalizeText(text).indexOf(term) !== -1;
}

export function useLinksSearch(
  links: IHyperLink[],
  enabled: boolean
): ILinksSearchResult {
  var queryState = React.useState<string>("");
  var query = queryState[0];
  var setQuery = queryState[1];

  var debouncedState = React.useState<string>("");
  var debouncedQuery = debouncedState[0];
  var setDebouncedQuery = debouncedState[1];

  // eslint-disable-next-line @rushstack/no-new-null
  var timerRef = React.useRef<number>(0);

  // Debounce the query
  React.useEffect(function () {
    if (!enabled) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(function () {
      setDebouncedQuery(query);
    }, 200) as unknown as number;

    return function () {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query, enabled]);

  var filteredLinks = React.useMemo(function () {
    if (!enabled || !debouncedQuery) return links;

    var term = normalizeText(debouncedQuery);
    if (!term) return links;

    // Score and filter links
    var scored: Array<{ link: IHyperLink; score: number }> = [];

    links.forEach(function (link) {
      var score = 0;

      // Title match (weight 3)
      if (containsTerm(link.title, term)) {
        score += 3;
      }

      // Description match (weight 2)
      if (link.description && containsTerm(link.description, term)) {
        score += 2;
      }

      // Group name match (weight 1)
      if (link.groupName && containsTerm(link.groupName, term)) {
        score += 1;
      }

      if (score > 0) {
        scored.push({ link: link, score: score });
      }
    });

    // Sort by score descending, then by original order
    scored.sort(function (a, b) {
      return b.score - a.score;
    });

    var result: IHyperLink[] = [];
    scored.forEach(function (item) {
      result.push(item.link);
    });
    return result;
  }, [links, debouncedQuery, enabled]);

  var isFiltering = enabled && debouncedQuery.length > 0;

  return {
    query: query,
    setQuery: setQuery,
    filteredLinks: filteredLinks,
    isFiltering: isFiltering,
  };
}
