/** A single attendee on an event */
export interface IEventAttendee {
  name: string;
  email: string;
  response: string | undefined;
}

/** RSVP count summary */
export interface IEventRsvpCounts {
  going: number;
  maybe: number;
  declined: number;
}

/** A calendar event */
export interface IHyperEvent {
  /** Unique identifier (sourceId:itemId or Graph event ID) */
  id: string;
  title: string;
  description: string;
  /** ISO 8601 date-time string */
  startDate: string;
  /** ISO 8601 date-time string */
  endDate: string;
  isAllDay: boolean;
  location: string | undefined;
  category: string | undefined;
  categoryColor: string | undefined;
  organizer: string | undefined;
  organizerEmail: string | undefined;
  attendees: IEventAttendee[];
  recurrence: import("./IEventRecurrence").IEventRecurrence | undefined;
  isRecurring: boolean;
  /** ID of the series master for recurring event instances */
  seriesMasterId: string | undefined;
  /** Teams meeting join URL */
  teamsJoinUrl: string | undefined;
  /** Web link to open the event in Outlook/SP */
  webLink: string | undefined;
  /** Source that provided this event */
  sourceId: string;
  /** Color from the source for calendar overlay */
  sourceColor: string | undefined;
  /** Event banner/header image URL */
  imageUrl: string | undefined;
  registrationEnabled: boolean;
  rsvpEnabled: boolean;
  rsvpCounts: IEventRsvpCounts | undefined;
}

/** Default event for testing/stubs */
export const DEFAULT_EVENT: IHyperEvent = {
  id: "",
  title: "",
  description: "",
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  isAllDay: false,
  location: undefined,
  category: undefined,
  categoryColor: undefined,
  organizer: undefined,
  organizerEmail: undefined,
  attendees: [],
  recurrence: undefined,
  isRecurring: false,
  seriesMasterId: undefined,
  teamsJoinUrl: undefined,
  webLink: undefined,
  sourceId: "",
  sourceColor: undefined,
  imageUrl: undefined,
  registrationEnabled: false,
  rsvpEnabled: false,
  rsvpCounts: undefined,
};
