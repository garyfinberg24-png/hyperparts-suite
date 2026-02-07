import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";
import type { IHyperProfileUser } from "../models";

export interface IProfileSearchResult {
  results: IHyperProfileUser[];
  loading: boolean;
  error: Error | undefined;
  search: (query: string) => void;
  clearResults: () => void;
}

const SEARCH_FIELDS = "id,displayName,mail,jobTitle,department,userPrincipalName";
const DEBOUNCE_MS = 300;

/** Hook for debounced user search in directory mode */
export function useProfileSearch(): IProfileSearchResult {
  const [results, setResults] = React.useState<IHyperProfileUser[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);
  // eslint-disable-next-line @rushstack/no-new-null
  const timerRef = React.useRef<number | undefined>(undefined);

  const clearResults = React.useCallback(function () {
    setResults([]);
  }, []);

  const search = React.useCallback(function (query: string): void {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
    }

    if (!query || query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    timerRef.current = window.setTimeout(function () {
      async function doSearch(): Promise<void> {
        try {
          const ctx = getContext();
          const client = await ctx.msGraphClientFactory.getClient("3");
          const filterQuery = "startswith(displayName,'" + query + "') or startswith(mail,'" + query + "')";
          const response = await client
            .api("/users")
            .filter(filterQuery)
            .select(SEARCH_FIELDS)
            .top(10)
            .get();

          const users: IHyperProfileUser[] = (response.value || []).map(function (u: Record<string, unknown>) {
            return {
              id: String(u.id || ""),
              displayName: String(u.displayName || ""),
              mail: String(u.mail || ""),
              jobTitle: u.jobTitle ? String(u.jobTitle) : undefined,
              department: u.department ? String(u.department) : undefined,
              userPrincipalName: String(u.userPrincipalName || ""),
            } as IHyperProfileUser;
          });

          setResults(users);
          setError(undefined);
        } catch (err) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setResults([]);
        } finally {
          setLoading(false);
        }
      }
      doSearch().catch(function () { /* handled inside */ });
    }, DEBOUNCE_MS);
  }, []);

  // Cleanup timer on unmount
  React.useEffect(function () {
    return function () {
      if (timerRef.current !== undefined) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { results: results, loading: loading, error: error, search: search, clearResults: clearResults };
}
