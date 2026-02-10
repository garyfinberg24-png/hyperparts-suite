import { hyperAnalytics } from "../../../common/services/HyperAnalytics";
import type { ITickerItem } from "../models";

/**
 * Track a ticker item click event.
 */
export function trackTickerClick(webPartId: string, item: ITickerItem): void {
  hyperAnalytics.trackEvent(webPartId, "tickerClick", {
    itemId: item.id,
    itemTitle: item.title,
    itemUrl: item.url || "",
    severity: item.severity,
    messageType: item.messageType || "news",
    dataSource: item.dataSource,
  });
}

/**
 * Track a ticker item dismiss event.
 */
export function trackTickerDismiss(webPartId: string, item: ITickerItem): void {
  hyperAnalytics.trackEvent(webPartId, "tickerDismiss", {
    itemId: item.id,
    itemTitle: item.title,
    severity: item.severity,
    messageType: item.messageType || "news",
  });
}

/**
 * Track a ticker item acknowledge event (for critical/emergency items).
 */
export function trackTickerAcknowledge(webPartId: string, item: ITickerItem): void {
  hyperAnalytics.trackEvent(webPartId, "tickerAcknowledge", {
    itemId: item.id,
    itemTitle: item.title,
    severity: item.severity,
    messageType: item.messageType || "news",
  });
}

/**
 * Track ticker view time (how long items were visible).
 */
export function trackTickerViewTime(webPartId: string, durationMs: number, itemCount: number): void {
  hyperAnalytics.trackEvent(webPartId, "tickerViewTime", {
    durationMs: durationMs,
    itemCount: itemCount,
  });
}
