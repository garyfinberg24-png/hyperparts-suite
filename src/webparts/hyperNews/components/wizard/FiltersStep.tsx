import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { INewsWizardState } from "../../models/IHyperNewsWizardState";
import type { DateRangeType } from "../../models/IHyperNewsFilter";
import styles from "./WizardSteps.module.scss";

// ============================================================
// FiltersStep — Filter bar configuration
// ============================================================

var DATE_RANGE_OPTIONS: Array<{ key: DateRangeType; label: string }> = [
  { key: "all", label: "All Time" },
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "quarter", label: "This Quarter" },
  { key: "year", label: "This Year" },
];

var FiltersStep: React.FC<IWizardStepProps<INewsWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;
  var filters = state.filterPresets;

  var handleEnableToggle = React.useCallback(function (): void {
    onChange({
      filterPresets: {
        enableFilters: !filters.enableFilters,
        defaultDateRange: filters.defaultDateRange,
        categoryPresets: filters.categoryPresets,
        authorPresets: filters.authorPresets,
      },
    });
  }, [onChange, filters]);

  var handleDateRange = React.useCallback(function (e: React.ChangeEvent<HTMLSelectElement>): void {
    onChange({
      filterPresets: {
        enableFilters: filters.enableFilters,
        defaultDateRange: e.target.value as DateRangeType,
        categoryPresets: filters.categoryPresets,
        authorPresets: filters.authorPresets,
      },
    });
  }, [onChange, filters]);

  var handleCategories = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    onChange({
      filterPresets: {
        enableFilters: filters.enableFilters,
        defaultDateRange: filters.defaultDateRange,
        categoryPresets: e.target.value,
        authorPresets: filters.authorPresets,
      },
    });
  }, [onChange, filters]);

  var handleAuthors = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    onChange({
      filterPresets: {
        enableFilters: filters.enableFilters,
        defaultDateRange: filters.defaultDateRange,
        categoryPresets: filters.categoryPresets,
        authorPresets: e.target.value,
      },
    });
  }, [onChange, filters]);

  // Date range dropdown options
  var dateOptions: React.ReactElement[] = [];
  DATE_RANGE_OPTIONS.forEach(function (opt) {
    dateOptions.push(
      React.createElement("option", { key: opt.key, value: opt.key }, opt.label)
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    // Enable filters toggle
    React.createElement("label", { className: styles.toggleRow },
      React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, "\uD83D\uDD0D"),
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, "Enable Filter Bar"),
        React.createElement("span", { className: styles.toggleDesc }, "Show a filter bar above articles for category, author, and date filtering")
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          type: "checkbox",
          className: styles.toggleInput,
          checked: filters.enableFilters,
          onChange: handleEnableToggle,
          "aria-label": "Enable filter bar",
        }),
        React.createElement("span", { className: styles.toggleTrack },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    ),

    // Conditional filter options (only when enabled)
    filters.enableFilters
      ? React.createElement(React.Fragment, undefined,
          // Default date range
          React.createElement("div", { className: styles.inputRow },
            React.createElement("label", { className: styles.inputLabel }, "Default Date Range"),
            React.createElement("select", {
              className: styles.selectInput,
              value: filters.defaultDateRange,
              onChange: handleDateRange,
              "aria-label": "Default date range",
            }, dateOptions)
          ),

          // Category presets
          React.createElement("div", { className: styles.inputRow },
            React.createElement("label", { className: styles.inputLabel }, "Category Presets"),
            React.createElement("span", { className: styles.inputHint }, "Comma-separated list of categories to show in the filter dropdown"),
            React.createElement("input", {
              type: "text",
              className: styles.textInput,
              value: filters.categoryPresets,
              onChange: handleCategories,
              placeholder: "e.g. Company News, Product Updates, Events",
              "aria-label": "Category presets",
            })
          ),

          // Author presets
          React.createElement("div", { className: styles.inputRow },
            React.createElement("label", { className: styles.inputLabel }, "Author Presets"),
            React.createElement("span", { className: styles.inputHint }, "Comma-separated list of author names for the filter dropdown"),
            React.createElement("input", {
              type: "text",
              className: styles.textInput,
              value: filters.authorPresets,
              onChange: handleAuthors,
              placeholder: "e.g. Communications, HR, IT Department",
              "aria-label": "Author presets",
            })
          )
        )
      : React.createElement("div", { className: styles.stepSectionHint },
          "Filters are disabled. Users will see all articles without filtering options."
        )
  );
};

export default FiltersStep;
