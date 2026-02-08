/** SP list data source for alert monitoring */
export interface ISpListAlertSource {
  /** Discriminator */
  type: "spList";
  /** SP list title */
  listName: string;
  /** Site URL (empty = current site) */
  siteUrl: string;
  /** Fields to select from the list */
  selectFields: string[];
  /** Optional OData filter expression */
  filterExpression: string;
  /** Max items to fetch */
  top: number;
}

/** Graph API data source for alert monitoring */
export interface IGraphAlertSource {
  /** Discriminator */
  type: "graphApi";
  /** Graph API endpoint path (e.g., "/me/presence", "/me/calendar/events") */
  endpoint: string;
  /** Fields/properties to select */
  selectFields: string[];
}

/** Union type for all alert data sources */
export type IAlertDataSource = ISpListAlertSource | IGraphAlertSource;

/** Default SP list source */
export const DEFAULT_SP_SOURCE: ISpListAlertSource = {
  type: "spList",
  listName: "",
  siteUrl: "",
  selectFields: ["Title"],
  filterExpression: "",
  top: 500,
};

/** Default Graph API source */
export const DEFAULT_GRAPH_SOURCE: IGraphAlertSource = {
  type: "graphApi",
  endpoint: "",
  selectFields: [],
};

/** Parse data source from JSON string */
export function parseDataSource(json: string | undefined): IAlertDataSource {
  if (!json) return DEFAULT_SP_SOURCE;
  try {
    const parsed = JSON.parse(json) as IAlertDataSource;
    if (parsed && parsed.type) return parsed;
    return DEFAULT_SP_SOURCE;
  } catch {
    return DEFAULT_SP_SOURCE;
  }
}

/** Stringify data source to JSON for storage */
export function stringifyDataSource(source: IAlertDataSource): string {
  return JSON.stringify(source);
}
