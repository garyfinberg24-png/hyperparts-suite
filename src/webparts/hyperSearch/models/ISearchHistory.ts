/** Maximum number of search history entries to retain */
export const MAX_HISTORY_ENTRIES = 10;

/** A single search history entry */
export interface ISearchHistoryEntry {
  /** The search query text */
  queryText: string;
  /** When the search was executed (ISO 8601) */
  timestamp: string;
  /** Number of results returned */
  resultCount: number;
}
