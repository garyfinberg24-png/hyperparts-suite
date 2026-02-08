import { useEffect, useCallback } from "react";
import { getSP } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IHyperSearchResult, ISearchQuery, ISearchRefiner } from "../models";
import { useHyperSearchStore } from "../store/useHyperSearchStore";
import { buildSearchKql, buildSortList, parseRefinerFields, isGraphScope } from "../utils/searchQueryBuilder";
import { SEARCH_SELECT_PROPERTIES } from "../utils/searchQueryBuilder";
import { mapSpSearchResult } from "../utils/resultMapper";
import { executeGraphSearch, getEntityTypes } from "../utils/graphSearchMapper";

export interface UseSearchQueryOptions {
  /** Whether search is enabled (false = no auto-search) */
  enabled: boolean;
  /** Refiner managed property names JSON string */
  refinerFields: string;
  /** Enable refiners */
  enableRefiners: boolean;
}

/**
 * Parses SP Search RefinementResults into ISearchRefiner[].
 */
function parseRefinementResults(rawRefiners: unknown): ISearchRefiner[] {
  if (!rawRefiners || !Array.isArray(rawRefiners)) return [];

  const refiners: ISearchRefiner[] = [];
  (rawRefiners as Array<Record<string, unknown>>).forEach(function (refiner) {
    const fieldName = (refiner.RefinerName as string) || "";
    const entries = (refiner.Entries as Array<Record<string, unknown>>) || [];
    if (!fieldName || entries.length === 0) return;

    const values: Array<{ value: string; count: number }> = [];
    entries.forEach(function (entry) {
      const value = (entry.RefinementValue as string) || "";
      const count = (entry.RefinementCount as number) || 0;
      if (value && count > 0) {
        values.push({ value: value, count: count });
      }
    });

    if (values.length > 0) {
      refiners.push({
        fieldName: fieldName,
        displayName: fieldName,
        values: values,
      });
    }
  });

  return refiners;
}

/**
 * Executes a SharePoint Search query and updates the store.
 */
async function executeSpSearch(
  query: ISearchQuery,
  refinerFieldsList: string[],
  enableRefiners: boolean
): Promise<{ results: IHyperSearchResult[]; totalCount: number; refiners: ISearchRefiner[]; spellingSuggestion: string }> {
  const sp = getSP();
  const kql = buildSearchKql(query);
  const sortList = buildSortList(query);

  // Build refiners request string
  const refinersRequest = enableRefiners && refinerFieldsList.length > 0
    ? refinerFieldsList.join(",")
    : "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchOptions: Record<string, any> = {
    Querytext: kql,
    RowLimit: query.pageSize,
    StartRow: query.startRow,
    SelectProperties: SEARCH_SELECT_PROPERTIES,
    EnableInterleaving: true,
    TrimDuplicates: true,
    EnableQueryRules: true,
  };

  if (sortList.length > 0) {
    searchOptions.SortList = sortList;
  }

  if (refinersRequest) {
    searchOptions.Refiners = refinersRequest;
  }

  const searchResult = await sp.search(searchOptions);

  // Map results
  const results: IHyperSearchResult[] = [];
  let rank = query.startRow;
  if (searchResult.PrimarySearchResults) {
    searchResult.PrimarySearchResults.forEach(function (row: Record<string, unknown>) {
      results.push(mapSpSearchResult(row, rank));
      rank++;
    });
  }

  // Parse refiners
  const refiners = parseRefinementResults(
    (searchResult as unknown as Record<string, unknown>).RefinementResults
  );

  // Spelling suggestion
  const spellingSuggestion = (searchResult as unknown as Record<string, unknown>).SpellingSuggestion as string || "";

  return {
    results: results,
    totalCount: searchResult.TotalRows || 0,
    refiners: refiners,
    spellingSuggestion: spellingSuggestion,
  };
}

/**
 * Master search hook for HyperSearch.
 * In S1, only supports SharePoint Search (SP scopes).
 * Graph Search (Teams/Exchange) is added in S2.
 */
export function useSearchQuery(options: UseSearchQueryOptions): {
  executeSearch: () => void;
} {
  const store = useHyperSearchStore();

  const executeSearch = useCallback(function (): void {
    const query = useHyperSearchStore.getState().query;
    if (!query.queryText.trim()) return;

    store.setLoading(true);
    store.setError("");
    store.setSpellingSuggestion("");

    const cacheKey = "hyperSearch:" + JSON.stringify(query);
    const refinerFieldsList = parseRefinerFields(options.refinerFields);
    const useGraph = isGraphScope(query.scope);

    const doSearch = async function (): Promise<void> {
      // Try cache
      const cached = await hyperCache.get<{
        results: IHyperSearchResult[];
        totalCount: number;
        refiners: ISearchRefiner[];
        spellingSuggestion: string;
      }>(cacheKey);

      if (cached) {
        store.setResults(cached.results, cached.totalCount);
        if (options.enableRefiners) {
          store.setRefiners(cached.refiners);
        }
        store.setSpellingSuggestion(cached.spellingSuggestion);
        store.setLoading(false);
        return;
      }

      if (useGraph) {
        // Graph Search for Teams/Exchange scopes
        const entityTypes = getEntityTypes(query.scope);
        const graphResult = await executeGraphSearch(
          query.queryText,
          entityTypes,
          query.startRow,
          query.pageSize
        );

        const cacheData = {
          results: graphResult.results,
          totalCount: graphResult.totalCount,
          refiners: [] as ISearchRefiner[],
          spellingSuggestion: "",
        };
        await hyperCache.set(cacheKey, cacheData, 60);

        store.setResults(graphResult.results, graphResult.totalCount);
        store.setRefiners([]);
        store.setSpellingSuggestion("");
        store.setLoading(false);
        return;
      }

      // SP Search for SharePoint/OneDrive/CurrentSite/Everything scopes
      const result = await executeSpSearch(query, refinerFieldsList, options.enableRefiners);

      // Cache for 60 seconds
      await hyperCache.set(cacheKey, result, 60);

      store.setResults(result.results, result.totalCount);
      if (options.enableRefiners) {
        store.setRefiners(result.refiners);
      }
      store.setSpellingSuggestion(result.spellingSuggestion);
      store.setLoading(false);
    };

    doSearch().catch(function (err) {
      store.setError(err instanceof Error ? err.message : String(err));
      store.setLoading(false);
    });
  }, [options.refinerFields, options.enableRefiners, store]);

  // Auto-execute search when query changes (if enabled and queryText is non-empty)
  useEffect(function () {
    if (!options.enabled) return;
    const query = store.query;
    if (!query.queryText.trim()) return;

    executeSearch();
  }, [store.query, options.enabled, executeSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    executeSearch: executeSearch,
  };
}
