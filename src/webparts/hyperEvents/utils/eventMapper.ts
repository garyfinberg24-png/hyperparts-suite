import type { IHyperEvent, IEventAttendee } from "../models";
import { parseRecurrenceFromGraph } from "../models";

/**
 * Map a SharePoint calendar list item to IHyperEvent.
 * SP Calendar list columns: Title, EventDate, EndDate, Location,
 * Category, Description, fAllDayEvent, fRecurrence, Author/Title, Author/EMail.
 */
export function mapSpCalendarItem(
  raw: Record<string, unknown>,
  sourceId: string,
  sourceColor: string | undefined
): IHyperEvent {
  const id = sourceId + ":" + String(raw.Id || raw.ID || "");
  const author = raw.Author as Record<string, unknown> | undefined;

  return {
    id: id,
    title: (raw.Title as string) || "",
    description: (raw.Description as string) || "",
    startDate: (raw.EventDate as string) || "",
    endDate: (raw.EndDate as string) || "",
    isAllDay: !!raw.fAllDayEvent,
    location: (raw.Location as string) || undefined,
    category: (raw.Category as string) || undefined,
    categoryColor: undefined,
    organizer: author ? (author.Title as string) : undefined,
    organizerEmail: author ? (author.EMail as string) : undefined,
    attendees: [],
    recurrence: undefined,
    isRecurring: !!raw.fRecurrence,
    seriesMasterId: undefined,
    teamsJoinUrl: undefined,
    webLink: undefined,
    sourceId: sourceId,
    sourceColor: sourceColor,
    imageUrl: (raw.BannerUrl as string) || undefined,
    registrationEnabled: false,
    rsvpEnabled: false,
    rsvpCounts: undefined,
  };
}

/**
 * Map attendees from a Graph event response.
 */
function mapGraphAttendees(attendeesRaw: unknown): IEventAttendee[] {
  if (!Array.isArray(attendeesRaw)) return [];
  const result: IEventAttendee[] = [];
  attendeesRaw.forEach(function (a: Record<string, unknown>) {
    const emailAddr = a.emailAddress as Record<string, unknown> | undefined;
    const status = a.status as Record<string, unknown> | undefined;
    result.push({
      name: emailAddr ? (emailAddr.name as string) || "" : "",
      email: emailAddr ? (emailAddr.address as string) || "" : "",
      response: status ? (status.response as string) : undefined,
    });
  });
  return result;
}

/**
 * Map a Microsoft Graph Calendar event to IHyperEvent.
 * Works for both /me/calendar/events and /groups/{id}/calendar/events.
 */
export function mapGraphEvent(
  raw: Record<string, unknown>,
  sourceId: string,
  sourceColor: string | undefined
): IHyperEvent {
  const start = raw.start as Record<string, unknown> | undefined;
  const end = raw.end as Record<string, unknown> | undefined;
  const organizer = raw.organizer as Record<string, unknown> | undefined;
  const organizerEmail = organizer
    ? (organizer.emailAddress as Record<string, unknown> | undefined)
    : undefined;
  const location = raw.location as Record<string, unknown> | undefined;
  const onlineMeeting = raw.onlineMeeting as Record<string, unknown> | undefined;

  return {
    id: sourceId + ":" + String(raw.id || ""),
    title: (raw.subject as string) || "",
    description: raw.bodyPreview ? (raw.bodyPreview as string) : "",
    startDate: start ? (start.dateTime as string) || "" : "",
    endDate: end ? (end.dateTime as string) || "" : "",
    isAllDay: !!raw.isAllDay,
    location: location ? (location.displayName as string) || undefined : undefined,
    category: undefined,
    categoryColor: undefined,
    organizer: organizerEmail ? (organizerEmail.name as string) : undefined,
    organizerEmail: organizerEmail ? (organizerEmail.address as string) : undefined,
    attendees: mapGraphAttendees(raw.attendees),
    recurrence: parseRecurrenceFromGraph(raw.recurrence as Record<string, unknown> | undefined),
    isRecurring: !!raw.recurrence,
    seriesMasterId: (raw.seriesMasterId as string) || undefined,
    teamsJoinUrl: onlineMeeting ? (onlineMeeting.joinUrl as string) || undefined : undefined,
    webLink: (raw.webLink as string) || undefined,
    sourceId: sourceId,
    sourceColor: sourceColor,
    imageUrl: undefined,
    registrationEnabled: false,
    rsvpEnabled: false,
    rsvpCounts: undefined,
  };
}
