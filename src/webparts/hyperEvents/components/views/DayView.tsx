import * as React from "react";
import type { IEventsViewProps } from "./index";
import type { IHyperEvent } from "../../models";
import {
  getDayHours,
  formatHour,
  formatEventTime,
  getEventTopOffset,
  getEventHeight,
  eventOverlapsDay,
} from "../../utils/dateUtils";
import styles from "./DayView.module.scss";

const HOUR_HEIGHT = 48;

/** Single-column time grid with wide event blocks */
const DayView: React.FC<IEventsViewProps> = function (props) {
  const day = props.selectedDate;
  const hours = getDayHours();

  // Separate all-day vs timed
  const allDayEvts: IHyperEvent[] = [];
  const timedEvts: IHyperEvent[] = [];
  props.events.forEach(function (evt) {
    if (eventOverlapsDay(evt.startDate, evt.endDate, day)) {
      if (evt.isAllDay) {
        allDayEvts.push(evt);
      } else {
        timedEvts.push(evt);
      }
    }
  });

  // All-day section
  const allDayChildren: React.ReactNode[] = [];
  allDayChildren.push(
    React.createElement("span", {
      key: "label",
      className: styles.dayViewAllDayLabel,
    }, "All Day")
  );
  allDayEvts.forEach(function (evt) {
    const color = evt.sourceColor || evt.categoryColor || "#0078d4";
    allDayChildren.push(
      React.createElement("div", {
        key: evt.id,
        style: {
          backgroundColor: color + "33",
          borderLeft: "3px solid " + color,
          padding: "2px 8px",
          borderRadius: "3px",
          cursor: "pointer",
          fontSize: "12px",
        },
        onClick: function () { props.onEventClick(evt.id); },
        role: "button",
        tabIndex: 0,
        "aria-label": evt.title,
      }, evt.title)
    );
  });

  const allDaySection = React.createElement("div", {
    className: styles.dayViewAllDay,
  }, allDayChildren);

  // Time grid
  const gridChildren: React.ReactNode[] = [];

  hours.forEach(function (hour) {
    // Time label
    gridChildren.push(
      React.createElement("div", {
        key: "time-" + hour,
        className: styles.dayViewTimeLabel,
        role: "rowheader",
      }, formatHour(hour))
    );

    // Time cell — render events at hour 0 (positioned absolutely)
    const cellChildren: React.ReactNode[] = [];
    if (hour === 0) {
      timedEvts.forEach(function (evt) {
        const color = evt.sourceColor || evt.categoryColor || "#0078d4";
        const top = getEventTopOffset(evt.startDate, HOUR_HEIGHT);
        const height = getEventHeight(evt.startDate, evt.endDate, HOUR_HEIGHT);
        const startTime = formatEventTime(evt.startDate);
        const endTime = formatEventTime(evt.endDate);

        cellChildren.push(
          React.createElement("div", {
            key: evt.id,
            className: styles.dayViewEventBlock,
            style: {
              top: String(top) + "px",
              height: String(height) + "px",
              backgroundColor: color + "33",
              borderLeft: "4px solid " + color,
              color: "#333",
            },
            onClick: function () { props.onEventClick(evt.id); },
            role: "button",
            tabIndex: 0,
            "aria-label": evt.title + " " + startTime + " to " + endTime,
          },
            React.createElement("span", {
              className: styles.dayViewEventBlockTitle,
            }, evt.title),
            React.createElement("span", {
              className: styles.dayViewEventBlockTime,
            }, startTime + " - " + endTime)
          )
        );
      });
    }

    gridChildren.push(
      React.createElement("div", {
        key: "cell-" + hour,
        className: styles.dayViewTimeCell,
        role: "gridcell",
      }, hour === 0 ? cellChildren : undefined)
    );
  });

  return React.createElement(
    "div",
    { className: styles.dayViewContainer },
    allDaySection,
    React.createElement(
      "div",
      {
        className: styles.dayViewGrid,
        role: "grid",
        "aria-label": "Day calendar",
      },
      gridChildren
    )
  );
};

export default DayView;
