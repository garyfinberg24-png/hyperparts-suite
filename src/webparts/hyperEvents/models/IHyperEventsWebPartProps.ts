import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";

/** Available calendar view modes */
export type HyperEventsViewMode =
  | "month"
  | "week"
  | "day"
  | "agenda"
  | "timeline"
  | "cardGrid";

export interface IHyperEventsWebPartProps extends IBaseHyperWebPartProps {
  title: string;
  /** JSON array of IEventSource[] */
  sources: string;
  /** Currently selected view mode */
  viewMode: HyperEventsViewMode;
  /** Default view mode when web part first loads */
  defaultView: HyperEventsViewMode;
  /** JSON array of IEventCategory[] */
  categories: string;
  /** Enable RSVP buttons on events */
  enableRsvp: boolean;
  /** Enable registration forms on events */
  enableRegistration: boolean;
  /** Enable countdown timer for events */
  enableCountdown: boolean;
  /** Event ID to show countdown for (when enableCountdown) */
  countdownEventId: string;
  /** Enable email and Teams notifications */
  enableNotifications: boolean;
  /** Show category filter bar */
  enableCategoryFilter: boolean;
  /** Show map/directions links for locations */
  enableLocationLinks: boolean;
  /** Show Teams meeting join buttons */
  enableVirtualLinks: boolean;
  /** Show past events archive section */
  enablePastArchive: boolean;
  /** Show multi-source calendar overlay with colors */
  showCalendarOverlay: boolean;
  /** SP list name for storing registration submissions */
  registrationListName: string;
  /** SP list name for storing RSVP responses */
  rsvpListName: string;
  /** JSON array of IRegistrationField[] for form builder */
  registrationFields: string;
  /** Auto-refresh interval in seconds (0 = disabled) */
  refreshInterval: number;
  /** Cache duration in seconds */
  cacheDuration: number;
}
