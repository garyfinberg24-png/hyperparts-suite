import * as React from "react";
import type { GoalDisplayStyle } from "../models";
import { getThresholdColor, parseThresholds, evaluateThreshold } from "../models";
import { formatChartValue } from "../utils/chartColors";
import HyperChartsCanvas from "./HyperChartsCanvas";
import styles from "./HyperChartsGoalMetric.module.scss";

export interface IHyperChartsGoalMetricProps {
  title: string;
  currentValue: number;
  goalValue: number;
  displayStyle: GoalDisplayStyle;
  thresholdsJson: string;
  enableConditionalColors: boolean;
}

/** Get fill color based on RAG or default theme */
function getFillColor(
  percentage: number,
  enableConditionalColors: boolean,
  thresholdsJson: string
): string {
  if (enableConditionalColors) {
    const thresholds = parseThresholds(thresholdsJson);
    const status = evaluateThreshold(percentage, thresholds);
    return getThresholdColor(status, thresholds);
  }
  return "#0078d4";
}

/** Progress bar sub-component */
interface IProgressBarProps {
  percentage: number;
  currentValue: number;
  goalValue: number;
  fillColor: string;
}

const ProgressBar: React.FC<IProgressBarProps> = function (pbProps) {
  const clampedPct = Math.min(100, Math.max(0, pbProps.percentage));

  return React.createElement(
    "div",
    { className: styles.progressContainer },
    React.createElement(
      "div",
      {
        className: styles.progressTrack,
        role: "progressbar",
        "aria-valuenow": Math.round(pbProps.percentage),
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-label": formatChartValue(pbProps.currentValue) + " of " + formatChartValue(pbProps.goalValue),
      },
      React.createElement("div", {
        className: styles.progressFill,
        style: {
          width: clampedPct + "%",
          backgroundColor: pbProps.fillColor,
        },
      })
    ),
    React.createElement(
      "div",
      { className: styles.progressLabel },
      formatChartValue(pbProps.currentValue) + " / " + formatChartValue(pbProps.goalValue) + " (" + Math.round(pbProps.percentage) + "%)"
    )
  );
};

/** Thermometer sub-component */
interface IThermometerProps {
  percentage: number;
  currentValue: number;
  goalValue: number;
  fillColor: string;
}

const Thermometer: React.FC<IThermometerProps> = function (tProps) {
  const clampedPct = Math.min(100, Math.max(0, tProps.percentage));

  return React.createElement(
    "div",
    { className: styles.thermoContainer },
    React.createElement(
      "div",
      {
        className: styles.thermoTrack,
        role: "meter",
        "aria-valuenow": Math.round(tProps.percentage),
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-label": formatChartValue(tProps.currentValue) + " of " + formatChartValue(tProps.goalValue),
      },
      React.createElement("div", {
        className: styles.thermoFill,
        style: {
          height: clampedPct + "%",
          backgroundColor: tProps.fillColor,
        },
      })
    ),
    React.createElement("div", {
      className: styles.thermoBulb,
      style: { backgroundColor: tProps.fillColor },
    }),
    React.createElement(
      "div",
      { className: styles.thermoValue },
      Math.round(tProps.percentage) + "%"
    )
  );
};

const HyperChartsGoalMetric: React.FC<IHyperChartsGoalMetricProps> = function (props) {
  const percentage = props.goalValue > 0 ? (props.currentValue / props.goalValue) * 100 : 0;
  const fillColor = getFillColor(percentage, props.enableConditionalColors, props.thresholdsJson);

  let content: React.ReactElement;

  if (props.displayStyle === "progress") {
    content = React.createElement(ProgressBar, {
      percentage: percentage,
      currentValue: props.currentValue,
      goalValue: props.goalValue,
      fillColor: fillColor,
    });
  } else if (props.displayStyle === "thermometer") {
    content = React.createElement(Thermometer, {
      percentage: percentage,
      currentValue: props.currentValue,
      goalValue: props.goalValue,
      fillColor: fillColor,
    });
  } else {
    // Gauge - rendered via HyperChartsCanvas
    content = React.createElement(
      "div",
      { className: styles.gaugeContainer },
      React.createElement(HyperChartsCanvas, {
        chartKind: "gauge",
        labels: ["Actual"],
        datasets: [{
          label: "Goal Progress",
          data: [Math.min(100, percentage)],
          backgroundColor: [fillColor],
        }],
        showLegend: false,
        animate: true,
        ariaLabel: props.title + ": " + Math.round(percentage) + "% of goal",
      })
    );
  }

  return React.createElement(
    "div",
    { className: styles.goalMetric },
    React.createElement("h3", { className: styles.goalTitle }, props.title),
    content,
    React.createElement(
      "div",
      { className: styles.goalSummary },
      formatChartValue(props.currentValue) + " of " + formatChartValue(props.goalValue) + " (" + Math.round(percentage) + "%)"
    )
  );
};

export default HyperChartsGoalMetric;
