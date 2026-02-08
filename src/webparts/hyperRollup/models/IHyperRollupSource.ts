/** Source type for content rollup */
export type RollupSourceType = "currentSite" | "specificSite" | "hubSite" | "searchScope";

/** Search scope for searchScope source type */
export type SearchScopeType = "allSites" | "hubSites" | "currentSiteCollection";

/** Defines a single data source for the rollup */
export interface IHyperRollupSource {
  /** Unique identifier for this source */
  id: string;
  /** Source type determines how content is fetched */
  type: RollupSourceType;
  /** Site URL — required for specificSite */
  siteUrl?: string;
  /** List name — required for currentSite and specificSite */
  listName?: string;
  /** Search scope — required for searchScope type */
  scope?: SearchScopeType;
  /** Filter by content type name */
  contentType?: string;
  /** Whether this source is active */
  enabled: boolean;
}

/** Default source: current site, Site Pages library */
export const DEFAULT_SOURCE: IHyperRollupSource = {
  id: "default",
  type: "currentSite",
  listName: "Documents",
  enabled: true,
};

/**
 * Parse sources from JSON string stored in web part properties.
 * Returns default source array if parsing fails.
 */
export function parseSources(json: string | undefined): IHyperRollupSource[] {
  if (!json) return [DEFAULT_SOURCE];
  try {
    const parsed = JSON.parse(json) as IHyperRollupSource[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [DEFAULT_SOURCE];
  } catch {
    return [DEFAULT_SOURCE];
  }
}
