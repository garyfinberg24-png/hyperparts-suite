import type { ISearchHistoryEntry } from "../models";
import { MAX_HISTORY_ENTRIES } from "../models";

/** LocalStorage key for search history */
const STORAGE_KEY = "hyperSearch_history";

/**
 * Loads search history from localStorage.
 */
export function loadSearchHistory(): ISearchHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as ISearchHistoryEntry[] : [];
  } catch {
    return [];
  }
}

/**
 * Saves a new search entry to history.
 * Deduplicates by queryText (most recent wins) and caps at MAX_HISTORY_ENTRIES.
 */
export function saveSearchEntry(queryText: string, resultCount: number): ISearchHistoryEntry[] {
  const existing = loadSearchHistory();

  // Remove any existing entry with the same query text
  const filtered: ISearchHistoryEntry[] = [];
  existing.forEach(function (entry) {
    if (entry.queryText !== queryText) {
      filtered.push(entry);
    }
  });

  // Add new entry at the front
  const newEntry: ISearchHistoryEntry = {
    queryText: queryText,
    timestamp: new Date().toISOString(),
    resultCount: resultCount,
  };
  filtered.unshift(newEntry);

  // Cap at max entries
  const capped = filtered.length > MAX_HISTORY_ENTRIES
    ? filtered.slice(0, MAX_HISTORY_ENTRIES)
    : filtered;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
  } catch {
    // localStorage full or unavailable — silently ignore
  }

  return capped;
}

/**
 * Clears all search history.
 */
export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable — silently ignore
  }
}
