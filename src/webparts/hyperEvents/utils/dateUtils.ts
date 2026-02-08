/**
 * Date utilities using date-fns v4.
 */
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  addWeeks,
  addMonths,
  isSameDay as dfnIsSameDay,
  parseISO,
  getDay,
  startOfDay,
  endOfDay,
} from "date-fns";

/** Get all days in a month grid (always 42 cells = 6 rows x 7 cols) */
export function getMonthDays(year: number, month: number): Date[] {
  const d = new Date(year, month, 1);
  const monthStart = startOfMonth(d);
  const monthEnd = endOfMonth(d);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  // Ensure exactly 42 cells (6 rows)
  while (days.length < 42) {
    days.push(addDays(days[days.length - 1], 1));
  }

  return days;
}

/** Get the 7 days of the week containing the given date (Sun-Sat) */
export function getWeekDays(date: Date): Date[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
}

/** Get hour labels for a day view (0-23) */
export function getDayHours(): number[] {
  const result: number[] = [];
  for (let i = 0; i < 24; i++) {
    result.push(i);
  }
  return result;
}

/** Format an event time for display: "3:30 PM" */
export function formatEventTime(isoDate: string): string {
  try {
    const d = parseISO(isoDate);
    if (isNaN(d.getTime())) return "";
    return format(d, "h:mm a");
  } catch {
    return "";
  }
}

/** Check if two dates are the same calendar day */
export function isSameDay(a: Date, b: Date): boolean {
  return dfnIsSameDay(a, b);
}

/** Format "January 2026" label */
export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy");
}

/** Format a date range label based on view mode */
export function formatDateRange(date: Date, viewMode: string): string {
  switch (viewMode) {
    case "month":
      return formatMonthYear(date);
    case "week": {
      const weekDays = getWeekDays(date);
      const wStart = weekDays[0];
      const wEnd = weekDays[6];
      return format(wStart, "MMM d") + " - " + format(wEnd, "MMM d, yyyy");
    }
    case "day":
      return format(date, "EEEE, MMMM d, yyyy");
    default:
      return formatMonthYear(date);
  }
}

/** Get the start of a date range for the current view mode */
export function getViewRangeStart(date: Date, viewMode: string): Date {
  switch (viewMode) {
    case "month":
      return startOfMonth(date);
    case "week":
      return startOfWeek(date, { weekStartsOn: 0 });
    case "day":
      return startOfDay(date);
    default:
      return startOfMonth(date);
  }
}

/** Get the end of a date range for the current view mode */
export function getViewRangeEnd(date: Date, viewMode: string): Date {
  switch (viewMode) {
    case "month":
      return endOfMonth(date);
    case "week":
      return endOfWeek(date, { weekStartsOn: 0 });
    case "day":
      return endOfDay(date);
    default:
      return endOfMonth(date);
  }
}

/** Navigate date forward/backward by the appropriate increment for the view mode */
export function navigateDate(date: Date, direction: 1 | -1, viewMode: string): Date {
  switch (viewMode) {
    case "month":
      return addMonths(date, direction);
    case "week":
    case "timeline":
      return addWeeks(date, direction);
    case "day":
      return addDays(date, direction);
    case "agenda":
    case "cardGrid":
      return addMonths(date, direction);
    default:
      return addMonths(date, direction);
  }
}

/**
 * Compute the top offset (in pixels) for an event in a time grid.
 * Each hour = hourHeight pixels. Events start at midnight (0).
 */
export function getEventTopOffset(isoDate: string, hourHeight: number): number {
  try {
    const d = parseISO(isoDate);
    if (isNaN(d.getTime())) return 0;
    return (d.getHours() + d.getMinutes() / 60) * hourHeight;
  } catch {
    return 0;
  }
}

/**
 * Compute the height (in pixels) for an event block in a time grid.
 */
export function getEventHeight(startIso: string, endIso: string, hourHeight: number): number {
  try {
    const start = parseISO(startIso);
    const end = parseISO(endIso);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return hourHeight;
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.max(durationHours * hourHeight, hourHeight * 0.5);
  } catch {
    return hourHeight;
  }
}

/** Check if an event's date range overlaps a given day */
export function eventOverlapsDay(startIso: string, endIso: string, day: Date): boolean {
  try {
    const evtStart = parseISO(startIso);
    const evtEnd = parseISO(endIso);
    const dayS = startOfDay(day);
    const dayE = endOfDay(day);
    return evtStart.getTime() <= dayE.getTime() && evtEnd.getTime() >= dayS.getTime();
  } catch {
    return false;
  }
}

/** Format hour label: "9 AM", "12 PM" */
export function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour < 12) return String(hour) + " AM";
  if (hour === 12) return "12 PM";
  return String(hour - 12) + " PM";
}

/** Get day of week index (0=Sun) */
export function getDayOfWeek(date: Date): number {
  return getDay(date);
}

/** Check if a date is today */
export function isToday(date: Date): boolean {
  return dfnIsSameDay(date, new Date());
}

/** Check if a date falls within the given month */
export function isInMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month;
}
