import { hyperAnalytics } from "../../../common/services/HyperAnalytics";

const WEB_PART_ID: string = "HyperSearch";

/**
 * Tracks a search query execution.
 */
export function trackSearch(queryText: string, scope: string, resultCount: number): void {
  hyperAnalytics.trackEvent(WEB_PART_ID, "Query", {
    queryText: queryText,
    scope: scope,
    resultCount: resultCount,
  });
}

/**
 * Tracks a result click.
 */
export function trackResultClick(queryText: string, resultUrl: string, resultRank: number): void {
  hyperAnalytics.trackEvent(WEB_PART_ID, "ResultClick", {
    queryText: queryText,
    resultUrl: resultUrl,
    resultRank: resultRank,
  });
}

/**
 * Tracks a zero-result search.
 */
export function trackZeroResults(queryText: string, scope: string): void {
  hyperAnalytics.trackEvent(WEB_PART_ID, "ZeroResults", {
    queryText: queryText,
    scope: scope,
  });
}

/**
 * Tracks a document preview open.
 */
export function trackPreviewOpen(queryText: string, resultUrl: string): void {
  hyperAnalytics.trackEvent(WEB_PART_ID, "PreviewOpen", {
    queryText: queryText,
    resultUrl: resultUrl,
  });
}
