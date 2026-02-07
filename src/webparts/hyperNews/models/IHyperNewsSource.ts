/** Types of news sources HyperNews can aggregate from */
export type SourceType = "currentSite" | "selectedSites" | "hubSites" | "recommended";

/** A single news source configuration */
export interface INewsSource {
  id: string;
  type: SourceType;
  /** Site URLs for selectedSites type */
  siteUrls?: string[];
  /** Hub site ID for hubSites type */
  hubSiteId?: string;
  /** Library to query (default: "Site Pages") */
  libraryName?: string;
}

export const DEFAULT_NEWS_SOURCE: INewsSource = {
  id: "default-current-site",
  type: "currentSite",
  libraryName: "Site Pages",
};
