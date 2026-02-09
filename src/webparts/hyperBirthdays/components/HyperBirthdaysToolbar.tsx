import * as React from "react";
import { format } from "date-fns";
import type { BirthdaysViewMode } from "../models";
import { getViewModeDisplayName } from "../models";
import styles from "./HyperBirthdaysToolbar.module.scss";

export interface IHyperBirthdaysToolbarProps {
  title: string;
  viewMode: BirthdaysViewMode;
  onViewModeChange: (mode: BirthdaysViewMode) => void;
  currentMonth: number;
  currentYear: number;
  onNavigateMonth: (direction: number) => void;
  showMonthNav: boolean;
  isEditMode?: boolean;
  onConfigure?: () => void;
}

var VIEW_MODE_OPTIONS: Array<{ key: BirthdaysViewMode; icon: string }> = [
  { key: "upcomingList", icon: "\uD83D\uDCCB" },
  { key: "monthlyCalendar", icon: "\uD83D\uDCC5" },
  { key: "cardCarousel", icon: "\uD83C\uDFA0" },
  { key: "timeline", icon: "\u23F3" },
  { key: "featuredSpotlight", icon: "\u2B50" },
  { key: "masonryWall", icon: "\uD83E\uDDF1" },
  { key: "compactStrip", icon: "\uD83D\uDC65" },
  { key: "cardGrid", icon: "\uD83D\uDD33" },
];

const HyperBirthdaysToolbar: React.FC<IHyperBirthdaysToolbarProps> = function (props) {
  const monthDate = new Date(props.currentYear, props.currentMonth, 1);
  const monthLabel = format(monthDate, "MMMM yyyy");

  var handleViewChange = React.useCallback(function (e: React.ChangeEvent<HTMLSelectElement>): void {
    props.onViewModeChange(e.target.value as BirthdaysViewMode);
  }, [props.onViewModeChange]);

  // View mode dropdown options
  var viewOptions: React.ReactElement[] = [];
  VIEW_MODE_OPTIONS.forEach(function (opt) {
    viewOptions.push(
      React.createElement("option", {
        key: opt.key,
        value: opt.key,
      }, opt.icon + " " + getViewModeDisplayName(opt.key))
    );
  });

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

  var configureButton = props.isEditMode && props.onConfigure
    ? React.createElement(
        "button",
        {
          className: styles.configureButton,
          onClick: props.onConfigure,
          type: "button",
          "aria-label": "Configure celebrations",
        },
        React.createElement("i", { className: "ms-Icon ms-Icon--Settings", "aria-hidden": "true" }),
        " Configure"
      )
    : undefined;

  return React.createElement(
    "div",
    { className: styles.toolbar },
    React.createElement("h2", { className: styles.title }, props.title),
    React.createElement(
      "div",
      { className: styles.controls },
      React.createElement("select", {
        className: styles.viewSelect,
        value: props.viewMode,
        onChange: handleViewChange,
        "aria-label": "Select view mode",
      }, viewOptions)
    ),
    monthNav,
    configureButton
  );
};

export default HyperBirthdaysToolbar;
