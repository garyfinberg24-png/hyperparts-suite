// ============================================================
// HyperNews — Content Source Models (V2: 6 source types)
// ============================================================

/** All source types HyperNews can aggregate from */
export type SourceType =
  | "spNews"
  | "spList"
  | "externalLink"
  | "manual"
  | "rssFeed"
  | "graphRecommended";

/** SP News sub-mode: current site, selected sites, or hub rollup */
export type SpNewsMode = "currentSite" | "selectedSites" | "hubSites";

// ── Per-source interfaces (discriminated union) ──

/** SharePoint News Posts source (Site Pages where PromotedState=2) */
export interface ISpNewsSource {
  id: string;
  type: "spNews";
  /** How to scope the query */
  mode: SpNewsMode;
  /** Site URLs for selectedSites mode */
  siteUrls: string[];
  /** Hub site ID for hubSites mode */
  hubSiteId: string;
  /** Library to query (default: "Site Pages") */
  libraryName: string;
  /** Whether this source is active */
  enabled: boolean;
}

/** SharePoint Custom List source (structured list with column mapping) */
export interface ISpListSource {
  id: string;
  type: "spList";
  /** Site URL (empty = current site) */
  siteUrl: string;
  /** List name or GUID */
  listName: string;
  /** Map list columns to article fields */
  columnMapping: IColumnMapping;
  /** Whether this source is active */
  enabled: boolean;
}

/** Column mapping from SP list fields to article fields */
export interface IColumnMapping {
  titleField: string;
  bodyField: string;
  imageField: string;
  dateField: string;
  authorField: string;
  categoryField: string;
  linkField: string;
}

/** External article link source (scraped metadata stored inline) */
export interface IExternalLinkSource {
  id: string;
  type: "externalLink";
  /** Scraped/curated external articles stored as JSON */
  articlesJson: string;
  /** Whether this source is active */
  enabled: boolean;
}

/** Manual/custom content source (user-authored articles stored inline) */
export interface IManualSource {
  id: string;
  type: "manual";
  /** User-authored articles stored as JSON */
  articlesJson: string;
  /** Whether this source is active */
  enabled: boolean;
}

/** RSS/Atom feed source */
export interface IRssFeedSource {
  id: string;
  type: "rssFeed";
  /** Feed URL */
  feedUrl: string;
  /** Maximum items to fetch per poll */
  maxItems: number;
  /** Polling interval in minutes */
  pollingIntervalMinutes: number;
  /** Whether this source is active */
  enabled: boolean;
}

/** Microsoft Graph recommended/trending content source */
export interface IGraphRecommendedSource {
  id: string;
  type: "graphRecommended";
  /** Insight type to query */
  insightType: "trending" | "used" | "shared";
  /** Maximum items to fetch */
  maxItems: number;
  /** Whether this source is active */
  enabled: boolean;
}

/** Union of all news source types */
export type INewsSource =
  | ISpNewsSource
  | ISpListSource
  | IExternalLinkSource
  | IManualSource
  | IRssFeedSource
  | IGraphRecommendedSource;

// ── Defaults ──

export const DEFAULT_COLUMN_MAPPING: IColumnMapping = {
  titleField: "Title",
  bodyField: "Body",
  imageField: "Image",
  dateField: "Created",
  authorField: "Author",
  categoryField: "Category",
  linkField: "",
};

export const DEFAULT_SP_NEWS_SOURCE: ISpNewsSource = {
  id: "default-sp-news",
  type: "spNews",
  mode: "currentSite",
  siteUrls: [],
  hubSiteId: "",
  libraryName: "Site Pages",
  enabled: true,
};

export const DEFAULT_SP_LIST_SOURCE: ISpListSource = {
  id: "",
  type: "spList",
  siteUrl: "",
  listName: "",
  columnMapping: DEFAULT_COLUMN_MAPPING,
  enabled: true,
};

export const DEFAULT_RSS_SOURCE: IRssFeedSource = {
  id: "",
  type: "rssFeed",
  feedUrl: "",
  maxItems: 20,
  pollingIntervalMinutes: 60,
  enabled: true,
};

export const DEFAULT_GRAPH_SOURCE: IGraphRecommendedSource = {
  id: "",
  type: "graphRecommended",
  insightType: "trending",
  maxItems: 10,
  enabled: true,
};

// ── Serialization helpers ──

/** Unique ID generator for sources */
let _sourceIdCounter = 0;
export function generateSourceId(): string {
  _sourceIdCounter += 1;
  return "src-" + String(new Date().getTime()) + "-" + String(_sourceIdCounter);
}

/** Parse sources JSON string to typed array */
export function parseSources(json: string | undefined): INewsSource[] {
  if (!json) return [];
  try {
    return JSON.parse(json) as INewsSource[];
  } catch (_e) {
    return [];
  }
}

/** Stringify sources array to JSON */
export function stringifySources(sources: INewsSource[]): string {
  return JSON.stringify(sources);
}

/** Human-readable label for a source type */
export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  spNews: "SharePoint News",
  spList: "SharePoint List",
  externalLink: "External Articles",
  manual: "Custom Content",
  rssFeed: "RSS Feed",
  graphRecommended: "Recommended (Graph)",
};

/** Emoji icon for a source type */
export const SOURCE_TYPE_ICONS: Record<SourceType, string> = {
  spNews: "\uD83D\uDCF0",
  spList: "\uD83D\uDCCB",
  externalLink: "\uD83C\uDF10",
  manual: "\u270F\uFE0F",
  rssFeed: "\uD83D\uDCE1",
  graphRecommended: "\u2728",
};
