export type {
  SearchResultType,
  SearchSource,
  IHyperSearchResult,
} from "./IHyperSearchResult";

export type {
  SearchScopeType,
  SearchSortBy,
  ISearchQuery,
} from "./ISearchQuery";

export { DEFAULT_QUERY } from "./ISearchQuery";

export type { ISearchSuggestion } from "./ISearchSuggestion";

export type { IPromotedResult } from "./IPromotedResult";
export { parsePromotedResults, stringifyPromotedResults } from "./IPromotedResult";

export type { ISearchHistoryEntry } from "./ISearchHistory";
export { MAX_HISTORY_ENTRIES } from "./ISearchHistory";

export type {
  IRefinerValue,
  ISearchRefiner,
} from "./ISearchRefiner";

export type { IHyperSearchWebPartProps } from "./IHyperSearchWebPartProps";
