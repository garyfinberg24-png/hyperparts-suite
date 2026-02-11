import * as React from "react";
import { useHyperEventsStore } from "../store/useHyperEventsStore";
import type { HyperEventsViewMode } from "../models";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

/* -- Quick-pick options for each category -- */

var DEMO_VIEWS: Array<{ key: HyperEventsViewMode; label: string }> = [
  { key: "month", label: "Month" },
  { key: "week", label: "Week" },
  { key: "day", label: "Day" },
  { key: "agenda", label: "Agenda" },
  { key: "timeline", label: "Timeline" },
  { key: "cardGrid", label: "Card Grid" },
];

var DEMO_FEATURE_TOGGLES: Array<{ key: string; label: string }> = [
  { key: "rsvp", label: "RSVP" },
  { key: "categories", label: "Categories" },
  { key: "overlay", label: "Overlay" },
  { key: "registration", label: "Registration" },
  { key: "countdown", label: "Countdown" },
  { key: "location", label: "Location" },
  { key: "teams", label: "Teams Links" },
];

function getViewLabel(key: HyperEventsViewMode): string {
  var label = "";
  DEMO_VIEWS.forEach(function (item) {
    if (item.key === key) { label = item.label; }
  });
  return label || String(key);
}

/* -- Main Component -- */

var HyperEventsDemoBar: React.FC = function () {
  var demoViewMode = useHyperEventsStore(function (s) { return s.demoViewMode; });
  var demoFeatureToggles = useHyperEventsStore(function (s) { return s.demoFeatureToggles; });
  var setDemoViewMode = useHyperEventsStore(function (s) { return s.setDemoViewMode; });
  var toggleDemoFeature = useHyperEventsStore(function (s) { return s.toggleDemoFeature; });
  var resetDemo = useHyperEventsStore(function (s) { return s.resetDemo; });

  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // -- Build collapsed summary --
  var activeFeatures: string[] = [];
  DEMO_FEATURE_TOGGLES.forEach(function (item) {
    if (demoFeatureToggles[item.key] !== false) {
      activeFeatures.push(item.label);
    }
  });
  var summary = (demoViewMode ? getViewLabel(demoViewMode) : "Default") +
    " | " + activeFeatures.length + " features on";

  // -- View mode chips --
  var viewChips: React.ReactNode[] = [];
  DEMO_VIEWS.forEach(function (item) {
    var isActive = demoViewMode === item.key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    viewChips.push(
      React.createElement("button", {
        key: item.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { setDemoViewMode(item.key as HyperEventsViewMode); },
        "aria-pressed": isActive ? "true" : "false",
      }, item.label)
    );
  });

  // -- Feature toggle chips --
  var toggleChips: React.ReactNode[] = [];
  DEMO_FEATURE_TOGGLES.forEach(function (item) {
    var isActive = demoFeatureToggles[item.key] !== false;
    var chipClass = isActive
      ? styles.toggleChip + " " + styles.toggleChipActive
      : styles.toggleChip;
    var dotClass = isActive
      ? styles.toggleDot + " " + styles.toggleDotActive
      : styles.toggleDot;

    toggleChips.push(
      React.createElement("button", {
        key: item.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { toggleDemoFeature(item.key); },
        "aria-pressed": isActive ? "true" : "false",
      },
        React.createElement("span", { className: dotClass }),
        item.label
      )
    );
  });

  // -- Expanded panel class --
  var panelClass = isExpanded
    ? styles.expandPanel + " " + styles.expandPanelOpen
    : styles.expandPanel;

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  },
    // ---- Header row (always visible) ----
    React.createElement("div", { className: styles.headerRow },
      React.createElement("span", { className: styles.demoBadge }, "DEMO"),
      React.createElement("span", { className: styles.wpName }, "HyperEvents Preview"),
      !isExpanded ? React.createElement("span", { className: styles.collapsedSummary }, summary) : undefined,
      React.createElement("span", { className: styles.spacer }),
      React.createElement("button", {
        className: styles.expandToggle,
        type: "button",
        onClick: function (): void { setExpanded(!isExpanded); },
        "aria-expanded": isExpanded ? "true" : "false",
      },
        isExpanded ? "Collapse" : "Customize",
        React.createElement("span", {
          className: styles.chevron + (isExpanded ? " " + styles.chevronExpanded : ""),
        }, "\u25BC")
      ),
      React.createElement("button", {
        className: styles.exitButton,
        type: "button",
        onClick: function (): void { resetDemo(); },
        "aria-label": "Exit demo mode",
      }, "\u2715 Exit Demo")
    ),

    // ---- Expandable panel ----
    React.createElement("div", { className: panelClass },
      // View mode row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "View:"),
        React.createElement("div", { className: styles.chipGroup }, viewChips)
      ),

      // Feature toggles row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Features:"),
        React.createElement("div", { className: styles.chipGroup }, toggleChips)
      )
    )
  );
};

export default HyperEventsDemoBar;
