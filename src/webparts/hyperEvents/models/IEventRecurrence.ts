/** Recurrence pattern types (match Graph API) */
export type RecurrencePatternType =
  | "daily"
  | "weekly"
  | "absoluteMonthly"
  | "relativeMonthly"
  | "absoluteYearly"
  | "relativeYearly";

/** Parsed recurrence pattern */
export interface IEventRecurrence {
  pattern: RecurrencePatternType;
  /** Interval between occurrences (e.g. every 2 weeks) */
  interval: number;
  /** Days of the week (e.g. ["monday", "wednesday"]) */
  daysOfWeek: string[];
  /** Day of month for absoluteMonthly/absoluteYearly */
  dayOfMonth: number | undefined;
  /** Month (1-12) for yearly patterns */
  month: number | undefined;
  /** Week index for relative patterns: "first" | "second" | "third" | "fourth" | "last" */
  index: string | undefined;
  /** ISO date when recurrence starts */
  startDate: string;
  /** ISO date when recurrence ends (undefined = no end) */
  endDate: string | undefined;
  /** Number of occurrences (undefined = no limit beyond endDate) */
  numberOfOccurrences: number | undefined;
}

/**
 * Parse a Graph API recurrence object into our IEventRecurrence.
 * Graph recurrence structure: { pattern: { type, interval, daysOfWeek, dayOfMonth, month, index }, range: { type, startDate, endDate, numberOfOccurrences } }
 */
export function parseRecurrenceFromGraph(
  graphRecurrence: Record<string, unknown> | undefined
): IEventRecurrence | undefined {
  if (!graphRecurrence) return undefined;

  const pattern = graphRecurrence.pattern as Record<string, unknown> | undefined;
  const range = graphRecurrence.range as Record<string, unknown> | undefined;

  if (!pattern) return undefined;

  const patternType = String(pattern.type || "daily") as RecurrencePatternType;
  const daysRaw = pattern.daysOfWeek;
  const daysOfWeek: string[] = [];
  if (Array.isArray(daysRaw)) {
    daysRaw.forEach(function (d) { daysOfWeek.push(String(d)); });
  }

  return {
    pattern: patternType,
    interval: typeof pattern.interval === "number" ? pattern.interval : 1,
    daysOfWeek: daysOfWeek,
    dayOfMonth: typeof pattern.dayOfMonth === "number" ? pattern.dayOfMonth : undefined,
    month: typeof pattern.month === "number" ? pattern.month : undefined,
    index: typeof pattern.index === "string" ? pattern.index : undefined,
    startDate: range ? String(range.startDate || "") : "",
    endDate: range && range.endDate ? String(range.endDate) : undefined,
    numberOfOccurrences: range && typeof range.numberOfOccurrences === "number"
      ? range.numberOfOccurrences
      : undefined,
  };
}
