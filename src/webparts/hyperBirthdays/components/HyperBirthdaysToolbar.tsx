import * as React from "react";
import { format } from "date-fns";
import type { BirthdaysViewMode } from "../models";
import styles from "./HyperBirthdaysToolbar.module.scss";

export interface IHyperBirthdaysToolbarProps {
  title: string;
  viewMode: BirthdaysViewMode;
  onViewModeChange: (mode: BirthdaysViewMode) => void;
  currentMonth: number;
  currentYear: number;
  onNavigateMonth: (direction: number) => void;
  showMonthNav: boolean;
}

const HyperBirthdaysToolbar: React.FC<IHyperBirthdaysToolbarProps> = function (props) {
  const monthDate = new Date(props.currentYear, props.currentMonth, 1);
  const monthLabel = format(monthDate, "MMMM yyyy");

  function makeViewButton(mode: BirthdaysViewMode, label: string): React.ReactNode {
    const isActive = props.viewMode === mode;
    const btnClass = isActive
      ? styles.viewButton + " " + styles.viewButtonActive
      : styles.viewButton;

    return React.createElement(
      "button",
      {
        key: mode,
        className: btnClass,
        onClick: function (): void { props.onViewModeChange(mode); },
        type: "button",
        "aria-pressed": isActive,
      },
      label
    );
  }

  const monthNav = props.showMonthNav
    ? React.createElement(
        "div",
        { className: styles.controls },
        React.createElement(
          "button",
          {
            className: styles.navButton,
            onClick: function (): void { props.onNavigateMonth(-1); },
            type: "button",
            "aria-label": "Previous month",
          },
          React.createElement("i", { className: "ms-Icon ms-Icon--ChevronLeft", "aria-hidden": "true" })
        ),
        React.createElement("span", { className: styles.monthLabel }, monthLabel),
        React.createElement(
          "button",
          {
            className: styles.navButton,
            onClick: function (): void { props.onNavigateMonth(1); },
            type: "button",
            "aria-label": "Next month",
          },
          React.createElement("i", { className: "ms-Icon ms-Icon--ChevronRight", "aria-hidden": "true" })
        )
      )
    : undefined;

  return React.createElement(
    "div",
    { className: styles.toolbar },
    React.createElement("h2", { className: styles.title }, props.title),
    React.createElement(
      "div",
      { className: styles.controls },
      makeViewButton("upcomingList", "List"),
      makeViewButton("monthlyCalendar", "Calendar"),
      makeViewButton("cardCarousel", "Carousel")
    ),
    monthNav
  );
};

export default HyperBirthdaysToolbar;
