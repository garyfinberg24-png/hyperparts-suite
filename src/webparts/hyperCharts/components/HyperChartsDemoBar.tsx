import * as React from "react";
import { useHyperChartsStore } from "../store/useHyperChartsStore";
import styles from "./HyperChartsDemoBar.module.scss";

// ============================================================
// HyperCharts Demo Bar
// Displayed when demoMode = true, provides interactive controls
// ============================================================

var GRID_OPTIONS: Array<{ cols: number; label: string }> = [
  { cols: 1, label: "1 Col" },
  { cols: 2, label: "2 Col" },
  { cols: 3, label: "3 Col" },
  { cols: 4, label: "4 Col" },
];

var HyperChartsDemoBar: React.FC = function () {
  var demoGridColumns = useHyperChartsStore(function (s) { return s.demoGridColumns; });
  var setDemoGridColumns = useHyperChartsStore(function (s) { return s.setDemoGridColumns; });
  var demoShowDataLabels = useHyperChartsStore(function (s) { return s.demoShowDataLabels; });
  var setDemoShowDataLabels = useHyperChartsStore(function (s) { return s.setDemoShowDataLabels; });
  var incrementRefreshTick = useHyperChartsStore(function (s) { return s.incrementRefreshTick; });

  var gridButtons = GRID_OPTIONS.map(function (opt) {
    var isActive = demoGridColumns === opt.cols;
    return React.createElement("button", {
      key: opt.cols,
      className: isActive ? styles.demoGridBtnActive : styles.demoGridBtn,
      onClick: function () { setDemoGridColumns(opt.cols); },
      type: "button",
      "aria-pressed": isActive,
    }, opt.label);
  });

  return React.createElement("div", { className: styles.demoBar, role: "toolbar", "aria-label": "Demo controls" },
    React.createElement("span", { className: styles.demoLabel }, "\uD83D\uDCCA Demo Mode"),
    React.createElement("span", { className: styles.demoDivider }),

    // Grid column switcher
    React.createElement("span", { className: styles.demoGroupLabel }, "Layout:"),
    React.createElement("div", { className: styles.demoGridGroup }, gridButtons),
    React.createElement("span", { className: styles.demoDivider }),

    // Data labels toggle
    React.createElement("label", { className: styles.demoToggle },
      React.createElement("input", {
        type: "checkbox",
        checked: demoShowDataLabels,
        onChange: function () { setDemoShowDataLabels(!demoShowDataLabels); },
      }),
      " Data Labels"
    ),
    React.createElement("span", { className: styles.demoDivider }),

    // Refresh button
    React.createElement("button", {
      className: styles.demoRefreshBtn,
      onClick: function () { incrementRefreshTick(); },
      type: "button",
    }, "\u21BB Refresh")
  );
};

export default HyperChartsDemoBar;
