import type { HyperEventsViewMode } from "./IHyperEventsWebPartProps";
import type { EventSourceType } from "./IEventSource";

// ============================================================
// Wizard State — Multi-step setup flow for HyperEvents
// ============================================================

/** A wizard-time source entry (not yet serialized) */
export interface IWizardEventSource {
  type: EventSourceType;
  displayName: string;
  color: string;
  listName: string;
  siteUrl: string;
  calendarId: string;
  groupId: string;
}

/** Wizard state shape */
export interface IEventsWizardState {
  /** Default calendar view */
  defaultView: HyperEventsViewMode;
  /** Calendar sources */
  sources: IWizardEventSource[];
  /** Features toggles */
  features: {
    enableRsvp: boolean;
    enableRegistration: boolean;
    enableCountdown: boolean;
    enableNotifications: boolean;
    enableCategoryFilter: boolean;
    enableLocationLinks: boolean;
    enableVirtualLinks: boolean;
    enablePastArchive: boolean;
    showCalendarOverlay: boolean;
  };
  /** Display / appearance */
  display: {
    title: string;
    refreshInterval: number;
  };
}

/** Default wizard state */
export var DEFAULT_EVENTS_WIZARD_STATE: IEventsWizardState = {
  defaultView: "month",
  sources: [],
  features: {
    enableRsvp: true,
    enableRegistration: false,
    enableCountdown: false,
    enableNotifications: false,
    enableCategoryFilter: true,
    enableLocationLinks: true,
    enableVirtualLinks: true,
    enablePastArchive: false,
    showCalendarOverlay: false,
  },
  display: {
    title: "Events",
    refreshInterval: 0,
  },
};
