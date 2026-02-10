// HyperTicker V2 — Schedule system for ticker items
// Supports start/end dates and recurrence patterns

export type TickerRecurPattern = "none" | "daily" | "weekdays" | "weekly";

export const ALL_RECUR_PATTERNS: TickerRecurPattern[] = [
  "none", "daily", "weekdays", "weekly",
];

export interface ITickerSchedule {
  /** ISO 8601 date string — when the item becomes visible (empty = immediately) */
  startsAt: string;
  /** ISO 8601 date string — when the item expires (empty = never) */
  expiresAt: string;
  /** Recurrence pattern */
  recurPattern: TickerRecurPattern;
}

export const DEFAULT_TICKER_SCHEDULE: ITickerSchedule = {
  startsAt: "",
  expiresAt: "",
  recurPattern: "none",
};

export function getRecurPatternDisplayName(pattern: TickerRecurPattern): string {
  const map: Record<TickerRecurPattern, string> = {
    none: "No Recurrence",
    daily: "Daily",
    weekdays: "Weekdays Only",
    weekly: "Weekly",
  };
  return map[pattern] || "No Recurrence";
}
