import * as React from "react";
import type { ICalendarDay, CalendarSlotStatus } from "../models/IHyperProfileCalendar";
import styles from "./HyperProfileCalendar.module.scss";

export interface IHyperProfileCalendarProps {
  calendar: ICalendarDay[];
  accentColor: string;
}

/** Get color for a calendar slot status */
function getSlotColor(status: CalendarSlotStatus): string {
  if (status === "free") return "#107c10";
  if (status === "tentative") return "#ffc107";
  if (status === "busy") return "#d13438";
  if (status === "oof") return "#8764b8";
  return "#a19f9d";
}

/** Get label for a calendar slot status */
function getSlotLabel(status: CalendarSlotStatus): string {
  if (status === "free") return "Free";
  if (status === "tentative") return "Tentative";
  if (status === "busy") return "Busy";
  if (status === "oof") return "Out of Office";
  return "Unknown";
}

const HyperProfileCalendar: React.FC<IHyperProfileCalendarProps> = function (props) {
  if (!props.calendar || props.calendar.length === 0) {
    return React.createElement("span", undefined);
  }

  const dayElements: React.ReactNode[] = [];

  props.calendar.forEach(function (day) {
    const dayChildren: React.ReactNode[] = [];

    // Day header
    dayChildren.push(
      React.createElement("div", { key: "header", className: styles.dayHeader },
        React.createElement("span", { className: styles.dayName }, day.dayLabel),
        React.createElement("span", { className: styles.dayDate }, day.date.substring(5)) // MM-DD
      )
    );

    // Slots
    if (day.slots.length === 0) {
      dayChildren.push(
        React.createElement("div", {
          key: "free",
          className: styles.slotBar,
          style: { backgroundColor: getSlotColor("free") },
          title: "Free all day",
          "aria-label": day.dayLabel + ": Free all day",
        })
      );
    } else {
      const slotElements: React.ReactNode[] = [];
      day.slots.forEach(function (slot, idx) {
        const slotLabel = slot.startTime + " - " + slot.endTime + ": " + getSlotLabel(slot.status);
        slotElements.push(
          React.createElement("div", {
            key: "slot-" + idx,
            className: styles.slotBar,
            style: { backgroundColor: getSlotColor(slot.status) },
            title: slot.subject ? slot.subject + " (" + slotLabel + ")" : slotLabel,
            "aria-label": day.dayLabel + " " + slotLabel,
          })
        );
      });
      dayChildren.push(
        React.createElement("div", { key: "slots", className: styles.slotsColumn }, slotElements)
      );
    }

    dayElements.push(
      React.createElement("div", { key: day.date, className: styles.dayColumn }, dayChildren)
    );
  });

  // Legend
  const legendItems: React.ReactNode[] = [];
  const statuses: CalendarSlotStatus[] = ["free", "tentative", "busy", "oof"];
  statuses.forEach(function (status) {
    legendItems.push(
      React.createElement("div", { key: status, className: styles.legendItem },
        React.createElement("span", {
          className: styles.legendDot,
          style: { backgroundColor: getSlotColor(status) },
        }),
        React.createElement("span", { className: styles.legendLabel }, getSlotLabel(status))
      )
    );
  });

  return React.createElement("div", {
    className: styles.calendarContainer,
    role: "region",
    "aria-label": "Calendar Availability",
  },
    React.createElement("div", { className: styles.daysGrid }, dayElements),
    React.createElement("div", { className: styles.legend }, legendItems)
  );
};

export default HyperProfileCalendar;
