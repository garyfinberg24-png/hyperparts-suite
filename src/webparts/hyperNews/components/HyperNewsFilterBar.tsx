import * as React from "react";
import type { IFilterConfig, DateRangeType } from "../models";
import styles from "./HyperNewsFilterBar.module.scss";

export interface IHyperNewsFilterBarProps {
  filterConfig: IFilterConfig;
  activeFilterCount: number;
  onClearFilters: () => void;
}

/** Human-readable labels for date range values */
const DATE_RANGE_LABELS: Record<DateRangeType, string> = {
  all: "All time",
  today: "Today",
  week: "Past week",
  month: "Past month",
  quarter: "Past 3 months",
  year: "Past year",
  custom: "Custom range",
};

const HyperNewsFilterBarInner: React.FC<IHyperNewsFilterBarProps> = (props) => {
  const { filterConfig, activeFilterCount, onClearFilters } = props;

  if (!filterConfig.enabled || activeFilterCount === 0) {
    return React.createElement(React.Fragment);
  }

  const chips: React.ReactElement[] = [];

  // Category chips
  if (filterConfig.categories.length > 0) {
    filterConfig.categories.forEach((cat, idx) => {
      chips.push(
        React.createElement(
          "span",
          { key: "cat-" + String(idx), className: styles.filterChip },
          cat
        )
      );
    });
  }

  // Author chips
  if (filterConfig.authors.length > 0) {
    filterConfig.authors.forEach((author, idx) => {
      chips.push(
        React.createElement(
          "span",
          { key: "author-" + String(idx), className: styles.filterChip },
          author
        )
      );
    });
  }

  // Date range chip
  if (filterConfig.dateRange !== "all") {
    chips.push(
      React.createElement(
        "span",
        { key: "date", className: styles.filterChip },
        DATE_RANGE_LABELS[filterConfig.dateRange]
      )
    );
  }

  return React.createElement(
    "div",
    {
      className: styles.filterBar,
      role: "toolbar",
      "aria-label": "Active filters",
    },
    React.createElement(
      "span",
      { className: styles.filterLabel },
      "Filters (" + String(activeFilterCount) + "):"
    ),
    React.createElement(
      "div",
      { className: styles.chipsContainer },
      chips
    ),
    React.createElement(
      "button",
      {
        className: styles.clearButton,
        onClick: onClearFilters,
        type: "button",
        "aria-label": "Clear all filters",
      },
      "Clear all"
    )
  );
};

export const HyperNewsFilterBar = React.memo(HyperNewsFilterBarInner);
