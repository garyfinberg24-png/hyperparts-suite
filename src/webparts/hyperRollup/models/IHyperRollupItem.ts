/** Represents a single item rolled up from any source site/list */
export interface IHyperRollupItem {
  /** Unique composite key: sourceListId + ":" + itemId */
  id: string;
  /** SharePoint list item ID */
  itemId: number;
  /** Item title */
  title: string;
  /** Item description or excerpt */
  description?: string;
  /** Author display name */
  author?: string;
  /** Author email */
  authorEmail?: string;
  /** Last editor display name */
  editor?: string;
  /** Created date (ISO string) */
  created: string;
  /** Modified date (ISO string) */
  modified: string;
  /** Server-relative URL to the item/file */
  fileRef?: string;
  /** File extension (docx, pdf, xlsx, etc.) */
  fileType?: string;
  /** Content type name */
  contentType?: string;
  /** Category or managed metadata value */
  category?: string;
  /** All raw field values from the source */
  fields: Record<string, unknown>;
  /** Absolute URL of the source site */
  sourceSiteUrl: string;
  /** Display name of the source site */
  sourceSiteName: string;
  /** GUID of the source list */
  sourceListId: string;
  /** Display name of the source list */
  sourceListName: string;
  /** true if item came from Search API (read-only for inline edit) */
  isFromSearch: boolean;
}

/** Aggregation function types */
export type AggregationFunction = "sum" | "average" | "count" | "min" | "max";

/** Configuration for a single aggregation field */
export interface IHyperRollupAggregation {
  field: string;
  fn: AggregationFunction;
  label?: string;
}

/** Result of an aggregation computation */
export interface IHyperRollupAggregationResult {
  field: string;
  fn: AggregationFunction;
  label: string;
  value: number;
}

/** Grouped items structure */
export interface IHyperRollupGroup {
  key: string;
  label: string;
  items: IHyperRollupItem[];
  count: number;
}
