import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IBirthdaysWizardState } from "../../models/IHyperBirthdaysWizardState";
import type { BirthdaysViewMode, BirthdaysTimeRange } from "../../models";
import styles from "./WizardSteps.module.scss";

// Layout options with icons and descriptions
var VIEW_MODES: Array<{ key: BirthdaysViewMode; icon: string; name: string; description: string }> = [
  {
    key: "upcomingList",
    icon: "\uD83D\uDCCB",
    name: "Upcoming List",
    description: "Grouped sections: Today, This Week, This Month",
  },
  {
    key: "monthlyCalendar",
    icon: "\uD83D\uDCC5",
    name: "Month Calendar",
    description: "7\u00D76 grid with emoji dots on celebration days",
  },
  {
    key: "cardCarousel",
    icon: "\uD83C\uDFA0",
    name: "Card Carousel",
    description: "Horizontal scroll with navigation arrows",
  },
];

var TIME_RANGES: Array<{ key: BirthdaysTimeRange; label: string }> = [
  { key: "thisWeek", label: "This Week" },
  { key: "thisMonth", label: "This Month" },
  { key: "thisQuarter", label: "This Quarter" },
];

var LayoutStep: React.FC<IWizardStepProps<IBirthdaysWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleViewModeChange = React.useCallback(function (mode: BirthdaysViewMode): void {
    onChange({
      layout: Object.assign({}, state.layout, { viewMode: mode }),
    });
  }, [state.layout, onChange]);

  var handleTimeRangeChange = React.useCallback(function (e: React.ChangeEvent<HTMLSelectElement>): void {
    onChange({
      layout: Object.assign({}, state.layout, { timeRange: e.target.value as BirthdaysTimeRange }),
    });
  }, [state.layout, onChange]);

  var handleMaxItemsChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    onChange({
      layout: Object.assign({}, state.layout, { maxItems: parseInt(e.target.value, 10) || 50 }),
    });
  }, [state.layout, onChange]);

  var handlePhotoSizeChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    onChange({
      layout: Object.assign({}, state.layout, { photoSize: parseInt(e.target.value, 10) || 48 }),
    });
  }, [state.layout, onChange]);

  // Layout cards
  var layoutCards: React.ReactElement[] = [];
  VIEW_MODES.forEach(function (mode) {
    var isSelected = state.layout.viewMode === mode.key;
    layoutCards.push(
      React.createElement("div", {
        key: mode.key,
        className: isSelected ? styles.layoutCardSelected : styles.layoutCard,
        onClick: function () { handleViewModeChange(mode.key); },
        role: "radio",
        "aria-checked": String(isSelected),
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent): void {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleViewModeChange(mode.key);
          }
        },
      },
        React.createElement("span", { className: styles.layoutCardIcon }, mode.icon),
        React.createElement("span", { className: styles.layoutCardName }, mode.name),
        React.createElement("span", { className: styles.layoutCardDesc }, mode.description)
      )
    );
  });

  // Time range options
  var timeRangeOptions: React.ReactElement[] = [];
  TIME_RANGES.forEach(function (range) {
    timeRangeOptions.push(
      React.createElement("option", { key: range.key, value: range.key }, range.label)
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    // Layout picker
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "View Mode"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Users can switch between views using the toolbar buttons."
      )
    ),
    React.createElement("div", { className: styles.layoutGrid, role: "radiogroup", "aria-label": "View mode" },
      layoutCards
    ),

    // Time range
    React.createElement("div", { className: styles.inputRow },
      React.createElement("label", { className: styles.inputLabel, htmlFor: "timeRange" }, "Default Time Range"),
      React.createElement("select", {
        id: "timeRange",
        className: styles.selectInput,
        value: state.layout.timeRange,
        onChange: handleTimeRangeChange,
      }, timeRangeOptions)
    ),

    // Max items slider
    React.createElement("div", { className: styles.sliderRow },
      React.createElement("span", { className: styles.sliderLabel }, "Max Items"),
      React.createElement("input", {
        type: "range",
        className: styles.sliderInput,
        min: 10,
        max: 200,
        step: 10,
        value: state.layout.maxItems,
        onChange: handleMaxItemsChange,
        "aria-label": "Maximum items to display",
      }),
      React.createElement("span", { className: styles.sliderValue }, String(state.layout.maxItems))
    ),

    // Photo size slider
    React.createElement("div", { className: styles.sliderRow },
      React.createElement("span", { className: styles.sliderLabel }, "Photo Size"),
      React.createElement("input", {
        type: "range",
        className: styles.sliderInput,
        min: 24,
        max: 120,
        step: 8,
        value: state.layout.photoSize,
        onChange: handlePhotoSizeChange,
        "aria-label": "Profile photo size in pixels",
      }),
      React.createElement("span", { className: styles.sliderValue }, state.layout.photoSize + "px")
    )
  );
};

export default LayoutStep;
