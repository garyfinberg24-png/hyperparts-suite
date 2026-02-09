/**
 * Weekend/Holiday Shift Utility
 *
 * When celebrations fall on a Saturday or Sunday, this utility shifts
 * the display date to the nearest weekday (Friday before or Monday after).
 * Saturday -> Friday, Sunday -> Monday.
 */

import { getDay } from "date-fns";
import type { ICelebration } from "../models";
import { getNextOccurrence } from "./dateHelpers";

/**
 * Check if a date falls on a weekend (Saturday=6, Sunday=0).
 */
export function isWeekend(date: Date): boolean {
  var day = getDay(date);
  return day === 0 || day === 6;
}

/**
 * Get the shifted display date for a celebration.
 * Saturday celebrations shift to Friday (day before),
 * Sunday celebrations shift to Monday (day after).
 * Returns the original date if it's a weekday.
 */
export function getShiftedDate(date: Date): Date {
  var day = getDay(date);
  if (day === 6) {
    // Saturday -> Friday (subtract 1 day)
    var friday = new Date(date.getTime());
    friday.setDate(friday.getDate() - 1);
    return friday;
  }
  if (day === 0) {
    // Sunday -> Monday (add 1 day)
    var monday = new Date(date.getTime());
    monday.setDate(monday.getDate() + 1);
    return monday;
  }
  return date;
}

/**
 * Get the shifted display date string for a celebration's MM-DD date.
 * Returns undefined if the original date can't be parsed.
 */
export function getShiftedDateForCelebration(celebration: ICelebration): Date | undefined {
  var nextDate = getNextOccurrence(celebration.celebrationDate);
  if (!nextDate) return undefined;
  return getShiftedDate(nextDate);
}

/**
 * Format a shifted date label.
 * Example: "Fri, Mar 14 (shifted from Sat, Mar 15)"
 */
export function getShiftedDateLabel(
  originalDate: Date,
  shiftedDate: Date
): string {
  if (originalDate.getTime() === shiftedDate.getTime()) {
    return ""; // No shift needed
  }
  return "Celebrating on nearest workday";
}
