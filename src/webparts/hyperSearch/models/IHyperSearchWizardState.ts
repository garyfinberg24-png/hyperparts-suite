// ============================================================
// HyperSearch V2 — Wizard State
// ============================================================

import type {
  ResultLayoutMode,
  SearchBarStyle,
  ISearchV2Features,
  ISearchV2Filters,
} from "./IHyperSearchV2";
import {
  DEFAULT_V2_FEATURES,
  DEFAULT_V2_FILTERS,
} from "./IHyperSearchV2";
import type { SearchScopeType } from "./ISearchQuery";
import type { IPromotedResult } from "./IPromotedResult";

/** Wizard path selection */
export type SearchWizardPath =
  | "template"
  | "scratch"
  | "import";

/** Full wizard state used by the HyperWizard generic component */
export interface ISearchWizardState {
  /** Setup path chosen by user */
  path: SearchWizardPath;
  /** Selected template ID */
  selectedTemplate: string;
  /** Active search scopes */
  activeScopes: SearchScopeType[];
  /** Show scope tabs above results */
  showScopeTabs: boolean;
  /** Default to "Everything" when searching */
  defaultToEverything: boolean;
  /** Remember user's last selected scope */
  rememberLastScope: boolean;
  /** Show result count badges on scope tabs */
  showScopeCounts: boolean;
  /** Selected result layout mode */
  resultLayout: ResultLayoutMode;
  /** Feature flags */
  features: ISearchV2Features;
  /** Filter configuration */
  filters: ISearchV2Filters;
  /** Promoted results */
  promotedResults: IPromotedResult[];
  /** Accent color */
  accentColor: string;
  /** Border radius */
  borderRadius: number;
  /** Search bar visual style */
  searchBarStyle: SearchBarStyle;
  /** Enable demo mode */
  enableDemoMode: boolean;
  /** Results per page */
  resultsPerPage: number;
}

/** Default wizard state */
export var DEFAULT_SEARCH_WIZARD_STATE: ISearchWizardState = {
  path: "template",
  selectedTemplate: "modern-clean",
  activeScopes: ["sharepoint", "onedrive", "teams"],
  showScopeTabs: true,
  defaultToEverything: true,
  rememberLastScope: true,
  showScopeCounts: true,
  resultLayout: "listRich",
  features: {
    instantSearch: DEFAULT_V2_FEATURES.instantSearch,
    smartAutocomplete: DEFAULT_V2_FEATURES.smartAutocomplete,
    searchVerticals: DEFAULT_V2_FEATURES.searchVerticals,
    zeroQuery: DEFAULT_V2_FEATURES.zeroQuery,
    spellingCorrection: DEFAULT_V2_FEATURES.spellingCorrection,
    nlpParsing: DEFAULT_V2_FEATURES.nlpParsing,
    savedSearches: DEFAULT_V2_FEATURES.savedSearches,
    commandPalette: DEFAULT_V2_FEATURES.commandPalette,
    inlinePreview: DEFAULT_V2_FEATURES.inlinePreview,
    peopleCards: DEFAULT_V2_FEATURES.peopleCards,
    quickActions: DEFAULT_V2_FEATURES.quickActions,
    hitHighlight: DEFAULT_V2_FEATURES.hitHighlight,
    resultGrouping: DEFAULT_V2_FEATURES.resultGrouping,
    thumbnailPreviews: DEFAULT_V2_FEATURES.thumbnailPreviews,
  },
  filters: {
    facetedFilters: DEFAULT_V2_FILTERS.facetedFilters,
    dateRange: DEFAULT_V2_FILTERS.dateRange,
    fileType: DEFAULT_V2_FILTERS.fileType,
    authorFilter: DEFAULT_V2_FILTERS.authorFilter,
    siteFilter: DEFAULT_V2_FILTERS.siteFilter,
    sizeFilter: DEFAULT_V2_FILTERS.sizeFilter,
    contentType: DEFAULT_V2_FILTERS.contentType,
    managedMetadata: DEFAULT_V2_FILTERS.managedMetadata,
  },
  promotedResults: [
    {
      id: "demo-1",
      keywords: ["help desk", "IT support", "ticket"],
      title: "IT Help Desk Portal",
      description: "Submit IT support tickets, check status, and browse the knowledge base.",
      url: "https://contoso.sharepoint.com/sites/ITHelpDesk",
      iconName: "Ticket",
      openInNewTab: false,
    },
    {
      id: "demo-2",
      keywords: ["benefits", "insurance", "PTO", "vacation"],
      title: "Employee Benefits Guide 2025",
      description: "Complete guide to health insurance, retirement plans, PTO policies, and more.",
      url: "https://contoso.sharepoint.com/sites/HR/benefits-2025.pdf",
      iconName: "ClipboardList",
      openInNewTab: false,
    },
    {
      id: "demo-3",
      keywords: ["holidays", "days off", "calendar"],
      title: "Company Holiday Calendar",
      description: "Official company holidays and office closures for 2025-2026.",
      url: "https://contoso.sharepoint.com/sites/HR/holiday-calendar",
      iconName: "Calendar",
      openInNewTab: false,
    },
  ],
  accentColor: "#0078d4",
  borderRadius: 8,
  searchBarStyle: "rounded",
  enableDemoMode: true,
  resultsPerPage: 10,
};
