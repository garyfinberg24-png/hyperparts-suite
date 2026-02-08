import type { ITickerItem, TickerSeverity } from "../models";

/**
 * Severity sort priority: critical first, then warning, then normal.
 */
const SEVERITY_PRIORITY: Record<TickerSeverity, number> = {
  critical: 0,
  warning: 1,
  normal: 2,
};

/**
 * Sort ticker items by severity (critical first) then sortOrder.
 */
export function sortBySeverity(items: ITickerItem[]): ITickerItem[] {
  const sorted: ITickerItem[] = [];
  items.forEach(function (item) { sorted.push(item); });
  sorted.sort(function (a, b) {
    const sevDiff = SEVERITY_PRIORITY[a.severity] - SEVERITY_PRIORITY[b.severity];
    if (sevDiff !== 0) return sevDiff;
    return a.sortOrder - b.sortOrder;
  });
  return sorted;
}

/**
 * Filter out expired items.
 */
export function filterExpired(items: ITickerItem[]): ITickerItem[] {
  const now = Date.now();
  const result: ITickerItem[] = [];
  items.forEach(function (item) {
    if (!item.expiresAt) {
      result.push(item);
      return;
    }
    const expiryTime = new Date(item.expiresAt).getTime();
    if (expiryTime > now) {
      result.push(item);
    }
  });
  return result;
}

/**
 * Filter to only active items.
 */
export function filterActive(items: ITickerItem[]): ITickerItem[] {
  const result: ITickerItem[] = [];
  items.forEach(function (item) {
    if (item.isActive) result.push(item);
  });
  return result;
}

/**
 * Check if any item has critical severity.
 */
export function hasCriticalItems(items: ITickerItem[]): boolean {
  let found = false;
  items.forEach(function (item) {
    if (item.severity === "critical") found = true;
  });
  return found;
}

/**
 * Filter to only critical items (for priority override mode).
 */
export function getCriticalItems(items: ITickerItem[]): ITickerItem[] {
  const result: ITickerItem[] = [];
  items.forEach(function (item) {
    if (item.severity === "critical") result.push(item);
  });
  return result;
}

/**
 * Map a SharePoint list item to a ticker item.
 */
export function mapListItemToTickerItem(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listItem: Record<string, any>,
  defaultSeverity: TickerSeverity
): ITickerItem {
  return {
    id: "list-" + String(listItem.Id || ""),
    title: String(listItem.Title || ""),
    url: String(listItem.Url || listItem.URL || ""),
    iconName: String(listItem.IconName || listItem.Icon || "Info"),
    severity: (listItem.Severity as TickerSeverity) || defaultSeverity,
    dataSource: "spList",
    expiresAt: String(listItem.ExpiresAt || listItem.Expires || ""),
    audienceGroups: listItem.AudienceGroups
      ? String(listItem.AudienceGroups).split(",").map(function (g) { return g.trim(); })
      : [],
    isActive: listItem.IsActive !== false,
    sortOrder: Number(listItem.SortOrder) || 0,
  };
}

/**
 * Parse an RSS feed XML string and return ticker items.
 */
export function parseRssFeed(
  xmlString: string,
  maxItems: number,
  prefixIcon: string,
  defaultSeverity: TickerSeverity
): ITickerItem[] {
  const items: ITickerItem[] = [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "text/xml");
    const rssItems = doc.querySelectorAll("item");
    let count = 0;

    // querySelectorAll returns NodeList — use indexed for loop (ES5 safe)
    for (let i = 0; i < rssItems.length && count < maxItems; i++) {
      const rssItem = rssItems[i];
      const titleEl = rssItem.querySelector("title");
      const linkEl = rssItem.querySelector("link");

      const title = titleEl ? titleEl.textContent || "" : "";
      const url = linkEl ? linkEl.textContent || "" : "";

      if (title) {
        items.push({
          id: "rss-" + Date.now().toString(36) + "-" + count.toString(36),
          title: title,
          url: url,
          iconName: prefixIcon || "Globe",
          severity: defaultSeverity,
          dataSource: "rss",
          expiresAt: "",
          audienceGroups: [],
          isActive: true,
          sortOrder: count,
        });
        count++;
      }
    }
  } catch {
    // Failed to parse RSS — return empty
  }
  return items;
}
