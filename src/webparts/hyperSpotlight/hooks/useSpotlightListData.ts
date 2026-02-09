import { useState, useEffect, useCallback } from "react";
import { getSP } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IHyperSpotlightEmployee } from "../models";
import { parseWebsites, parseCommaSeparated } from "../models";

export interface UseSpotlightListDataOptions {
  listTitle: string;
  maxItems: number;
  cacheTTL: number;
}

export interface UseSpotlightListDataResult {
  profiles: IHyperSpotlightEmployee[];
  loading: boolean;
  error: Error | undefined;
  refresh: () => void;
}

/**
 * Fetch employee spotlight data from a SharePoint list.
 * Ported from JML New Hire Spotlight loadNewHires() pattern.
 * Maps SP list columns to IHyperSpotlightEmployee including personal fields.
 */
export function useSpotlightListData(
  options: UseSpotlightListDataOptions
): UseSpotlightListDataResult {
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
    setRefreshKey(function (prev: number) { return prev + 1; });
  }, []);

  useEffect(function () {
    let cancelled = false;

    if (!options.listTitle) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    const cacheKey = "spotlight:listData:" + options.listTitle;

    const fetchData = function (): Promise<void> {
      return (async function (): Promise<void> {
        try {
          // Try cache first (skip on manual refresh)
          if (refreshKey === 0 && options.cacheTTL > 0) {
            const cached = await hyperCache.get<IHyperSpotlightEmployee[]>(cacheKey);
            if (cached && !cancelled) {
              setProfiles(cached);
              setLoading(false);
              return;
            }
          }

          const sp = getSP();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const items: any[] = await sp.web.lists.getByTitle(options.listTitle)
            .items
            .select(
              "ID", "Title", "Nickname", "JobTitle", "Department",
              "HireDate", "ProfilePhoto", "Hobbies", "FavoriteWebsites",
              "PersonalQuote", "Skillset", "DisplayOrder", "IsActive",
              "Email", "OfficeLocation", "AboutMe"
            )
            .filter("IsActive eq 1")
            .orderBy("DisplayOrder", true)
            .top(options.maxItems || 50)();

          const employees: IHyperSpotlightEmployee[] = [];

          items.forEach(function (item) {
            let photoUrl = "";
            if (item.ProfilePhoto) {
              photoUrl = typeof item.ProfilePhoto === "string"
                ? item.ProfilePhoto
                : (item.ProfilePhoto.Url || "");
            }

            employees.push({
              id: String(item.ID || ""),
              userPrincipalName: item.Email || "",
              displayName: item.Title || "",
              givenName: (item.Title || "").split(" ")[0],
              surname: (item.Title || "").split(" ").slice(1).join(" "),
              mail: item.Email || "",
              jobTitle: item.JobTitle || undefined,
              department: item.Department || undefined,
              officeLocation: item.OfficeLocation || undefined,
              hireDate: item.HireDate ? String(item.HireDate).split("T")[0] : undefined,
              photoUrl: photoUrl || undefined,
              aboutMe: item.AboutMe || undefined,

              // Personal "Get to Know Me" fields
              nickname: item.Nickname || undefined,
              personalQuote: item.PersonalQuote || undefined,
              hobbies: parseCommaSeparated(item.Hobbies),
              skillset: parseCommaSeparated(item.Skillset),
              favoriteWebsites: parseWebsites(item.FavoriteWebsites),
            });
          });

          if (options.cacheTTL > 0) {
            await hyperCache.set(cacheKey, employees, options.cacheTTL);
          }

          if (!cancelled) {
            setProfiles(employees);
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
    fetchData().catch(function () { /* handled above */ });

    return function () { cancelled = true; };
  }, [options.listTitle, options.maxItems, options.cacheTTL, refreshKey]);

  return { profiles: profiles, loading: loading, error: error, refresh: refresh };
}
