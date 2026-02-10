import { hyperAnalytics } from "../../../common/services/HyperAnalytics";
import type { IHyperRollupItem, ViewMode } from "../models";

/**
 * Analytics tracking for HyperRollup.
 * Pattern adapted from HyperLinks analyticsTracker.
 */

/** Track when user changes the active view mode */
export function trackViewModeChange(webPartId: string, mode: ViewMode): void {
  hyperAnalytics.trackEvent(webPartId, "rollupViewModeChange", {
    viewMode: mode,
  });
}

/** Track when user clicks/selects an item */
export function trackItemClick(webPartId: string, item: IHyperRollupItem): void {
  hyperAnalytics.trackEvent(webPartId, "rollupItemClick", {
    itemId: item.id,
    itemTitle: item.title,
    sourceListName: item.sourceListName,
    sourceSiteName: item.sourceSiteName,
    fileType: item.fileType || "",
  });
}

/** Track when user opens document preview */
export function trackPreview(webPartId: string, item: IHyperRollupItem): void {
  hyperAnalytics.trackEvent(webPartId, "rollupPreview", {
    itemId: item.id,
    itemTitle: item.title,
    fileType: item.fileType || "",
  });
}

/** Track CSV export */
export function trackExport(webPartId: string, itemCount: number): void {
  hyperAnalytics.trackEvent(webPartId, "rollupExport", {
    itemCount: String(itemCount),
  });
}

/** Track search query */
export function trackSearch(webPartId: string, query: string, resultCount: number): void {
  hyperAnalytics.trackEvent(webPartId, "rollupSearch", {
    query: query,
    resultCount: String(resultCount),
  });
}
