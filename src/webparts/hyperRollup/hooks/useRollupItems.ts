import { useState, useEffect, useCallback } from "react";
import { getSP, getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IHyperRollupItem, IHyperRollupSource, IHyperRollupQuery } from "../models";
import { buildKqlFromQuery } from "../utils/queryBuilder";
import { mapSearchResult, SEARCH_SELECT_PROPERTIES } from "../utils/searchResultMapper";

export interface UseRollupItemsOptions {
  sources: IHyperRollupSource[];
  query: IHyperRollupQuery;
  pageSize: number;
  cacheEnabled: boolean;
  cacheDuration: number;
  /** When true, skip all SP/API calls entirely (demo mode) */
  skipFetch?: boolean;
}

export interface UseRollupItemsResult {
  items: IHyperRollupItem[];
  loading: boolean;
  error: Error | undefined;
  totalCount: number;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

/**
 * Fetches items from a current site or specific site source via direct PnP list query.
 */
async function fetchFromList(
  source: IHyperRollupSource,
  query: IHyperRollupQuery,
  pageSize: number
): Promise<IHyperRollupItem[]> {
  const listName = source.listName || "Documents";
  const ctx = getContext();
  const currentSiteUrl = ctx.pageContext.web.absoluteUrl;
  const siteUrl = source.type === "specificSite" && source.siteUrl ? source.siteUrl : currentSiteUrl;
  const isCurrentSite = siteUrl === currentSiteUrl;

  if (isCurrentSite) {
    // Use PnP SP for current site
    const sp = getSP();
    let listQuery = sp.web.lists
      .getByTitle(listName)
      .items
      .select(
        "Id", "Title", "Created", "Modified",
        "FileRef", "FileLeafRef", "File_x0020_Type", "ContentType/Name",
        "Author/Id", "Author/Title", "Author/EMail",
        "Editor/Id", "Editor/Title"
      )
      .expand("ContentType", "Author", "Editor")
      .top(pageSize);

    // Apply content type filter if specified
    const filters: string[] = [];
    if (source.contentType) {
      filters.push("ContentType/Name eq '" + source.contentType + "'");
    }
    if (filters.length > 0) {
      listQuery = listQuery.filter(filters.join(" and "));
    }

    listQuery = listQuery.orderBy("Modified", false);

    let results: Array<Record<string, unknown>>;
    try {
      results = (await listQuery()) as Array<Record<string, unknown>>;
    } catch (fetchError) {
      // If the query fails (e.g., missing fields), return empty array
      // instead of crashing the entire web part
      return [];
    }
    const items: IHyperRollupItem[] = [];

    results.forEach(function (raw) {
      const author = raw.Author as Record<string, unknown> | undefined;
      const editor = raw.Editor as Record<string, unknown> | undefined;
      const ct = raw.ContentType as Record<string, unknown> | undefined;
      const itemId = raw.Id as number;

      items.push({
        id: listName + ":" + String(itemId),
        itemId: itemId,
        title: (raw.Title as string) || "",
        description: undefined,
        author: author ? (author.Title as string) : undefined,
        authorEmail: author ? (author.EMail as string) : undefined,
        editor: editor ? (editor.Title as string) : undefined,
        created: (raw.Created as string) || "",
        modified: (raw.Modified as string) || "",
        fileRef: (raw.FileRef as string) || undefined,
        fileType: (raw.File_x0020_Type as string) || undefined,
        contentType: ct ? (ct.Name as string) : undefined,
        category: undefined,
        fields: raw,
        sourceSiteUrl: siteUrl,
        sourceSiteName: ctx.pageContext.web.title,
        sourceListId: listName,
        sourceListName: listName,
        isFromSearch: false,
      });
    });

    return items;
  }

  // For specific sites, use SPHttpClient REST call
  const spHttpClient = ctx.spHttpClient;
  const endpoint = siteUrl +
    "/_api/web/lists/getByTitle('" + encodeURIComponent(listName) + "')/items" +
    "?$select=Id,Title,Created,Modified,FileRef,FileLeafRef,File_x0020_Type" +
    "&$top=" + String(pageSize) +
    "&$orderby=Modified desc";

  let rawItems: Array<Record<string, unknown>>;
  try {
    const response = await spHttpClient.get(
      endpoint,
      // SPFx SPHttpClient configuration enum value 1 = SPHttpClientConfiguration v1
      1 as unknown as import("@microsoft/sp-http").SPHttpClientConfiguration
    );
    const json = await response.json();
    rawItems = (json.value || []) as Array<Record<string, unknown>>;
  } catch (fetchError) {
    // If the request fails, return empty array instead of crashing
    return [];
  }
  const items: IHyperRollupItem[] = [];

  rawItems.forEach(function (raw) {
    const itemId = (raw.Id as number) || 0;
    items.push({
      id: listName + ":" + String(itemId),
      itemId: itemId,
      title: (raw.Title as string) || "",
      description: undefined,
      author: undefined,
      authorEmail: undefined,
      editor: undefined,
      created: (raw.Created as string) || "",
      modified: (raw.Modified as string) || "",
      fileRef: (raw.FileRef as string) || undefined,
      fileType: (raw.File_x0020_Type as string) || undefined,
      contentType: undefined,
      category: undefined,
      fields: raw,
      sourceSiteUrl: siteUrl,
      sourceSiteName: siteUrl,
      sourceListId: listName,
      sourceListName: listName,
      isFromSearch: false,
    });
  });

  return items;
}

/**
 * Fetches items via SharePoint Search API.
 * Used for hubSite and searchScope source types.
 */
async function fetchFromSearch(
  source: IHyperRollupSource,
  query: IHyperRollupQuery,
  pageSize: number
): Promise<IHyperRollupItem[]> {
  const sp = getSP();

  // Build KQL query
  const kqlParts: string[] = [];

  // Add user query rules
  const userKql = buildKqlFromQuery(query);
  if (userKql) {
    kqlParts.push(userKql);
  }

  // Add content type filter
  if (source.contentType) {
    kqlParts.push("ContentType:\"" + source.contentType + "\"");
  }

  // Add scope constraint
  if (source.type === "searchScope" && source.scope === "currentSiteCollection") {
    const siteUrl = getContext().pageContext.site.absoluteUrl;
    kqlParts.push("Path:\"" + siteUrl + "\"");
  }

  // Default to all content if no KQL specified
  const kql = kqlParts.length > 0 ? kqlParts.join(" AND ") : "*";

  const searchResults = await sp.search({
    Querytext: kql,
    RowLimit: pageSize,
    SelectProperties: SEARCH_SELECT_PROPERTIES,
    EnableInterleaving: true,
    TrimDuplicates: true,
    SortList: [{ Property: "LastModifiedTime", Direction: 1 }], // 1 = descending
  });

  const items: IHyperRollupItem[] = [];

  if (searchResults.PrimarySearchResults) {
    searchResults.PrimarySearchResults.forEach(function (row: Record<string, unknown>) {
      // Build cells array from row properties for mapper
      const cells: Array<{ Key: string; Value: string }> = [];
      Object.keys(row).forEach(function (key) {
        const val = row[key];
        if (val !== undefined) {
          cells.push({ Key: key, Value: String(val) });
        }
      });
      items.push(mapSearchResult(cells));
    });
  }

  return items;
}

/**
 * Master data hook for HyperRollup.
 * Fetches items from multiple sources (Search API + direct list queries),
 * merges, deduplicates, and exposes pagination.
 */
export function useRollupItems(options: UseRollupItemsOptions): UseRollupItemsResult {
  const [items, setItems] = useState<IHyperRollupItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const loadMore = useCallback(function (): void {
    setPage(function (prev) { return prev + 1; });
  }, []);

  const refresh = useCallback(function (): void {
    setPage(1);
    setItems([]);
    setRefreshKey(function (prev) { return prev + 1; });
  }, []);

  useEffect(function () {
    let cancelled = false;

    // Skip all SP/API calls when in demo mode
    if (options.skipFetch) {
      setItems([]);
      setTotalCount(0);
      setLoading(false);
      return undefined;
    }

    const fetchData = async function (): Promise<void> {
      const cacheKey = "rollupItems:" + JSON.stringify(options.sources) + ":" + String(page);

      try {
        // Try cache first (skip on manual refresh)
        if (options.cacheEnabled && refreshKey === 0) {
          const cached = await hyperCache.get<IHyperRollupItem[]>(cacheKey);
          if (cached && !cancelled) {
            setItems(function (prev) { return page === 1 ? cached : prev.concat(cached); });
            setTotalCount(cached.length);
            setLoading(false);
            return;
          }
        }

        // Fetch from each enabled source in parallel
        const enabledSources: IHyperRollupSource[] = [];
        options.sources.forEach(function (s) {
          if (s.enabled) {
            enabledSources.push(s);
          }
        });

        if (enabledSources.length === 0) {
          if (!cancelled) {
            setItems([]);
            setTotalCount(0);
            setLoading(false);
          }
          return;
        }

        const fetchPromises: Array<Promise<IHyperRollupItem[]>> = [];

        enabledSources.forEach(function (source) {
          if (source.type === "currentSite" || source.type === "specificSite") {
            fetchPromises.push(
              fetchFromList(source, options.query, options.pageSize * page)
            );
          } else {
            fetchPromises.push(
              fetchFromSearch(source, options.query, options.pageSize * page)
            );
          }
        });

        const resultArrays = await Promise.all(fetchPromises);

        // Merge all results
        const allItems: IHyperRollupItem[] = [];
        resultArrays.forEach(function (arr) {
          arr.forEach(function (item) {
            allItems.push(item);
          });
        });

        // Deduplicate by composite ID
        const seen = new Map<string, boolean>();
        const deduped: IHyperRollupItem[] = [];
        allItems.forEach(function (item) {
          if (!seen.get(item.id)) {
            seen.set(item.id, true);
            deduped.push(item);
          }
        });

        // Sort by modified descending
        deduped.sort(function (a, b) {
          const dateA = new Date(a.modified).getTime();
          const dateB = new Date(b.modified).getTime();
          return dateB - dateA;
        });

        // Cache the results
        if (options.cacheEnabled) {
          await hyperCache.set(cacheKey, deduped, options.cacheDuration);
        }

        if (!cancelled) {
          setItems(deduped);
          setTotalCount(deduped.length);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    setLoading(true);
    setError(undefined);
    fetchData().catch(function () { /* handled above */ });

    return function () { cancelled = true; };
  }, [options.sources, options.query, options.pageSize, options.cacheEnabled, options.cacheDuration, options.skipFetch, page, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    items: items,
    loading: loading,
    error: error,
    totalCount: totalCount,
    hasMore: items.length < totalCount,
    loadMore: loadMore,
    refresh: refresh,
  };
}
