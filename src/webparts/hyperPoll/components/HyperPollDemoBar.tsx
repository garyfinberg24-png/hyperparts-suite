import * as React from "react";
import type { ChartType } from "../models/IPollResults";
import type { PollLayout } from "../models/IHyperPollWizardState";
import styles from "./HyperPollDemoBar.module.scss";

// ============================================================
// HyperPoll Demo Bar — Control panel for live demos
// Appears below the toolbar when enableDemoMode is true
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

var HyperPollDemoBar: React.FC<IHyperPollDemoBarProps> = function (props) {
  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo controls",
  },
    // Label
    React.createElement("span", { className: styles.demoBarLabel }, "DEMO"),

    // Chart type
    React.createElement("div", { className: styles.demoBarGroup },
      React.createElement("span", { className: styles.demoBarGroupLabel }, "Chart"),
      React.createElement("div", { className: styles.demoBarButtons },
        CHART_OPTIONS.map(function (ct) {
          return React.createElement("button", {
            key: ct.key,
            className: props.chartType === ct.key ? styles.demoBarBtnActive : styles.demoBarBtn,
            onClick: function () { props.onChartTypeChange(ct.key); },
            type: "button",
          }, ct.label);
        })
      )
    ),

    // Layout
    React.createElement("div", { className: styles.demoBarGroup },
      React.createElement("span", { className: styles.demoBarGroupLabel }, "Layout"),
      React.createElement("div", { className: styles.demoBarButtons },
        LAYOUT_OPTIONS.map(function (lo) {
          return React.createElement("button", {
            key: lo.key,
            className: props.layout === lo.key ? styles.demoBarBtnActive : styles.demoBarBtn,
            onClick: function () { props.onLayoutChange(lo.key); },
            type: "button",
          }, lo.label);
        })
      )
    ),

    // Toggles
    React.createElement("div", { className: styles.demoBarGroup },
      React.createElement("button", {
        className: props.confettiEnabled ? styles.demoBarBtnActive : styles.demoBarBtn,
        onClick: props.onToggleConfetti,
        type: "button",
      }, "\uD83C\uDF89 Confetti"),
      React.createElement("button", {
        className: props.isQuizMode ? styles.demoBarBtnActive : styles.demoBarBtn,
        onClick: props.onToggleQuizMode,
        type: "button",
      }, "\uD83E\uDDE0 Quiz"),
      React.createElement("button", {
        className: props.useSampleData ? styles.demoBarBtnActive : styles.demoBarBtn,
        onClick: props.onToggleSampleData,
        type: "button",
      }, "\uD83D\uDCE6 Sample")
    ),

    // Actions
    React.createElement("button", {
      className: styles.demoBarResetBtn,
      onClick: props.onResetVotes,
      type: "button",
    }, "\uD83D\uDD04 Reset")
  );
};

export default HyperPollDemoBar;
