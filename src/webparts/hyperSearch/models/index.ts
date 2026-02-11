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

// V2 Models
export type {
  ResultLayoutMode,
  SearchBarStyle,
  PersonPhotoShape,
  SearchTemplateCategory,
  ISearchTemplate,
  ISearchV2Features,
  ISearchV2Filters,
  ISearchV2Config,
} from "./IHyperSearchV2";

export {
  DEFAULT_V2_FEATURES,
  DEFAULT_V2_FILTERS,
  DEFAULT_V2_CONFIG,
} from "./IHyperSearchV2";

export type {
  SearchWizardPath,
  ISearchWizardState,
} from "./IHyperSearchWizardState";

export { DEFAULT_SEARCH_WIZARD_STATE } from "./IHyperSearchWizardState";
