import type { TickerSeverity, TickerDataSource } from "./IHyperTickerEnums";

export interface ITickerItem {
  id: string;
  title: string;
  url: string;
  iconName: string;
  severity: TickerSeverity;
  dataSource: TickerDataSource;
  expiresAt: string; // ISO 8601 or empty string for never
  audienceGroups: string[]; // AD group names, empty = everyone
  isActive: boolean;
  sortOrder: number;
}

export const DEFAULT_TICKER_ITEM: ITickerItem = {
  id: "",
  title: "",
  url: "",
  iconName: "Info",
  severity: "normal",
  dataSource: "manual",
  expiresAt: "",
  audienceGroups: [],
  isActive: true,
  sortOrder: 0,
};

let tickerItemCounter = 0;

export function generateTickerItemId(): string {
  tickerItemCounter++;
  return "ticker-" + Date.now().toString(36) + "-" + tickerItemCounter.toString(36);
}

export function parseTickerItems(json: string): ITickerItem[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return parsed as ITickerItem[];
    return [];
  } catch {
    return [];
  }
}

export function stringifyTickerItems(items: ITickerItem[]): string {
  return JSON.stringify(items);
}
