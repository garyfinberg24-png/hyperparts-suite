import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IHyperDirectoryUser } from "../models";
import { DIRECTORY_USER_FIELDS, MAX_DIRECTORY_USERS, GRAPH_PAGE_SIZE } from "../models";
import { mapGraphUserToDirectory } from "../utils/userMapper";

export interface IDirectoryUsersResult {
  users: IHyperDirectoryUser[];
  loading: boolean;
  error: Error | undefined;
  refresh: () => void;
}

/** Hook to fetch all directory users from Microsoft Graph with pagination and caching */
export function useDirectoryUsers(
  userFilter: string,
  cacheEnabled: boolean,
  cacheDurationMinutes: number
): IDirectoryUsersResult {
  const [users, setUsers] = React.useState<IHyperDirectoryUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | undefined>(undefined);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const refresh = React.useCallback(function () {
    setRefreshKey(function (k) { return k + 1; });
  }, []);

  React.useEffect(function () {
    let cancelled = false;
    const cacheKey = "hyperDirectory_users_" + (userFilter || "all");
    const ttl = cacheEnabled ? cacheDurationMinutes * 60 * 1000 : 0;

    async function fetchUsers(): Promise<void> {
      setLoading(true);
      setError(undefined);

      try {
        // Try cache first (skip on manual refresh)
        if (refreshKey === 0 && cacheEnabled) {
          const cached = await hyperCache.get<IHyperDirectoryUser[]>(cacheKey);
          if (cached && !cancelled) {
            setUsers(cached);
            setLoading(false);
            return;
          }
        }

        const ctx = getContext();
        const client = await ctx.msGraphClientFactory.getClient("3");
        const allUsers: IHyperDirectoryUser[] = [];
        let nextLink: string | undefined = undefined;

        // Build initial request
        let request = client.api("/users").select(DIRECTORY_USER_FIELDS).top(GRAPH_PAGE_SIZE);
        if (userFilter) {
          request = request.filter(userFilter);
        }

        // First page
        const firstResponse = await request.get();
        if (firstResponse && firstResponse.value) {
          firstResponse.value.forEach(function (u: Record<string, unknown>) {
            allUsers.push(mapGraphUserToDirectory(u as Record<string, unknown>));
          });
        }
        nextLink = firstResponse["@odata.nextLink"];

        // Paginate through remaining pages
        while (nextLink && allUsers.length < MAX_DIRECTORY_USERS) {
          if (cancelled) break;
          const pageResponse = await client.api(nextLink).get();
          if (pageResponse && pageResponse.value) {
            pageResponse.value.forEach(function (u: Record<string, unknown>) {
              allUsers.push(mapGraphUserToDirectory(u as Record<string, unknown>));
            });
          }
          nextLink = pageResponse["@odata.nextLink"];
        }

        if (!cancelled) {
          setUsers(allUsers);
          setLoading(false);

          // Cache results
          if (cacheEnabled && ttl > 0) {
            await hyperCache.set(cacheKey, allUsers, ttl);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    }

    fetchUsers().catch(function () { /* handled inside */ });

    return function () { cancelled = true; };
  }, [userFilter, cacheEnabled, cacheDurationMinutes, refreshKey]);

  return { users: users, loading: loading, error: error, refresh: refresh };
}
