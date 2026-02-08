import * as React from "react";
import type { IHyperDirectoryUser } from "../models";
import { scoreUserMatch } from "../utils/searchUtils";

export interface IDirectorySearchResult {
  filteredUsers: IHyperDirectoryUser[];
  resultCount: number;
}

/**
 * Debounced client-side search hook.
 * Filters and scores users based on search query, returns sorted results.
 */
export function useDirectorySearch(
  users: IHyperDirectoryUser[],
  searchQuery: string,
  debounceMs: number
): IDirectorySearchResult {
  const [debouncedQuery, setDebouncedQuery] = React.useState(searchQuery);

  // Debounce the search query
  React.useEffect(function () {
    const timer = window.setTimeout(function () {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return function () { clearTimeout(timer); };
  }, [searchQuery, debounceMs]);

  // Filter and score users
  const result = React.useMemo(function (): IDirectorySearchResult {
    if (!debouncedQuery) {
      return { filteredUsers: users, resultCount: users.length };
    }

    const scored: Array<{ user: IHyperDirectoryUser; score: number }> = [];

    users.forEach(function (user) {
      const score = scoreUserMatch(user, debouncedQuery);
      if (score > 0) {
        scored.push({ user: user, score: score });
      }
    });

    // Sort by score (desc), then displayName (asc)
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.user.displayName.localeCompare(b.user.displayName);
    });

    const filteredUsers = scored.map(function (entry) { return entry.user; });

    return { filteredUsers: filteredUsers, resultCount: filteredUsers.length };
  }, [users, debouncedQuery]);

  return result;
}
