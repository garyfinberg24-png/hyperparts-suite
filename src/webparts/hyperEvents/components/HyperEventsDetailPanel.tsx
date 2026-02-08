import * as React from "react";
import { format, parseISO } from "date-fns";
import type { IHyperEvent, EventRsvpResponse, IEventRsvpCounts } from "../models";
import { HyperModal } from "../../../common/components";
import { describeRecurrence } from "../utils/recurrenceUtils";
import { addEventToOutlook } from "../utils/outlookSync";
import HyperEventsRsvpButtons from "./HyperEventsRsvpButtons";
import HyperEventsCountdown from "./HyperEventsCountdown";
import styles from "./HyperEventsDetailPanel.module.scss";

export interface IHyperEventsDetailPanelProps {
  event: IHyperEvent | undefined;
  isOpen: boolean;
  onClose: () => void;
  enableRsvp: boolean;
  enableCountdown: boolean;
  enableLocationLinks: boolean;
  enableVirtualLinks: boolean;
  currentRsvpResponse: EventRsvpResponse | undefined;
  rsvpCounts: IEventRsvpCounts | undefined;
  onSubmitRsvp: (eventId: string, response: EventRsvpResponse) => Promise<void>;
  onOpenRegistration: () => void;
}

/** Full event detail panel */
const HyperEventsDetailPanel: React.FC<IHyperEventsDetailPanelProps> = function (props) {
  const evt = props.event;
  if (!evt) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const color = evt.sourceColor || evt.categoryColor || "#0078d4";

  // Format dates
  let timeDisplay = "";
  try {
    const start = parseISO(evt.startDate);
    const end = parseISO(evt.endDate);
    if (evt.isAllDay) {
      timeDisplay = format(start, "EEEE, MMMM d, yyyy") + " - All Day";
    } else {
      timeDisplay = format(start, "EEEE, MMMM d, yyyy h:mm a") + " - " + format(end, "h:mm a");
    }
  } catch {
    timeDisplay = evt.startDate;
  }

  // Recurrence description
  const recurrenceDesc = describeRecurrence(evt.recurrence);

  // Google Maps link
  const mapUrl = evt.location
    ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(evt.location)
    : "";

  // Add to Outlook handler
  const handleAddToOutlook = React.useCallback(function () {
    addEventToOutlook(evt).catch(function () { /* handled */ });
  }, [evt]);

  // Build content
  const panelChildren: React.ReactNode[] = [];

  // Color bar
  panelChildren.push(
    React.createElement("div", {
      key: "bar",
      className: styles.detailColorBar,
      style: { backgroundColor: color },
    })
  );

  // Title
  panelChildren.push(
    React.createElement("div", { key: "header", className: styles.detailHeader },
      React.createElement("h2", { className: styles.detailTitle }, evt.title)
    )
  );

  // Time
  panelChildren.push(
    React.createElement("div", { key: "time", className: styles.detailSection },
      React.createElement("div", { className: styles.detailLabel }, "When"),
      React.createElement("div", { className: styles.detailValue }, timeDisplay),
      recurrenceDesc
        ? React.createElement("div", { className: styles.detailRecurrence }, recurrenceDesc)
        : undefined
    )
  );

  // Countdown
  if (props.enableCountdown && new Date(evt.startDate).getTime() > Date.now()) {
    panelChildren.push(
      React.createElement("div", { key: "countdown" },
        React.createElement(HyperEventsCountdown, { targetDate: evt.startDate })
      )
    );
  }

  // Location
  if (evt.location) {
    const locationChildren: React.ReactNode[] = [];
    locationChildren.push(React.createElement("div", { key: "label", className: styles.detailLabel }, "Where"));
    locationChildren.push(React.createElement("div", { key: "val", className: styles.detailValue }, evt.location));
    if (props.enableLocationLinks && mapUrl) {
      locationChildren.push(
        React.createElement("a", {
          key: "map",
          href: mapUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: styles.detailActionButton,
          style: { display: "inline-flex", marginTop: "4px" },
        }, "Open in Maps")
      );
    }
    panelChildren.push(
      React.createElement("div", { key: "location", className: styles.detailSection }, locationChildren)
    );
  }

  // Organizer
  if (evt.organizer) {
    panelChildren.push(
      React.createElement("div", { key: "organizer", className: styles.detailSection },
        React.createElement("div", { className: styles.detailLabel }, "Organizer"),
        React.createElement("div", { className: styles.detailValue }, evt.organizer)
      )
    );
  }

  // Description
  if (evt.description) {
    panelChildren.push(
      React.createElement("div", { key: "desc", className: styles.detailSection },
        React.createElement("div", { className: styles.detailLabel }, "Description"),
        React.createElement("div", { className: styles.detailDescription }, evt.description)
      )
    );
  }

  // Attendees
  if (evt.attendees.length > 0) {
    const badges: React.ReactNode[] = [];
    evt.attendees.forEach(function (att) {
      badges.push(
        React.createElement("span", {
          key: att.email,
          className: styles.detailAttendeeBadge,
          title: att.email,
        }, att.name || att.email)
      );
    });
    panelChildren.push(
      React.createElement("div", { key: "attendees", className: styles.detailSection },
        React.createElement("div", { className: styles.detailLabel },
          "Attendees (" + String(evt.attendees.length) + ")"
        ),
        React.createElement("div", { className: styles.detailAttendees }, badges)
      )
    );
  }

  // RSVP
  if (props.enableRsvp && evt.rsvpEnabled) {
    panelChildren.push(
      React.createElement("div", { key: "rsvp", className: styles.detailSection },
        React.createElement("div", { className: styles.detailLabel }, "RSVP"),
        React.createElement(HyperEventsRsvpButtons, {
          eventId: evt.id,
          currentResponse: props.currentRsvpResponse,
          counts: props.rsvpCounts || evt.rsvpCounts,
          onSubmit: props.onSubmitRsvp,
        })
      )
    );
  }

  // Action buttons
  const actions: React.ReactNode[] = [];

  // Teams meeting join
  if (props.enableVirtualLinks && evt.teamsJoinUrl) {
    actions.push(
      React.createElement("a", {
        key: "teams",
        href: evt.teamsJoinUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: styles.detailActionButton,
        "aria-label": "Join Teams Meeting",
      }, "Join Teams Meeting")
    );
  }

  // Add to Outlook
  actions.push(
    React.createElement("button", {
      key: "outlook",
      className: styles.detailActionButton,
      onClick: handleAddToOutlook,
      type: "button",
      "aria-label": "Add to Outlook",
    }, "Add to Outlook")
  );

  // Registration
  if (evt.registrationEnabled) {
    actions.push(
      React.createElement("button", {
        key: "register",
        className: styles.detailActionButton,
        onClick: props.onOpenRegistration,
        type: "button",
        "aria-label": "Register",
      }, "Register")
    );
  }

  // Web link
  if (evt.webLink) {
    actions.push(
      React.createElement("a", {
        key: "webLink",
        href: evt.webLink,
        target: "_blank",
        rel: "noopener noreferrer",
        className: styles.detailActionButton,
        "aria-label": "Open in Outlook",
      }, "Open in Outlook")
    );
  }

  if (actions.length > 0) {
    panelChildren.push(
      React.createElement("div", { key: "actions", className: styles.detailActions }, actions)
    );
  }

  return React.createElement(
    HyperModal,
    {
      isOpen: props.isOpen,
      onClose: props.onClose,
      title: evt.title,
    },
    React.createElement("div", { className: styles.detailPanel }, panelChildren)
  );
};

export default HyperEventsDetailPanel;
