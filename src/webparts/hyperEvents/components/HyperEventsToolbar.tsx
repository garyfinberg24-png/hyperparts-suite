import * as React from "react";
import type { HyperEventsViewMode } from "../models";
import { formatDateRange } from "../utils/dateUtils";
import styles from "./HyperEventsToolbar.module.scss";

export interface IHyperEventsToolbarProps {
  selectedDate: Date;
  viewMode: HyperEventsViewMode;
  onNavigateBackward: () => void;
  onNavigateForward: () => void;
  onNavigateToday: () => void;
  onViewModeChange: (mode: HyperEventsViewMode) => void;
}

interface IViewOption {
  key: HyperEventsViewMode;
  label: string;
}

const VIEW_OPTIONS: IViewOption[] = [
  { key: "month", label: "Month" },
  { key: "week", label: "Week" },
  { key: "day", label: "Day" },
  { key: "agenda", label: "Agenda" },
  { key: "timeline", label: "Timeline" },
  { key: "cardGrid", label: "Cards" },
];

const HyperEventsToolbar: React.FC<IHyperEventsToolbarProps> = function (props) {
  const dateLabel = formatDateRange(props.selectedDate, props.viewMode);

  // Navigation buttons
  const navSection = React.createElement(
    "div",
    { className: styles.hyperEventsToolbarNav },
    React.createElement(
      "button",
      {
        className: styles.hyperEventsToolbarNavButton,
        onClick: props.onNavigateBackward,
        "aria-label": "Previous",
        type: "button",
      },
      "\u2039" // ‹
    ),
    React.createElement(
      "button",
      {
        className: styles.hyperEventsToolbarNavButton,
        onClick: props.onNavigateToday,
        type: "button",
      },
      "Today"
    ),
    React.createElement(
      "button",
      {
        className: styles.hyperEventsToolbarNavButton,
        onClick: props.onNavigateForward,
        "aria-label": "Next",
        type: "button",
      },
      "\u203A" // ›
    )
  );

  // Date range label
  const dateLabelEl = React.createElement(
    "span",
    { className: styles.hyperEventsToolbarDateLabel, "aria-live": "polite" },
    dateLabel
  );

  // View mode buttons
  const viewButtons: React.ReactNode[] = [];
  VIEW_OPTIONS.forEach(function (opt) {
    const isActive = opt.key === props.viewMode;
    const className = styles.hyperEventsToolbarViewButton +
      (isActive ? " " + styles.hyperEventsToolbarViewButtonActive : "");
    viewButtons.push(
      React.createElement(
        "button",
        {
          key: opt.key,
          className: className,
          onClick: function () { props.onViewModeChange(opt.key); },
          role: "tab",
          "aria-selected": isActive,
          type: "button",
        },
        opt.label
      )
    );
  });

  const viewSection = React.createElement(
    "div",
    { className: styles.hyperEventsToolbarViewButtons, role: "tablist", "aria-label": "Calendar views" },
    viewButtons
  );

  return React.createElement(
    "div",
    { className: styles.hyperEventsToolbar },
    navSection,
    dateLabelEl,
    viewSection
  );
};

export default HyperEventsToolbar;
