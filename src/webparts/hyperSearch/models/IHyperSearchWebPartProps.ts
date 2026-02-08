import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { SearchScopeType, SearchSortBy } from "./ISearchQuery";

/** Web part property bag for HyperSearch */
export interface IHyperSearchWebPartProps extends IBaseHyperWebPartProps {
  /** Display title */
  title: string;
  /** Placeholder text in search box */
  placeholderText: string;
  /** Show scope selector dropdown */
  showScopeSelector: boolean;
  /** Default search scope */
  defaultScope: SearchScopeType;
  /** Default sort order */
  defaultSortBy: SearchSortBy;
  /** Results per page (5-50) */
  resultsPerPage: number;
  /** Enable type-ahead suggestions */
  enableTypeAhead: boolean;
  /** Type-ahead debounce in ms (100-1000) */
  typeAheadDebounce: number;
  /** Enable refiner panel */
  enableRefiners: boolean;
  /** Refiner managed property names (JSON array) */
  refinerFields: string;
  /** Enable search history */
  enableSearchHistory: boolean;
  /** Promoted results configuration (JSON array of IPromotedResult) */
  promotedResults: string;
  /** Enable analytics tracking */
  enableAnalytics: boolean;
  /** Enable document preview panel */
  enableResultPreviews: boolean;
  /** Show result type icon */
  showResultIcon: boolean;
  /** Show result path breadcrumb */
  showResultPath: boolean;
}
