import * as React from "react";
import type { IEventsViewProps } from "./index";
import { formatEventTime } from "../../utils/dateUtils";
import styles from "./TimelineView.module.scss";

/** Vertical timeline with alternating left/right cards */
const TimelineView: React.FC<IEventsViewProps> = function (props) {
  const children: React.ReactNode[] = [];

  // Central line
  children.push(
    React.createElement("div", { key: "line", className: styles.timelineLine })
  );

  props.events.forEach(function (evt, idx) {
    const isLeft = idx % 2 === 0;
    const color = evt.sourceColor || evt.categoryColor || "#0078d4";
    const timeLabel = evt.isAllDay
      ? "All Day"
      : formatEventTime(evt.startDate) + " - " + formatEventTime(evt.endDate);

    const itemClass = styles.timelineItem + " " +
      (isLeft ? styles.timelineItemLeft : styles.timelineItemRight);

    const card = React.createElement("div", {
      className: styles.timelineItemContent,
      style: { borderTopColor: color, borderTopWidth: "3px" },
      onClick: function () { props.onEventClick(evt.id); },
      role: "listitem",
      tabIndex: 0,
      "aria-label": evt.title,
    },
      React.createElement("div", { className: styles.timelineItemTitle }, evt.title),
      React.createElement("div", { className: styles.timelineItemTime }, timeLabel),
      evt.location
        ? React.createElement("div", { className: styles.timelineItemLocation }, evt.location)
        : undefined
    );

    const dot = React.createElement("div", {
      className: styles.timelineItemDot,
      style: { backgroundColor: color },
    });

    const spacer = React.createElement("div", {
      className: styles.timelineItemSpacer,
    });

    children.push(
      React.createElement("div", {
        key: evt.id,
        className: itemClass,
      }, card, dot, spacer)
    );
  });

  return React.createElement(
    "div",
    { className: styles.timelineView, role: "list", "aria-label": "Timeline" },
    children
  );
};

export default TimelineView;
