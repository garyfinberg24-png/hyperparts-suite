import type { ISearchQuery, SearchScopeType } from "../models";
import { getContext } from "../../../common/services/HyperPnP";

/**
 * Managed properties to select from SharePoint Search results.
 * Extends HyperRollup's set with HitHighlightedSummary, SiteName, etc.
 */
export const SEARCH_SELECT_PROPERTIES: string[] = [
  "Title",
  "Description",
  "HitHighlightedSummary",
  "Author",
  "AuthorOWSUSER",
  "Created",
  "LastModifiedTime",
  "Path",
  "FileType",
  "ContentType",
  "SPSiteURL",
  "SPWebUrl",
  "SiteName",
  "ListID",
  "ListItemID",
  "UniqueID",
  "PictureThumbnailURL",
  "ServerRedirectedURL",
  "IsDocument",
  "FileExtension",
  "contentclass",
];

/**
 * Default refiner fields requested from SharePoint Search.
 */
export const DEFAULT_REFINER_FIELDS: string[] = [
  "FileType",
  "Author",
  "ContentType",
];

/**
 * Builds scope constraint KQL for SharePoint Search.
 */
function buildScopeKql(scope: SearchScopeType): string {
  switch (scope) {
    case "currentSite": {
      const siteUrl = getContext().pageContext.site.absoluteUrl;
      return "Path:\"" + siteUrl + "\"";
    }
    case "sharepoint":
      return "contentclass:STS_*";
    case "onedrive":
      return "Path:\"*/personal/*\" IsDocument:1";
    // teams and exchange are handled via Graph Search, not SP Search
    case "teams":
    case "exchange":
      return "";
    case "everything":
    default:
      return "";
  }
}

/**
 * Builds refiner filter KQL from active refiner selections.
 * Each refiner field uses OR within, AND across fields.
 */
function buildRefinerFilterKql(refiners: Record<string, string[]>): string {
  const parts: string[] = [];

  Object.keys(refiners).forEach(function (fieldName) {
    const values = refiners[fieldName];
    if (values && values.length > 0) {
      if (values.length === 1) {
        parts.push(fieldName + ":\"" + values[0] + "\"");
      } else {
        // OR within a refiner field
        const orParts: string[] = [];
        values.forEach(function (val) {
          orParts.push(fieldName + ":\"" + val + "\"");
        });
        parts.push("(" + orParts.join(" OR ") + ")");
      }
    }
  });

  return parts.join(" AND ");
}

/**
 * Builds the full KQL query string for SharePoint Search from an ISearchQuery.
 */
export function buildSearchKql(query: ISearchQuery): string {
  const parts: string[] = [];

  // User's query text (default to "*" if empty)
  const text = query.queryText.trim();
  if (text) {
    parts.push(text);
  } else {
    parts.push("*");
  }

  // Scope constraint
  const scopeKql = buildScopeKql(query.scope);
  if (scopeKql) {
    parts.push(scopeKql);
  }

  // Active refiner filters
  const refinerKql = buildRefinerFilterKql(query.refiners);
  if (refinerKql) {
    parts.push(refinerKql);
  }

  return parts.join(" AND ");
}

/**
 * Returns the SP Search SortList based on the query's sortBy option.
 * Direction: 0 = ascending, 1 = descending.
 */
export function buildSortList(query: ISearchQuery): Array<{ Property: string; Direction: number }> {
  switch (query.sortBy) {
    case "dateModified":
      return [{ Property: "LastModifiedTime", Direction: 1 }];
    case "author":
      return [{ Property: "Author", Direction: 0 }];
    case "relevance":
    default:
      // Empty array = relevance sort (default)
      return [];
  }
}

/**
 * Parses refiner fields from a JSON string.
 * Returns default refiner fields if parsing fails.
 */
export function parseRefinerFields(json: string): string[] {
  if (!json) return DEFAULT_REFINER_FIELDS;
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed as string[] : DEFAULT_REFINER_FIELDS;
  } catch {
    return DEFAULT_REFINER_FIELDS;
  }
}

/**
 * Determines whether a scope should use Graph Search API (true)
 * or SharePoint Search API (false).
 */
export function isGraphScope(scope: SearchScopeType): boolean {
  return scope === "teams" || scope === "exchange";
}
