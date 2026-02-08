import * as React from "react";
import { format } from "date-fns";
import type { IEventsViewProps } from "./index";
import type { IHyperEvent } from "../../models";
import {
  getWeekDays,
  getDayHours,
  isToday,
  formatHour,
  getEventTopOffset,
  getEventHeight,
  eventOverlapsDay,
} from "../../utils/dateUtils";
import styles from "./WeekView.module.scss";

const HOUR_HEIGHT = 48;

/** 7-column time grid with all-day row and positioned event blocks */
const WeekView: React.FC<IEventsViewProps> = function (props) {
  const weekDays = React.useMemo(function () {
    return getWeekDays(props.selectedDate);
  }, [props.selectedDate]);

  const hours = getDayHours();

  // Separate all-day and timed events
  const allDayEvents: Array<{ day: Date; events: IHyperEvent[] }> = [];
  const timedEvents: Array<{ day: Date; events: IHyperEvent[] }> = [];

  weekDays.forEach(function (day) {
    const dayAllDay: IHyperEvent[] = [];
    const dayTimed: IHyperEvent[] = [];
    props.events.forEach(function (evt) {
      if (eventOverlapsDay(evt.startDate, evt.endDate, day)) {
        if (evt.isAllDay) {
          dayAllDay.push(evt);
        } else {
          dayTimed.push(evt);
        }
      }
    });
    allDayEvents.push({ day: day, events: dayAllDay });
    timedEvents.push({ day: day, events: dayTimed });
  });

  // All-day row
  const allDayChildren: React.ReactNode[] = [];
  allDayChildren.push(
    React.createElement("div", {
      key: "ad-label",
      className: styles.weekViewAllDayLabel,
    }, "All Day")
  );
  allDayEvents.forEach(function (dayData, idx) {
    const chips: React.ReactNode[] = [];
    dayData.events.forEach(function (evt) {
      const color = evt.sourceColor || evt.categoryColor || "#0078d4";
      chips.push(
        React.createElement("div", {
          key: evt.id,
          className: styles.weekViewEventBlock,
          style: {
            position: "relative",
            backgroundColor: color + "33",
            borderLeft: "3px solid " + color,
            color: "#333",
          },
          onClick: function () { props.onEventClick(evt.id); },
          role: "button",
          tabIndex: 0,
          "aria-label": evt.title,
        }, evt.title)
      );
    });
    allDayChildren.push(
      React.createElement("div", {
        key: "ad-" + idx,
        className: styles.weekViewAllDayCell,
      }, chips)
    );
  });

  const allDayRow = React.createElement("div", {
    className: styles.weekViewAllDayRow,
  }, allDayChildren);

  // Time grid
  const gridChildren: React.ReactNode[] = [];

  // Corner cell
  gridChildren.push(
    React.createElement("div", { key: "corner", className: styles.weekViewCorner })
  );

  // Column headers
  weekDays.forEach(function (day, idx) {
    const dayIsToday = isToday(day);
    const headerClass = styles.weekViewHeader +
      (dayIsToday ? " " + styles.weekViewHeaderToday : "");
    gridChildren.push(
      React.createElement("div", {
        key: "hdr-" + idx,
        className: headerClass,
        role: "columnheader",
      }, format(day, "EEE d"))
    );
  });

  // Hour rows
  hours.forEach(function (hour) {
    // Time label
    gridChildren.push(
      React.createElement("div", {
        key: "time-" + hour,
        className: styles.weekViewTimeLabel,
        role: "rowheader",
      }, formatHour(hour))
    );

    // Day cells for this hour
    weekDays.forEach(function (day, dayIdx) {
      const dayIsToday = isToday(day);
      const cellClass = styles.weekViewTimeCell +
        (dayIsToday ? " " + styles.weekViewTimeCellToday : "");

      // Position timed events that start in this hour
      const cellEvents: React.ReactNode[] = [];
      if (hour === 0) {
        // Render all timed events for this day at once (positioned absolutely)
        timedEvents[dayIdx].events.forEach(function (evt) {
          const color = evt.sourceColor || evt.categoryColor || "#0078d4";
          const top = getEventTopOffset(evt.startDate, HOUR_HEIGHT);
          const height = getEventHeight(evt.startDate, evt.endDate, HOUR_HEIGHT);

          cellEvents.push(
            React.createElement("div", {
              key: evt.id,
              className: styles.weekViewEventBlock,
              style: {
                top: String(top) + "px",
                height: String(height) + "px",
                backgroundColor: color + "33",
                borderLeft: "3px solid " + color,
                color: "#333",
              },
              onClick: function () { props.onEventClick(evt.id); },
              role: "button",
              tabIndex: 0,
              "aria-label": evt.title,
            }, evt.title)
          );
        });
      }

      gridChildren.push(
        React.createElement("div", {
          key: "cell-" + hour + "-" + dayIdx,
          className: cellClass,
          role: "gridcell",
        }, hour === 0 ? cellEvents : undefined)
      );
    });
  });

  return React.createElement(
    "div",
    { className: styles.weekViewContainer },
    allDayRow,
    React.createElement(
      "div",
      {
        className: styles.weekViewGrid,
        role: "grid",
        "aria-label": "Week calendar",
      },
      gridChildren
    )
  );
};

export default WeekView;
