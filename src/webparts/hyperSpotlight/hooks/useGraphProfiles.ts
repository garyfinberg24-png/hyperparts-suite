import { useState, useEffect, useCallback } from "react";
import { getGraph, getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IHyperSpotlightEmployee } from "../models";

const GRAPH_USER_SELECT =
  "id,userPrincipalName,displayName,givenName,surname,mail,jobTitle," +
  "department,officeLocation,businessPhones,mobilePhone,birthday,hireDate";

const PAGE_SIZE = 500;
const MAX_USERS = 10000;

export interface UseGraphProfilesResult {
  profiles: IHyperSpotlightEmployee[];
  loading: boolean;
  error: Error | undefined;
  refresh: () => void;
}

/**
 * Fetch all user profiles from the tenant via MSGraphClient with pagination.
 * Results are cached via hyperCache.
 */
export function useGraphProfiles(cacheTTL?: number): UseGraphProfilesResult {
  const ttl = cacheTTL !== undefined ? cacheTTL : 3600000; // 1 hour default

  const refreshState = useState(0);
  const refreshKey = refreshState[0];
  const setRefreshKey = refreshState[1];

  const profilesState = useState<IHyperSpotlightEmployee[]>([]);
  const profiles = profilesState[0];
  const setProfiles = profilesState[1];

  const loadingState = useState<boolean>(true);
  const loading = loadingState[0];
  const setLoading = loadingState[1];

  const errorState = useState<Error | undefined>(undefined);
  const error = errorState[0];
  const setError = errorState[1];

  const refresh = useCallback(function () {
    setRefreshKey(function (prev) { return prev + 1; });
  }, []);

  useEffect(function () {
    let cancelled = false;
    const cacheKey = "spotlight:allProfiles";

    const fetchAll = function (): Promise<void> {
      return (async function (): Promise<void> {
        try {
          // Try cache first (skip on manual refresh)
          if (refreshKey === 0) {
            const cached = await hyperCache.get<IHyperSpotlightEmployee[]>(cacheKey);
            if (cached && !cancelled) {
              setProfiles(cached);
              setLoading(false);
              return;
            }
          }

          // Use MSGraphClient for paginated all-users query
          const client = await getContext().msGraphClientFactory.getClient("3");
          const users: IHyperSpotlightEmployee[] = [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let nextLink: string | undefined = undefined;

          // First request
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const firstResponse: any = await client
            .api("/users")
            .select(GRAPH_USER_SELECT)
            .top(PAGE_SIZE)
            .get();

          if (firstResponse && firstResponse.value) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            firstResponse.value.forEach(function (u: any) {
              users.push(mapGraphUser(u));
            });
          }
          nextLink = firstResponse["@odata.nextLink"];

          // Paginate
          while (nextLink && users.length < MAX_USERS) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pageResponse: any = await client.api(nextLink).get();

            if (pageResponse && pageResponse.value) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              pageResponse.value.forEach(function (u: any) {
                users.push(mapGraphUser(u));
              });
            }

            nextLink = pageResponse["@odata.nextLink"];
          }

          if (ttl > 0) {
            await hyperCache.set(cacheKey, users, ttl);
          }

          if (!cancelled) {
            setProfiles(users);
            setLoading(false);
          }
        } catch (err) {
          if (!cancelled) {
            setError(err instanceof Error ? err : new Error(String(err)));
            setLoading(false);
          }
        }
      })();
    };

    setLoading(true);
    setError(undefined);
    fetchAll().catch(function () { /* handled above */ });

    return function () { cancelled = true; };
  }, [refreshKey, ttl]);

  return { profiles: profiles, loading: loading, error: error, refresh: refresh };
}

/**
 * Fetch specific user profiles by ID/UPN list via PnP Graph individual calls.
 * Uses concurrency control to avoid throttling.
 */
export function useGraphProfilesByIds(
  userIds: string[],
  cacheTTL?: number
): UseGraphProfilesResult {
  const ttl = cacheTTL !== undefined ? cacheTTL : 600000; // 10 min

  const refreshState = useState(0);
  const refreshKey = refreshState[0];
  const setRefreshKey = refreshState[1];

  const profilesState = useState<IHyperSpotlightEmployee[]>([]);
  const profiles = profilesState[0];
  const setProfiles = profilesState[1];

  const loadingState = useState<boolean>(true);
  const loading = loadingState[0];
  const setLoading = loadingState[1];

  const errorState = useState<Error | undefined>(undefined);
  const error = errorState[0];
  const setError = errorState[1];

  const refresh = useCallback(function () {
    setRefreshKey(function (prev) { return prev + 1; });
  }, []);

  // Stable dep key for userIds array
  const idsKey = userIds ? userIds.join(",") : "";

  useEffect(function () {
    let cancelled = false;
    const MAX_CONCURRENT = 5;

    if (!userIds || userIds.length === 0) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    const cacheKey = "spotlight:manualProfiles:" + idsKey;

    const fetchByIds = function (): Promise<void> {
      return (async function (): Promise<void> {
        try {
          // Try cache
          if (refreshKey === 0 && ttl > 0) {
            const cached = await hyperCache.get<IHyperSpotlightEmployee[]>(cacheKey);
            if (cached && !cancelled) {
              setProfiles(cached);
              setLoading(false);
              return;
            }
          }

          const graph = getGraph();
          const results: IHyperSpotlightEmployee[] = [];

          // Chunk into concurrency groups
          const chunks: string[][] = [];
          for (let i = 0; i < userIds.length; i += MAX_CONCURRENT) {
            chunks.push(userIds.slice(i, i + MAX_CONCURRENT));
          }

          for (let c = 0; c < chunks.length; c++) {
            const promises = chunks[c].map(function (uid) {
              return graph.users.getById(uid).select(GRAPH_USER_SELECT)()
                .then(function (u: Record<string, unknown>) {
                  return mapGraphUser(u);
                })
                .catch(function () {
                  return undefined;
                });
            });

            const resolved = await Promise.all(promises);
            resolved.forEach(function (emp) {
              if (emp) results.push(emp);
            });
          }

          if (ttl > 0) {
            await hyperCache.set(cacheKey, results, ttl);
          }

          if (!cancelled) {
            setProfiles(results);
            setLoading(false);
          }
        } catch (err) {
          if (!cancelled) {
            setError(err instanceof Error ? err : new Error(String(err)));
            setLoading(false);
          }
        }
      })();
    };

    setLoading(true);
    setError(undefined);
    fetchByIds().catch(function () { /* handled above */ });

    return function () { cancelled = true; };
  }, [idsKey, refreshKey, ttl]);

  return { profiles: profiles, loading: loading, error: error, refresh: refresh };
}

/* ── Mapping helper ── */

function mapGraphUser(u: Record<string, unknown>): IHyperSpotlightEmployee {
  return {
    id: String(u.id || ""),
    userPrincipalName: String(u.userPrincipalName || ""),
    displayName: String(u.displayName || ""),
    givenName: String(u.givenName || ""),
    surname: String(u.surname || ""),
    mail: String(u.mail || ""),
    jobTitle: u.jobTitle ? String(u.jobTitle) : undefined,
    department: u.department ? String(u.department) : undefined,
    officeLocation: u.officeLocation ? String(u.officeLocation) : undefined,
    businessPhones: Array.isArray(u.businessPhones) ? u.businessPhones as string[] : undefined,
    mobilePhone: u.mobilePhone ? String(u.mobilePhone) : undefined,
    birthday: u.birthday ? String(u.birthday) : undefined,
    hireDate: u.hireDate ? String(u.hireDate) : undefined,
  };
}
