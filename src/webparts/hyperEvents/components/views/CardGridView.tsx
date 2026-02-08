import * as React from "react";
import { format, parseISO } from "date-fns";
import type { IEventsViewProps } from "./index";
import { formatEventTime } from "../../utils/dateUtils";
import styles from "./CardGridView.module.scss";

/** Responsive CSS Grid of event cards */
const CardGridView: React.FC<IEventsViewProps> = function (props) {
  const children: React.ReactNode[] = [];

  props.events.forEach(function (evt) {
    const color = evt.sourceColor || evt.categoryColor || "#0078d4";
    const timeLabel = evt.isAllDay
      ? format(parseISO(evt.startDate), "MMM d") + " - All Day"
      : format(parseISO(evt.startDate), "MMM d") + " " + formatEventTime(evt.startDate) + " - " + formatEventTime(evt.endDate);

    const cardChildren: React.ReactNode[] = [];

    // Color bar
    cardChildren.push(
      React.createElement("div", {
        key: "bar",
        className: styles.cardGridCardColorBar,
        style: { backgroundColor: color },
      })
    );

    // Body
    const bodyChildren: React.ReactNode[] = [];

    // Title
    bodyChildren.push(
      React.createElement("div", { key: "title", className: styles.cardGridCardTitle }, evt.title)
    );

    // Time
    bodyChildren.push(
      React.createElement("div", { key: "time", className: styles.cardGridCardTime }, timeLabel)
    );

    // Location
    if (evt.location) {
      bodyChildren.push(
        React.createElement("div", { key: "loc", className: styles.cardGridCardLocation }, evt.location)
      );
    }

    // Description
    if (evt.description) {
      bodyChildren.push(
        React.createElement("div", { key: "desc", className: styles.cardGridCardDescription }, evt.description)
      );
    }

    // Category badge
    if (evt.category) {
      bodyChildren.push(
        React.createElement("span", {
          key: "cat",
          className: styles.cardGridCardCategory,
          style: { backgroundColor: (evt.categoryColor || color) + "1A", color: evt.categoryColor || color },
        }, evt.category)
      );
    }

    cardChildren.push(
      React.createElement("div", { key: "body", className: styles.cardGridCardBody }, bodyChildren)
    );

    children.push(
      React.createElement("div", {
        key: evt.id,
        className: styles.cardGridCard,
        onClick: function () { props.onEventClick(evt.id); },
        role: "listitem",
        tabIndex: 0,
        "aria-label": evt.title + " " + timeLabel,
      }, cardChildren)
    );
  });

  return React.createElement(
    "div",
    { className: styles.cardGridView, role: "list", "aria-label": "Event cards" },
    children
  );
};

export default CardGridView;
