import type { IHyperRollupItem } from "../models";

var MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

var DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Get a date from an item's configured field, falling back to modified/created.
 */
export function getItemDateField(item: IHyperRollupItem, dateField: string): Date {
  var val: unknown = undefined;
  if (dateField && item.fields && item.fields[dateField] !== undefined) {
    val = item.fields[dateField];
  }
  if (val === undefined) {
    val = item.modified || item.created;
  }
  return new Date(String(val));
}

/**
 * Generate a 6x7 (42 cell) grid for a given month.
 * Each cell has { day, isCurrentMonth }.
 */
export function getMonthDays(year: number, month: number): Array<{ day: number; isCurrentMonth: boolean }> {
  var grid: Array<{ day: number; isCurrentMonth: boolean }> = [];
  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var prevMonthDays = new Date(year, month, 0).getDate();

  // Previous month padding
  for (var i = firstDay - 1; i >= 0; i--) {
    grid.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }

  // Current month
  for (var d = 1; d <= daysInMonth; d++) {
    grid.push({ day: d, isCurrentMonth: true });
  }

  // Next month padding to fill 42 cells
  var remaining = 42 - grid.length;
  for (var n = 1; n <= remaining; n++) {
    grid.push({ day: n, isCurrentMonth: false });
  }

  return grid;
}

/**
 * Check if two dates fall on the same calendar day.
 */
export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

/**
 * Check if a date is today.
 */
export function isToday(d: Date): boolean {
  return isSameDay(d, new Date());
}

/**
 * Get a human-readable month label, e.g. "February 2025".
 */
export function getMonthLabel(year: number, month: number): string {
  return MONTH_NAMES[month] + " " + String(year);
}

/**
 * Get abbreviated day name headers for a calendar grid.
 */
export function getDayHeaders(): string[] {
  return DAY_NAMES;
}
