import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  addMonths,
} from "date-fns";

/**
 * Parse "MM-DD" string to month (0-indexed) and day.
 */
export function parseMmDd(mmdd: string): { month: number; day: number } | undefined {
  if (!mmdd || mmdd.indexOf("-") === -1) return undefined;
  const parts = mmdd.split("-");
  const month = parseInt(parts[0], 10) - 1; // 0-indexed
  const day = parseInt(parts[1], 10);
  if (isNaN(month) || isNaN(day)) return undefined;
  return { month: month, day: day };
}

/**
 * Get the next occurrence of a MM-DD date from today.
 * Returns a Date object for the next upcoming occurrence.
 */
export function getNextOccurrence(mmdd: string): Date | undefined {
  const parsed = parseMmDd(mmdd);
  if (!parsed) return undefined;

  const now = new Date();
  const thisYear = now.getFullYear();

  // Try this year first
  const thisYearDate = new Date(thisYear, parsed.month, parsed.day);
  if (thisYearDate >= now || isSameDay(thisYearDate, now)) {
    return thisYearDate;
  }

  // Otherwise next year
  return new Date(thisYear + 1, parsed.month, parsed.day);
}

/**
 * Check if a MM-DD date is today.
 */
export function isToday(mmdd: string): boolean {
  const parsed = parseMmDd(mmdd);
  if (!parsed) return false;

  const now = new Date();
  return now.getMonth() === parsed.month && now.getDate() === parsed.day;
}

/**
 * Check if a MM-DD date falls within this week.
 */
export function isThisWeek(mmdd: string): boolean {
  const next = getNextOccurrence(mmdd);
  if (!next) return false;

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 0 });

  return isWithinInterval(next, { start: weekStart, end: weekEnd });
}

/**
 * Check if a MM-DD date falls within this month.
 */
export function isThisMonth(mmdd: string): boolean {
  const parsed = parseMmDd(mmdd);
  if (!parsed) return false;

  const now = new Date();
  return now.getMonth() === parsed.month;
}

/**
 * Check if a MM-DD date falls within this quarter (3 months from now).
 */
export function isThisQuarter(mmdd: string): boolean {
  const next = getNextOccurrence(mmdd);
  if (!next) return false;

  const now = new Date();
  const quarterEnd = addMonths(now, 3);

  return isWithinInterval(next, { start: now, end: quarterEnd });
}

/**
 * Check if a MM-DD date falls in a given month (0-indexed).
 */
export function isInMonth(mmdd: string, month: number): boolean {
  const parsed = parseMmDd(mmdd);
  if (!parsed) return false;
  return parsed.month === month;
}

/**
 * Get the day number from a MM-DD string.
 */
export function getDayOfMonth(mmdd: string): number {
  const parsed = parseMmDd(mmdd);
  if (!parsed) return 0;
  return parsed.day;
}

/**
 * Check if two dates are the same day.
 */
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Get start and end of a month for calendar grid purposes.
 */
export function getMonthBounds(year: number, month: number): { start: Date; end: Date } {
  const monthDate = new Date(year, month, 1);
  return {
    start: startOfMonth(monthDate),
    end: endOfMonth(monthDate),
  };
}
