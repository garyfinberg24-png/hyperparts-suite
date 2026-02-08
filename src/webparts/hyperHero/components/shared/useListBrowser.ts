import * as React from "react";
import { getSP } from "../../../../common/services/HyperPnP";

/**
 * SharePoint REST API list response object.
 */
interface ISPListInfo {
  Title: string;
  Id: string;
  ItemCount: number;
}

/**
 * Mapped list information for UI consumption.
 */
export interface IListInfo {
  title: string;
  id: string;
  itemCount: number;
}

/**
 * Return type for the useListBrowser hook.
 */
export interface IUseListBrowserResult {
  /** All non-hidden generic lists from the current site */
  lists: IListInfo[];
  /** True while fetching lists */
  loading: boolean;
  /** Error message if fetch fails */
  error: string | undefined;
  /** Re-fetch the list of lists */
  refresh: () => void;
  /** Create a new HyperHero content list with custom columns */
  createList: (name: string) => Promise<string>;
  /** True while creating a list */
  creating: boolean;
}

/**
 * Hook for browsing SharePoint generic lists and creating HyperHero content lists.
 *
 * Features:
 * - Fetches all non-hidden generic lists (BaseTemplate eq 100) from the current site
 * - Creates a new list with HyperHero-specific columns:
 *   - HeroHeading, HeroSubheading (text 255)
 *   - HeroDescription (multiline 6 rows)
 *   - HeroImageUrl, HeroLinkUrl (text 255)
 *   - HeroPublishDate, HeroUnpublishDate (text 50)
 *   - HeroSortOrder (number)
 * - Auto-refreshes after list creation
 *
 * ES5 constraints:
 * - No startsWith/endsWith/includes — uses indexOf
 * - No for...of — uses forEach
 * - No null — uses undefined
 * - Async function pattern with cancelled flag in useEffect
 */
export function useListBrowser(): IUseListBrowserResult {
  const [lists, setLists] = React.useState<IListInfo[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [creating, setCreating] = React.useState<boolean>(false);
  const [refreshKey, setRefreshKey] = React.useState<number>(0);

  /**
   * Fetch all non-hidden generic lists from the current site.
   */
  const fetchLists = React.useCallback(async function (): Promise<void> {
    setLoading(true);
    setError(undefined);

    try {
      const sp = getSP();
      const rawLists = await sp.web.lists
        .select("Title", "Id", "ItemCount")
        .filter("Hidden eq false and BaseTemplate eq 100")() as ISPListInfo[];

      const mapped: IListInfo[] = [];
      rawLists.forEach(function (raw: ISPListInfo): void {
        mapped.push({
          title: raw.Title,
          id: raw.Id,
          itemCount: raw.ItemCount,
        });
      });

      setLists(mapped);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setLists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Effect to fetch lists on mount and when refreshKey changes.
   */
  React.useEffect(function () {
    let cancelled = false;

    async function fetch(): Promise<void> {
      try {
        await fetchLists();
      } catch {
        // Error handling is done inside fetchLists
        if (!cancelled) {
          // Ensure loading state is reset even if fetchLists throws unexpectedly
          setLoading(false);
        }
      }
    }

    fetch().catch(function () { /* handled inside */ });

    return function () {
      cancelled = true;
    };
  }, [fetchLists, refreshKey]);

  /**
   * Create a new SharePoint list with HyperHero-specific columns.
   *
   * @param name - The name of the list to create
   * @returns Promise resolving to the list name
   */
  const createList = React.useCallback(async function (name: string): Promise<string> {
    if (!name || name.length === 0) {
      throw new Error("List name is required");
    }

    setCreating(true);
    setError(undefined);

    try {
      const sp = getSP();

      // 1. Create the list (BaseTemplate 100 = Generic List)
      await sp.web.lists.add(name, "HyperHero content list", 100, false);

      // 2. Get reference to the newly created list
      const list = sp.web.lists.getByTitle(name);

      // 3. Add custom fields
      await list.fields.addText("HeroHeading", { MaxLength: 255 });
      await list.fields.addText("HeroSubheading", { MaxLength: 255 });
      await list.fields.addMultilineText("HeroDescription", { NumberOfLines: 6 });
      await list.fields.addText("HeroImageUrl", { MaxLength: 255 });
      await list.fields.addText("HeroLinkUrl", { MaxLength: 255 });
      await list.fields.addText("HeroPublishDate", { MaxLength: 50 });
      await list.fields.addText("HeroUnpublishDate", { MaxLength: 50 });
      await list.fields.addNumber("HeroSortOrder");

      // 4. Refresh the list of lists to show the new list
      setRefreshKey(function (prev) { return prev + 1; });

      // 5. Return the list name
      return name;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      throw e;
    } finally {
      setCreating(false);
    }
  }, []);

  /**
   * Trigger a manual refresh of the lists.
   */
  const refresh = React.useCallback(function (): void {
    setRefreshKey(function (prev) { return prev + 1; });
  }, []);

  return {
    lists: lists,
    loading: loading,
    error: error,
    refresh: refresh,
    createList: createList,
    creating: creating,
  };
}
