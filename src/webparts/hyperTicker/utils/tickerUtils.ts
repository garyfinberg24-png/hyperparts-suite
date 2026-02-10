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
    // V2 fields
    messageType: listItem.MessageType || undefined,
    description: listItem.Description ? String(listItem.Description) : undefined,
    startsAt: listItem.StartsAt ? String(listItem.StartsAt) : undefined,
    recurPattern: listItem.RecurPattern || undefined,
    category: listItem.Category ? String(listItem.Category) : undefined,
    templateId: listItem.TemplateId ? String(listItem.TemplateId) : undefined,
    acknowledged: listItem.Acknowledged === true,
    dismissed: listItem.Dismissed === true,
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

// ── V2 mapping functions ──

/**
 * Map a Microsoft Graph API response item to a ticker item.
 * Works with list items from Graph (sites/{id}/lists/{id}/items).
 */
export function mapGraphItemToTickerItem(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  graphItem: Record<string, any>
): ITickerItem {
  const fields = graphItem.fields || graphItem;
  return {
    id: "graph-" + String(graphItem.id || fields.id || Date.now().toString(36)),
    title: String(fields.Title || fields.title || fields.displayName || ""),
    url: String(fields.Url || fields.URL || fields.url || ""),
    iconName: String(fields.IconName || fields.Icon || "Info"),
    severity: (fields.Severity as TickerSeverity) || "normal",
    dataSource: "graph",
    expiresAt: String(fields.ExpiresAt || fields.Expires || ""),
    audienceGroups: fields.AudienceGroups
      ? String(fields.AudienceGroups).split(",").map(function (g) { return g.trim(); })
      : [],
    isActive: fields.IsActive !== false,
    sortOrder: Number(fields.SortOrder) || 0,
    messageType: fields.MessageType || undefined,
    description: fields.Description ? String(fields.Description) : undefined,
    startsAt: fields.StartsAt ? String(fields.StartsAt) : undefined,
    recurPattern: fields.RecurPattern || undefined,
    category: fields.Category ? String(fields.Category) : undefined,
  };
}

/**
 * Map an external REST API response item to a ticker item.
 * Handles common field naming conventions (camelCase and PascalCase).
 */
export function mapRestApiItemToTickerItem(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiItem: Record<string, any>
): ITickerItem {
  const titleVal = apiItem.title || apiItem.Title || apiItem.name || "";
  const urlVal = apiItem.url || apiItem.Url || apiItem.link || "";
  const descVal = apiItem.description || apiItem.Description || "";
  const startsVal = apiItem.startsAt || apiItem.StartsAt || "";
  const catVal = apiItem.category || apiItem.Category || "";

  return {
    id: "api-" + String(apiItem.id || apiItem.Id || Date.now().toString(36)),
    title: String(titleVal),
    url: String(urlVal),
    iconName: String(apiItem.iconName || apiItem.IconName || apiItem.icon || "Info"),
    severity: (apiItem.severity || apiItem.Severity || "normal") as TickerSeverity,
    dataSource: "restApi",
    expiresAt: String(apiItem.expiresAt || apiItem.ExpiresAt || ""),
    audienceGroups: apiItem.audienceGroups
      ? (Array.isArray(apiItem.audienceGroups)
          ? apiItem.audienceGroups
          : String(apiItem.audienceGroups).split(",").map(function (g: string) { return g.trim(); }))
      : [],
    isActive: apiItem.isActive !== false && apiItem.IsActive !== false,
    sortOrder: Number(apiItem.sortOrder || apiItem.SortOrder) || 0,
    messageType: apiItem.messageType || apiItem.MessageType || undefined,
    description: descVal ? String(descVal) : undefined,
    startsAt: startsVal ? String(startsVal) : undefined,
    recurPattern: apiItem.recurPattern || apiItem.RecurPattern || undefined,
    category: catVal ? String(catVal) : undefined,
  };
}

/**
 * Filter out dismissed items by ID.
 */
export function filterDismissed(items: ITickerItem[], dismissedIds: string[]): ITickerItem[] {
  if (dismissedIds.length === 0) return items;
  const result: ITickerItem[] = [];
  items.forEach(function (item) {
    if (dismissedIds.indexOf(item.id) === -1) {
      result.push(item);
    }
  });
  return result;
}
