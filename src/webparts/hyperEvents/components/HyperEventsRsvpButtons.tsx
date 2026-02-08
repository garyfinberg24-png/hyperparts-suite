import * as React from "react";
import type { EventRsvpResponse, IEventRsvpCounts } from "../models";
import styles from "./HyperEventsRsvpButtons.module.scss";

export interface IHyperEventsRsvpButtonsProps {
  eventId: string;
  currentResponse: EventRsvpResponse | undefined;
  counts: IEventRsvpCounts | undefined;
  onSubmit: (eventId: string, response: EventRsvpResponse) => Promise<void>;
}

interface IRsvpOption {
  key: EventRsvpResponse;
  label: string;
  countKey: keyof IEventRsvpCounts;
}

const RSVP_OPTIONS: IRsvpOption[] = [
  { key: "going", label: "Going", countKey: "going" },
  { key: "maybe", label: "Maybe", countKey: "maybe" },
  { key: "declined", label: "Not Going", countKey: "declined" },
];

/** Going/Maybe/Not Going buttons with counts */
const HyperEventsRsvpButtons: React.FC<IHyperEventsRsvpButtonsProps> = function (props) {
  const children: React.ReactNode[] = [];

  RSVP_OPTIONS.forEach(function (opt) {
    const isActive = props.currentResponse === opt.key;
    const btnClass = styles.rsvpButton + (isActive ? " " + styles.rsvpButtonActive : "");
    const count = props.counts ? props.counts[opt.countKey] : 0;

    children.push(
      React.createElement(
        "button",
        {
          key: opt.key,
          className: btnClass,
          onClick: function () { props.onSubmit(props.eventId, opt.key).catch(function () { /* handled */ }); },
          "aria-pressed": isActive,
          "aria-label": opt.label + (count > 0 ? " (" + String(count) + ")" : ""),
          type: "button",
        },
        opt.label,
        count > 0
          ? React.createElement("span", { className: styles.rsvpCount }, String(count))
          : undefined
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.rsvpButtons, role: "group", "aria-label": "RSVP" },
    children
  );
};

export default HyperEventsRsvpButtons;
