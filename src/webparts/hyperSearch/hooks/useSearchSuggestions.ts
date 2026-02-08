import { useEffect, useRef } from "react";
import { getSP } from "../../../common/services/HyperPnP";
import type { ISearchSuggestion } from "../models";
import { useHyperSearchStore } from "../store/useHyperSearchStore";

export interface UseSearchSuggestionsOptions {
  /** Whether type-ahead is enabled */
  enabled: boolean;
  /** Debounce delay in ms */
  debounceMs: number;
  /** Minimum characters before triggering suggestions */
  minChars: number;
}

/**
 * Provides type-ahead search suggestions via SP searchSuggest.
 * Debounces the input and updates the store.
 */
export function useSearchSuggestions(options: UseSearchSuggestionsOptions): void {
  const timerRef = useRef<number>(0);
  const store = useHyperSearchStore();
  const queryText = store.query.queryText;

  useEffect(function () {
    if (!options.enabled) {
      store.setSuggestions([]);
      return;
    }

    // Clear previous timer
    if (timerRef.current !== undefined && timerRef.current !== 0) {
      clearTimeout(timerRef.current);
      timerRef.current = 0;
    }

    // Not enough characters
    if (queryText.length < options.minChars) {
      store.setSuggestions([]);
      store.setSuggestionsLoading(false);
      return;
    }

    store.setSuggestionsLoading(true);

    timerRef.current = window.setTimeout(function () {
      const fetchSuggestions = async function (): Promise<void> {
        try {
          const sp = getSP();
          const suggestResult = await sp.searchSuggest(queryText);

          const suggestions: ISearchSuggestion[] = [];
          if (suggestResult.Queries) {
            suggestResult.Queries.forEach(function (q: Record<string, unknown>) {
              const text = (q.Query as string) || "";
              if (text) {
                suggestions.push({
                  text: text,
                  queryString: text,
                });
              }
            });
          }

          store.setSuggestions(suggestions);
          store.setSuggestionsLoading(false);
        } catch {
          store.setSuggestions([]);
          store.setSuggestionsLoading(false);
        }
      };

      fetchSuggestions().catch(function () { /* handled inside */ });
    }, options.debounceMs);

    return function () {
      if (timerRef.current !== undefined && timerRef.current !== 0) {
        clearTimeout(timerRef.current);
      }
    };
  }, [queryText, options.enabled, options.debounceMs, options.minChars, store]); // eslint-disable-line react-hooks/exhaustive-deps
}
