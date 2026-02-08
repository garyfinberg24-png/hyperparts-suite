import * as React from "react";
import type { IEventsViewProps } from "./index";
import { getMonthDays, isSameDay, isToday, isInMonth, eventOverlapsDay } from "../../utils/dateUtils";
import HyperEventsEventChip from "../HyperEventsEventChip";
import styles from "./MonthView.module.scss";

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_EVENTS_PER_CELL = 3;

/** CSS Grid 7x6 month calendar with event chips and "+N more" overflow */
const MonthView: React.FC<IEventsViewProps> = function (props) {
  const year = props.selectedDate.getFullYear();
  const month = props.selectedDate.getMonth();
  const days = React.useMemo(function () {
    return getMonthDays(year, month);
  }, [year, month]);

  const children: React.ReactNode[] = [];

  // Header row — day names
  DAY_HEADERS.forEach(function (day, idx) {
    children.push(
      React.createElement("div", {
        key: "hdr-" + idx,
        className: styles.monthViewHeader,
        role: "columnheader",
      }, day)
    );
  });

  // Day cells
  days.forEach(function (day, idx) {
    const dayIsToday = isToday(day);
    const dayIsInMonth = isInMonth(day, year, month);
    const dayIsSelected = isSameDay(day, props.selectedDate);

    // Find events for this day
    const dayEvents = props.events.filter(function (evt) {
      return eventOverlapsDay(evt.startDate, evt.endDate, day);
    });

    // Cell class
    let cellClass = styles.monthViewCell;
    if (!dayIsInMonth) cellClass += " " + styles.monthViewCellOutside;
    if (dayIsToday) cellClass += " " + styles.monthViewCellToday;
    if (dayIsSelected) cellClass += " " + styles.monthViewCellSelected;

    // Day number
    const dayNumClass = dayIsToday
      ? styles.monthViewDayNumberToday
      : styles.monthViewDayNumber;

    const dayNum = React.createElement("span", {
      key: "num",
      className: dayNumClass,
    }, String(day.getDate()));

    // Event chips (max 3, then "+N more")
    const eventChips: React.ReactNode[] = [];
    const visibleCount = Math.min(dayEvents.length, MAX_EVENTS_PER_CELL);
    for (let i = 0; i < visibleCount; i++) {
      eventChips.push(
        React.createElement(HyperEventsEventChip, {
          key: dayEvents[i].id,
          event: dayEvents[i],
          onClick: props.onEventClick,
          compact: true,
        })
      );
    }

    if (dayEvents.length > MAX_EVENTS_PER_CELL) {
      eventChips.push(
        React.createElement("span", {
          key: "more",
          className: styles.monthViewMoreLabel,
        }, "+" + String(dayEvents.length - MAX_EVENTS_PER_CELL) + " more")
      );
    }

    const eventsContainer = React.createElement("div", {
      key: "events",
      className: styles.monthViewCellEvents,
    }, eventChips);

    children.push(
      React.createElement("div", {
        key: "cell-" + idx,
        className: cellClass,
        "aria-current": dayIsToday ? "date" : undefined,
        "aria-selected": dayIsSelected,
        role: "gridcell",
      }, dayNum, eventsContainer)
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.monthViewGrid,
      role: "grid",
      "aria-label": "Month calendar",
    },
    children
  );
};

export default MonthView;
