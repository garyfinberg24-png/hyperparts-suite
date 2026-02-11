import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { SearchScopeType, SearchSortBy } from "./ISearchQuery";
import type { ResultLayoutMode, SearchBarStyle } from "./IHyperSearchV2";

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

  // ── V2 Properties ──

  /** Selected search template ID */
  selectedTemplate: string;
  /** Result display layout mode */
  resultLayout: ResultLayoutMode;
  /** Search bar visual style */
  searchBarStyle: SearchBarStyle;
  /** Accent color for search experience */
  accentColor: string;
  /** Border radius for UI elements */
  borderRadius: number;
  /** Active search scopes (JSON array of SearchScopeType) */
  activeScopes: string;
  /** Show scope tabs above results */
  showScopeTabs: boolean;
  /** Enable demo mode with sample data */
  enableDemoMode: boolean;
  /** Whether wizard has been completed */
  wizardCompleted: boolean;
  /** Show wizard on first init */
  showWizardOnInit: boolean;

  // ── V2 Feature Flags (JSON string of ISearchV2Features) ──
  v2Features: string;
  // ── V2 Filter Config (JSON string of ISearchV2Filters) ──
  v2Filters: string;

  // ── V2 Individual Feature Toggles ──
  /** Instant search (results as-you-type) */
  enableInstantSearch: boolean;
  /** Show search verticals / scope tabs */
  enableSearchVerticals: boolean;
  /** Show zero-query experience (trending, recent) */
  enableZeroQuery: boolean;
  /** Quick actions on results (Email, Chat, Copy) */
  enableQuickActions: boolean;
  /** Hit highlighting in result snippets */
  enableHitHighlight: boolean;
  /** Result grouping by site/type/date */
  enableResultGrouping: boolean;
  /** Thumbnail previews on results */
  enableThumbnailPreviews: boolean;
  /** Saved searches feature */
  enableSavedSearches: boolean;
  /** People cards on hover */
  enablePeopleCards: boolean;
  /** Spelling correction */
  enableSpellingCorrection: boolean;
}
