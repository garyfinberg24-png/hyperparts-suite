import * as React from "react";
import type { IHyperEvent } from "../models";
import { formatEventTime } from "../utils/dateUtils";
import styles from "./HyperEventsEventChip.module.scss";

export interface IHyperEventsEventChipProps {
  event: IHyperEvent;
  onClick: (eventId: string) => void;
  compact?: boolean;
}

/** Small colored event indicator for calendar cells */
const HyperEventsEventChip: React.FC<IHyperEventsEventChipProps> = function (props) {
  const evt = props.event;
  const color = evt.sourceColor || evt.categoryColor || "#0078d4";
  const time = evt.isAllDay ? "" : formatEventTime(evt.startDate);

  const handleClick = React.useCallback(function () {
    props.onClick(evt.id);
  }, [evt.id, props.onClick]);

  const handleKeyDown = React.useCallback(function (e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      props.onClick(evt.id);
    }
  }, [evt.id, props.onClick]);

  const chipStyle: React.CSSProperties = {
    backgroundColor: color + "1A", // 10% opacity
    borderLeft: "3px solid " + color,
  };

  const children: React.ReactNode[] = [];

  if (!props.compact) {
    // Color dot
    children.push(
      React.createElement("span", {
        key: "dot",
        className: styles.hyperEventsEventChipDot,
        style: { backgroundColor: color },
      })
    );
  }

  // Time (if not all day and not compact)
  if (time && !props.compact) {
    children.push(
      React.createElement("span", {
        key: "time",
        className: styles.hyperEventsEventChipTime,
      }, time)
    );
  }

  // Title
  const titleClass = styles.hyperEventsEventChipTitle +
    (evt.isAllDay ? " " + styles.hyperEventsEventChipAllDay : "");
  children.push(
    React.createElement("span", {
      key: "title",
      className: titleClass,
    }, evt.title)
  );

  return React.createElement(
    "div",
    {
      className: styles.hyperEventsEventChip,
      style: chipStyle,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      role: "button",
      tabIndex: 0,
      "aria-label": evt.title + (time ? " at " + time : ""),
      title: evt.title + (time ? " at " + time : ""),
    },
    children
  );
};

export default HyperEventsEventChip;
