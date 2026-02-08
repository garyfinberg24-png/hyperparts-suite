/** Search scope types */
export type SearchScopeType =
  | "everything"
  | "sharepoint"
  | "onedrive"
  | "teams"
  | "exchange"
  | "currentSite";

/** Sort options for search results */
export type SearchSortBy =
  | "relevance"
  | "dateModified"
  | "author";

/** Represents a search query configuration */
export interface ISearchQuery {
  /** The user's search text */
  queryText: string;
  /** Which scope to search */
  scope: SearchScopeType;
  /** How to sort results */
  sortBy: SearchSortBy;
  /** Active refiner selections: fieldName -> selected values */
  refiners: Record<string, string[]>;
  /** Starting row for pagination (0-based) */
  startRow: number;
  /** Number of results per page */
  pageSize: number;
}

/** Default search query */
export const DEFAULT_QUERY: ISearchQuery = {
  queryText: "",
  scope: "everything",
  sortBy: "relevance",
  refiners: {},
  startRow: 0,
  pageSize: 10,
};
