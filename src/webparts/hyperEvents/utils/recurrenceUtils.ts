import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  parseISO,
  isBefore,
  isAfter,
} from "date-fns";
import type { IHyperEvent, IEventRecurrence } from "../models";

/** Maximum occurrences to generate to prevent infinite loops */
const MAX_OCCURRENCES = 200;

/**
 * Advance a date by one recurrence interval.
 */
function advanceByPattern(date: Date, recurrence: IEventRecurrence): Date {
  switch (recurrence.pattern) {
    case "daily":
      return addDays(date, recurrence.interval);
    case "weekly":
      return addWeeks(date, recurrence.interval);
    case "absoluteMonthly":
    case "relativeMonthly":
      return addMonths(date, recurrence.interval);
    case "absoluteYearly":
    case "relativeYearly":
      return addYears(date, recurrence.interval);
    default:
      return addDays(date, recurrence.interval);
  }
}

/**
 * Expand a recurring event into individual occurrences within the date range.
 * Generates occurrences by stepping from the series start date.
 */
export function expandRecurrence(
  event: IHyperEvent,
  rangeStart: string,
  rangeEnd: string
): IHyperEvent[] {
  if (!event.recurrence) return [event];

  const recurrence = event.recurrence;
  const rangeStartDate = parseISO(rangeStart);
  const rangeEndDate = parseISO(rangeEnd);

  // Event duration in milliseconds
  const eventStart = parseISO(event.startDate);
  const eventEnd = parseISO(event.endDate);
  if (isNaN(eventStart.getTime()) || isNaN(eventEnd.getTime())) return [event];
  const durationMs = eventEnd.getTime() - eventStart.getTime();

  // Recurrence end limit
  const recurrenceEnd = recurrence.endDate ? parseISO(recurrence.endDate) : undefined;
  const maxOccurrences = recurrence.numberOfOccurrences || MAX_OCCURRENCES;

  const occurrences: IHyperEvent[] = [];
  let currentStart = eventStart;
  let count = 0;

  while (count < maxOccurrences && count < MAX_OCCURRENCES) {
    // Stop if past recurrence end date
    if (recurrenceEnd && isAfter(currentStart, recurrenceEnd)) break;

    // Stop if past the visible range end
    if (isAfter(currentStart, rangeEndDate)) break;

    const currentEnd = new Date(currentStart.getTime() + durationMs);

    // Include if occurrence overlaps the visible range
    if (!isBefore(currentEnd, rangeStartDate)) {
      occurrences.push({
        ...event,
        id: event.id + ":occ:" + String(count),
        startDate: currentStart.toISOString(),
        endDate: currentEnd.toISOString(),
        seriesMasterId: event.id,
      });
    }

    currentStart = advanceByPattern(currentStart, recurrence);
    count++;
  }

  return occurrences.length > 0 ? occurrences : [event];
}

/**
 * Generate a human-readable description of a recurrence pattern.
 */
export function describeRecurrence(recurrence: IEventRecurrence | undefined): string {
  if (!recurrence) return "";

  const interval = recurrence.interval;
  switch (recurrence.pattern) {
    case "daily":
      return interval === 1 ? "Daily" : "Every " + String(interval) + " days";
    case "weekly": {
      const days = recurrence.daysOfWeek.length > 0
        ? recurrence.daysOfWeek.join(", ")
        : "";
      if (interval === 1) return days ? "Weekly on " + days : "Weekly";
      return "Every " + String(interval) + " weeks" + (days ? " on " + days : "");
    }
    case "absoluteMonthly":
      if (interval === 1) return "Monthly on day " + String(recurrence.dayOfMonth || 1);
      return "Every " + String(interval) + " months on day " + String(recurrence.dayOfMonth || 1);
    case "relativeMonthly": {
      const idx = recurrence.index || "first";
      const d = recurrence.daysOfWeek.length > 0 ? recurrence.daysOfWeek[0] : "day";
      return interval === 1
        ? "Monthly on the " + idx + " " + d
        : "Every " + String(interval) + " months on the " + idx + " " + d;
    }
    case "absoluteYearly":
      return "Yearly";
    case "relativeYearly":
      return "Yearly";
    default:
      return "Recurring";
  }
}
