import type { TickerRecurPattern } from "../models";

/**
 * Check if the current day matches a recurrence pattern.
 */
export function matchesRecurPattern(pattern: TickerRecurPattern, now: Date): boolean {
  if (pattern === "none" || pattern === "daily") {
    return true;
  }
  const dayOfWeek = now.getDay(); // 0=Sunday, 6=Saturday
  if (pattern === "weekdays") {
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }
  if (pattern === "weekly") {
    // Weekly items are shown on the same day of week they were created
    // Since we can't know the original day, treat weekly as always active
    return true;
  }
  return true;
}

/**
 * Check if a ticker item is within its scheduled active window.
 * - startsAt: ISO date string — item becomes visible after this date (empty = immediately)
 * - expiresAt: ISO date string — item expires after this date (empty = never)
 * - recurPattern: recurrence filter for day-of-week
 */
export function isItemScheduledNow(
  startsAt: string,
  expiresAt: string,
  recurPattern: TickerRecurPattern
): boolean {
  const now = new Date();
  const nowMs = now.getTime();

  // Check start date
  if (startsAt) {
    const startMs = new Date(startsAt).getTime();
    if (isNaN(startMs) || nowMs < startMs) {
      return false;
    }
  }

  // Check expiry date
  if (expiresAt) {
    const expiryMs = new Date(expiresAt).getTime();
    if (!isNaN(expiryMs) && nowMs > expiryMs) {
      return false;
    }
  }

  // Check recurrence pattern
  if (!matchesRecurPattern(recurPattern, now)) {
    return false;
  }

  return true;
}

/**
 * Check if a time is within an active window defined by start/end hours.
 * Used for "active hours" scheduling (e.g., only show during business hours).
 */
export function isWithinActiveWindow(
  startHour: number,
  endHour: number,
  now: Date
): boolean {
  if (startHour === 0 && endHour === 0) {
    return true; // No restriction
  }
  const currentHour = now.getHours();
  if (startHour <= endHour) {
    return currentHour >= startHour && currentHour < endHour;
  }
  // Wraps midnight (e.g., 22:00 to 06:00)
  return currentHour >= startHour || currentHour < endHour;
}
