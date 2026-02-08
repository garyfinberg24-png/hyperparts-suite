/** Source type for calendar events */
export type EventSourceType = "spCalendar" | "exchangeCalendar" | "outlookGroup";

/** A single calendar event source */
export interface IEventSource {
  id: string;
  type: EventSourceType;
  /** Site URL — for spCalendar sources on other sites */
  siteUrl: string | undefined;
  /** List name — for spCalendar sources */
  listName: string | undefined;
  /** Calendar ID — for exchangeCalendar sources */
  calendarId: string | undefined;
  /** Group ID — for outlookGroup sources */
  groupId: string | undefined;
  /** Color for calendar overlay */
  color: string;
  enabled: boolean;
  displayName: string;
}

/** Default source: current site Events list */
export const DEFAULT_SOURCE: IEventSource = {
  id: "default",
  type: "spCalendar",
  siteUrl: undefined,
  listName: "Events",
  calendarId: undefined,
  groupId: undefined,
  color: "#0078d4",
  enabled: true,
  displayName: "Site Events",
};

/** Generate a unique source ID */
export function generateSourceId(): string {
  return "src-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Parse sources from JSON string */
export function parseSources(json: string | undefined): IEventSource[] {
  if (!json) return [DEFAULT_SOURCE];
  try {
    const parsed = JSON.parse(json) as IEventSource[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [DEFAULT_SOURCE];
  } catch {
    return [DEFAULT_SOURCE];
  }
}

/** Stringify sources to JSON */
export function stringifySources(sources: IEventSource[]): string {
  return JSON.stringify(sources, undefined, 2);
}
