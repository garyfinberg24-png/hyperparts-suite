/** Result type categories returned by search */
export type SearchResultType =
  | "document"
  | "page"
  | "person"
  | "message"
  | "site"
  | "listItem"
  | "unknown";

/** Source system the result originated from */
export type SearchSource =
  | "sharepoint"
  | "onedrive"
  | "teams"
  | "exchange";

/** A single search result from any source */
export interface IHyperSearchResult {
  /** Unique identifier (Path or Graph resource ID) */
  id: string;
  /** Result title */
  title: string;
  /** Description or summary snippet */
  description?: string;
  /** Full URL to the result */
  url: string;
  /** Author display name */
  author?: string;
  /** Author email address */
  authorEmail?: string;
  /** Last modified date (ISO 8601) */
  modified?: string;
  /** Created date (ISO 8601) */
  created?: string;
  /** File extension (e.g. "docx", "pdf") */
  fileType?: string;
  /** Icon URL from search */
  iconUrl?: string;
  /** Thumbnail URL if available */
  thumbnailUrl?: string;
  /** Classified result type */
  resultType: SearchResultType;
  /** Source system */
  source: SearchSource;
  /** Site or team name */
  siteName?: string;
  /** Breadcrumb-style path */
  path?: string;
  /** Hit-highlighted summary from search engine */
  hitHighlightedSummary?: string;
  /** Relevance rank from search engine */
  rank?: number;
  /** Raw fields record for extensibility */
  fields: Record<string, unknown>;
}
