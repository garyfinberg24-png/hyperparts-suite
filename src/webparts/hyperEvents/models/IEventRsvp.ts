/** RSVP response options */
export type EventRsvpResponse = "going" | "maybe" | "declined";

/** A single RSVP record stored in a SP list */
export interface IEventRsvp {
  eventId: string;
  userId: string;
  userEmail: string;
  response: EventRsvpResponse;
  /** ISO 8601 timestamp */
  timestamp: string;
}
