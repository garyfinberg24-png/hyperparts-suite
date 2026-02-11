import * as React from "react";
import { useHyperChartsStore } from "../store/useHyperChartsStore";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

// ============================================================
// HyperCharts Demo Bar — Rich Panel (Variation 3)
// Collapsed by default: DEMO badge + title + summary + Customize + Exit
// Expanded: chip rows for Grid columns, Data Labels toggle, Refresh
// ============================================================

var GRID_OPTIONS: Array<{ cols: number; label: string }> = [
  { cols: 1, label: "1 Col" },
  { cols: 2, label: "2 Col" },
  { cols: 3, label: "3 Col" },
  { cols: 4, label: "4 Col" },
];

export interface IHyperChartsDemoBarProps {
  currentGridColumns: number;
  currentShowDataLabels: boolean;
  chartCount: number;
  onExitDemo: () => void;
}

var HyperChartsDemoBar: React.FC<IHyperChartsDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  var setDemoGridColumns = useHyperChartsStore(function (s) { return s.setDemoGridColumns; });
  var setDemoShowDataLabels = useHyperChartsStore(function (s) { return s.setDemoShowDataLabels; });
  var incrementRefreshTick = useHyperChartsStore(function (s) { return s.incrementRefreshTick; });

  // -- Build collapsed summary --
  var summary = props.currentGridColumns + " Col" +
    (props.currentShowDataLabels ? " | Labels On" : " | Labels Off");

  // -- Grid column chips --
  var gridChips: React.ReactNode[] = [];
  GRID_OPTIONS.forEach(function (opt) {
    var isActive = props.currentGridColumns === opt.cols;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    gridChips.push(
      React.createElement("button", {
        key: opt.cols,
        className: chipClass,
        type: "button",
        onClick: function (): void { setDemoGridColumns(opt.cols); },
        "aria-pressed": isActive ? "true" : "false",
      }, opt.label)
    );
  });

  // -- Data labels toggle chip --
  var labelsToggleClass = props.currentShowDataLabels
    ? styles.toggleChip + " " + styles.toggleChipActive
    : styles.toggleChip;
  var labelsDotClass = props.currentShowDataLabels
    ? styles.toggleDot + " " + styles.toggleDotActive
    : styles.toggleDot;

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
      React.createElement("span", { className: styles.wpName }, "HyperCharts Preview"),
      !isExpanded ? React.createElement("span", { className: styles.collapsedSummary }, summary) : undefined,
      React.createElement("span", { className: styles.itemCount },
        props.chartCount + " chart" + (props.chartCount !== 1 ? "s" : "")
      ),
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
        onClick: props.onExitDemo,
        "aria-label": "Exit demo mode",
      }, "\u2715 Exit Demo")
    ),

    // ---- Expandable panel ----
    React.createElement("div", { className: panelClass },
      // Layout row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Layout:"),
        React.createElement("div", { className: styles.chipGroup }, gridChips)
      ),

      // Data labels row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Options:"),
        React.createElement("div", { className: styles.chipGroup },
          React.createElement("button", {
            className: labelsToggleClass,
            type: "button",
            onClick: function (): void { setDemoShowDataLabels(!props.currentShowDataLabels); },
            "aria-pressed": props.currentShowDataLabels ? "true" : "false",
          },
            React.createElement("span", { className: labelsDotClass }),
            "Data Labels"
          ),
          React.createElement("button", {
            className: styles.chip,
            type: "button",
            onClick: function (): void { incrementRefreshTick(); },
          }, "\u21BB Refresh")
        )
      )
    )
  );
};

export default HyperChartsDemoBar;
