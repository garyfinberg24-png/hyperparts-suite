// ============================================================
// HyperSearch V2 — Extended Models
// ============================================================

import type { SearchScopeType } from "./ISearchQuery";

// ── Result Layout Modes ──

/** Display layout modes for search results */
export type ResultLayoutMode =
  | "listRich"
  | "listCompact"
  | "cardGrid"
  | "magazine"
  | "table"
  | "peopleGrid"
  | "mediaGallery"
  | "conversation"
  | "timeline"
  | "previewPanel";

/** Search bar visual style */
export type SearchBarStyle =
  | "rounded"
  | "square"
  | "pill"
  | "underline";

/** Photo shape for people results */
export type PersonPhotoShape =
  | "circle"
  | "rounded"
  | "square";

// ── Search Template Definitions ──

/** Search template category */
export type SearchTemplateCategory =
  | "classic"
  | "modern"
  | "creative";

/** A pre-built search template */
export interface ISearchTemplate {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: SearchTemplateCategory;
  description: string;
  /** Partial property overrides when this template is selected */
  configuration: Partial<ISearchV2Config>;
}

// ── V2 Feature Flags ──

export interface ISearchV2Features {
  /** Results appear as you type, no Enter needed */
  instantSearch: boolean;
  /** AI-powered query suggestions with context */
  smartAutocomplete: boolean;
  /** Tab-based scope switching above results */
  searchVerticals: boolean;
  /** Show trending/recent content before any search */
  zeroQuery: boolean;
  /** Auto-correct typos and suggest alternatives */
  spellingCorrection: boolean;
  /** Natural language understanding */
  nlpParsing: boolean;
  /** Let users save and reuse frequent queries */
  savedSearches: boolean;
  /** Cmd+K keyboard shortcut to invoke search */
  commandPalette: boolean;
  /** Hover to preview documents without opening */
  inlinePreview: boolean;
  /** Rich profile cards on hover for person results */
  peopleCards: boolean;
  /** Email, Chat, Copy Link buttons on each result */
  quickActions: boolean;
  /** Bold matching terms in result snippets */
  hitHighlight: boolean;
  /** Group results by site, type, or date */
  resultGrouping: boolean;
  /** Show document thumbnails and page previews */
  thumbnailPreviews: boolean;
}

/** V2 filter configuration */
export interface ISearchV2Filters {
  /** Dynamic filter chips based on result metadata */
  facetedFilters: boolean;
  /** Filter by date modified, created, or custom range */
  dateRange: boolean;
  /** Filter by document type (Word, Excel, PDF...) */
  fileType: boolean;
  /** Filter by content author or mentioned people */
  authorFilter: boolean;
  /** Filter results by SharePoint site or source */
  siteFilter: boolean;
  /** Filter by file size range */
  sizeFilter: boolean;
  /** Filter by SharePoint content types */
  contentType: boolean;
  /** Filter by term store / taxonomy values */
  managedMetadata: boolean;
}

/** Complete V2 configuration (stored in web part properties) */
export interface ISearchV2Config {
  /** Result display layout */
  resultLayout: ResultLayoutMode;
  /** Search bar visual style */
  searchBarStyle: SearchBarStyle;
  /** Accent color for the search experience */
  accentColor: string;
  /** Border radius for UI elements */
  borderRadius: number;
  /** Active search scopes */
  activeScopes: SearchScopeType[];
  /** Show scope tabs above results */
  showScopeTabs: boolean;
  /** Results per page */
  resultsPerPage: number;
  /** Feature flags */
  features: ISearchV2Features;
  /** Filter configuration */
  filters: ISearchV2Filters;
  /** Enable demo mode with sample data */
  enableDemoMode: boolean;
  /** Selected template ID */
  selectedTemplate: string;
}

// ── Default Values ──

export var DEFAULT_V2_FEATURES: ISearchV2Features = {
  instantSearch: true,
  smartAutocomplete: true,
  searchVerticals: true,
  zeroQuery: true,
  spellingCorrection: true,
  nlpParsing: false,
  savedSearches: true,
  commandPalette: false,
  inlinePreview: true,
  peopleCards: true,
  quickActions: true,
  hitHighlight: true,
  resultGrouping: true,
  thumbnailPreviews: true,
};

export var DEFAULT_V2_FILTERS: ISearchV2Filters = {
  facetedFilters: true,
  dateRange: true,
  fileType: true,
  authorFilter: true,
  siteFilter: true,
  sizeFilter: false,
  contentType: false,
  managedMetadata: false,
};

export var DEFAULT_V2_CONFIG: ISearchV2Config = {
  resultLayout: "listRich",
  searchBarStyle: "rounded",
  accentColor: "#0078d4",
  borderRadius: 8,
  activeScopes: ["sharepoint", "onedrive", "teams"],
  showScopeTabs: true,
  resultsPerPage: 10,
  features: DEFAULT_V2_FEATURES,
  filters: DEFAULT_V2_FILTERS,
  enableDemoMode: true,
  selectedTemplate: "modern-clean",
};
