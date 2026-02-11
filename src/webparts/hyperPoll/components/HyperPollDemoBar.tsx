import * as React from "react";
import type { ChartType } from "../models/IPollResults";
import type { PollLayout } from "../models/IHyperPollWizardState";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

// ============================================================
// HyperPoll Demo Bar -- Rich Panel (Variation 3)
// Collapsed by default: slim bar with DEMO badge + title +
// summary + Customize + Exit Demo.
// Expands on click: reveals chip sections for all options.
// ============================================================

export interface IHyperPollDemoBarProps {
  /** Current chart type */
  chartType: ChartType;
  /** Current layout */
  layout: PollLayout;
  /** Whether confetti is enabled */
  confettiEnabled: boolean;
  /** Whether quiz mode is active */
  isQuizMode: boolean;
  /** Whether sample data is active */
  useSampleData: boolean;
  /** Callback: chart type change */
  onChartTypeChange: (chartType: ChartType) => void;
  /** Callback: layout change */
  onLayoutChange: (layout: PollLayout) => void;
  /** Callback: toggle confetti */
  onToggleConfetti: () => void;
  /** Callback: toggle quiz mode */
  onToggleQuizMode: () => void;
  /** Callback: reset votes (sample data reload) */
  onResetVotes: () => void;
  /** Callback: toggle sample data */
  onToggleSampleData: () => void;
  /** Callback: exit demo mode */
  onExitDemo?: () => void;
}

var CHART_OPTIONS: Array<{ key: ChartType; label: string }> = [
  { key: "bar", label: "Bar" },
  { key: "pie", label: "Pie" },
  { key: "donut", label: "Donut" },
];

var LAYOUT_OPTIONS: Array<{ key: PollLayout; label: string }> = [
  { key: "card", label: "Card" },
  { key: "carousel", label: "Carousel" },
  { key: "stacked", label: "Stacked" },
  { key: "compact", label: "Compact" },
  { key: "slideshow", label: "Slideshow" },
];

function getChartLabel(key: ChartType): string {
  var label = "";
  CHART_OPTIONS.forEach(function (item) {
    if (item.key === key) { label = item.label; }
  });
  return label || String(key);
}

function getLayoutLabel(key: PollLayout): string {
  var label = "";
  LAYOUT_OPTIONS.forEach(function (item) {
    if (item.key === key) { label = item.label; }
  });
  return label || String(key);
}

var HyperPollDemoBar: React.FC<IHyperPollDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // -- Build collapsed summary --
  var summary = getChartLabel(props.chartType) + " chart" +
    " | " + getLayoutLabel(props.layout);

  // -- Chart type chips --
  var chartChips: React.ReactNode[] = [];
  CHART_OPTIONS.forEach(function (item) {
    var isActive = props.chartType === item.key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    chartChips.push(
      React.createElement("button", {
        key: item.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onChartTypeChange(item.key); },
        "aria-pressed": isActive ? "true" : "false",
      }, item.label)
    );
  });

  // -- Layout chips --
  var layoutChips: React.ReactNode[] = [];
  LAYOUT_OPTIONS.forEach(function (item) {
    var isActive = props.layout === item.key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    layoutChips.push(
      React.createElement("button", {
        key: item.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onLayoutChange(item.key); },
        "aria-pressed": isActive ? "true" : "false",
      }, item.label)
    );
  });

  // -- Feature toggle chips --
  var featureToggles: Array<{ label: string; active: boolean; onToggle: () => void }> = [
    { label: "Confetti", active: props.confettiEnabled, onToggle: props.onToggleConfetti },
    { label: "Quiz Mode", active: props.isQuizMode, onToggle: props.onToggleQuizMode },
    { label: "Sample Data", active: props.useSampleData, onToggle: props.onToggleSampleData },
  ];

  var toggleChips: React.ReactNode[] = [];
  featureToggles.forEach(function (toggle) {
    var chipClass = toggle.active
      ? styles.toggleChip + " " + styles.toggleChipActive
      : styles.toggleChip;
    var dotClass = toggle.active
      ? styles.toggleDot + " " + styles.toggleDotActive
      : styles.toggleDot;

    toggleChips.push(
      React.createElement("button", {
        key: toggle.label,
        className: chipClass,
        type: "button",
        onClick: toggle.onToggle,
        "aria-pressed": toggle.active ? "true" : "false",
      },
        React.createElement("span", { className: dotClass }),
        toggle.label
      )
    );
  });

  // -- Reset chip --
  var resetChip = React.createElement("button", {
    key: "reset",
    className: styles.chip,
    type: "button",
    onClick: props.onResetVotes,
  }, "Reset Votes");

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
      React.createElement("span", { className: styles.wpName }, "HyperPoll Preview"),
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
        onClick: function (): void { if (props.onExitDemo) { props.onExitDemo(); } },
        "aria-label": "Exit demo mode",
      }, "\u2715 Exit Demo")
    ),

    // ---- Expandable panel ----
    React.createElement("div", { className: panelClass },
      // Chart type row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Chart:"),
        React.createElement("div", { className: styles.chipGroup }, chartChips)
      ),

      // Layout row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Layout:"),
        React.createElement("div", { className: styles.chipGroup }, layoutChips)
      ),

      // Features row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Features:"),
        React.createElement("div", { className: styles.chipGroup }, toggleChips)
      ),

      // Actions row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Actions:"),
        React.createElement("div", { className: styles.chipGroup }, resetChip)
      )
    )
  );
};

export default HyperPollDemoBar;
