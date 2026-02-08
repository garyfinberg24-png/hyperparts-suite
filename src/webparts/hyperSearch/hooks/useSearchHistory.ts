import { useEffect, useCallback } from "react";
import { useHyperSearchStore } from "../store/useHyperSearchStore";
import { loadSearchHistory, saveSearchEntry, clearSearchHistory } from "../utils/historyManager";

export interface UseSearchHistoryOptions {
  /** Whether search history is enabled */
  enabled: boolean;
}

export interface UseSearchHistoryResult {
  /** Save a search to history */
  saveEntry: (queryText: string, resultCount: number) => void;
  /** Clear all history */
  clearHistory: () => void;
}

/**
 * Manages search history persistence via localStorage.
 * Loads history on mount, provides save/clear actions.
 */
export function useSearchHistory(options: UseSearchHistoryOptions): UseSearchHistoryResult {
  const store = useHyperSearchStore();

  // Load history on mount
  useEffect(function () {
    if (!options.enabled) {
      store.setHistory([]);
      return;
    }
    const history = loadSearchHistory();
    store.setHistory(history);
  }, [options.enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveEntry = useCallback(function (queryText: string, resultCount: number): void {
    if (!options.enabled) return;
    const updated = saveSearchEntry(queryText, resultCount);
    store.setHistory(updated);
  }, [options.enabled, store]);

  const clearHistoryAction = useCallback(function (): void {
    clearSearchHistory();
    store.setHistory([]);
  }, [store]);

  return {
    saveEntry: saveEntry,
    clearHistory: clearHistoryAction,
  };
}
