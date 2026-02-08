import * as React from "react";
import type { TrendDirection, RagStatus } from "../models";
import { formatChartValue } from "../utils/chartColors";
import styles from "./HyperChartsKpiCard.module.scss";

export interface IHyperChartsKpiCardProps {
  title: string;
  value: number;
  trend: TrendDirection;
  trendValue: number | undefined;
  showTrend: boolean;
  showSparkline: boolean;
  sparklineData: number[];
  ragStatus: RagStatus;
  onClick?: () => void;
}

/** Build SVG sparkline points from data */
function buildSparklinePoints(data: number[]): string {
  if (data.length < 2) return "";
  let min = data[0];
  let max = data[0];
  data.forEach(function (v) {
    if (v < min) min = v;
    if (v > max) max = v;
  });
  const range = max - min || 1;
  const points: string[] = [];
  data.forEach(function (v, i) {
    const x = (i / (data.length - 1)) * 80;
    const y = 24 - ((v - min) / range) * 20 - 2;
    points.push(x + "," + y);
  });
  return points.join(" ");
}

/** Trend arrow character */
function getTrendArrow(direction: TrendDirection): string {
  switch (direction) {
    case "up": return "\u2191";
    case "down": return "\u2193";
    case "flat": return "\u2192";
    default: return "";
  }
}

/** Trend CSS class */
function getTrendClass(direction: TrendDirection): string {
  switch (direction) {
    case "up": return styles.trendUp;
    case "down": return styles.trendDown;
    case "flat": return styles.trendFlat;
    default: return styles.trendFlat;
  }
}

/** RAG CSS class */
function getRagClass(status: RagStatus): string {
  switch (status) {
    case "red": return styles.ragRed;
    case "amber": return styles.ragAmber;
    case "green": return styles.ragGreen;
    default: return "";
  }
}

const HyperChartsKpiCard: React.FC<IHyperChartsKpiCardProps> = function (props) {
  const cardClass = styles.kpiCard + (getRagClass(props.ragStatus) ? " " + getRagClass(props.ragStatus) : "");

  const ariaLabel = props.title + ": " + formatChartValue(props.value) +
    (props.showTrend && props.trendValue !== undefined ? ", trend " + props.trend + " " + formatChartValue(props.trendValue) : "");

  const children: React.ReactNode[] = [];

  // Title
  children.push(
    React.createElement("div", { key: "title", className: styles.kpiTitle }, props.title)
  );

  // Value
  children.push(
    React.createElement("div", { key: "value", className: styles.kpiValue }, formatChartValue(props.value))
  );

  // Trend
  if (props.showTrend && props.trendValue !== undefined) {
    children.push(
      React.createElement(
        "div",
        { key: "trend", className: styles.trendRow },
        React.createElement("span", { className: getTrendClass(props.trend) },
          getTrendArrow(props.trend) + " " + formatChartValue(props.trendValue) + "%"
        )
      )
    );
  }

  // Sparkline
  if (props.showSparkline && props.sparklineData.length >= 2) {
    const points = buildSparklinePoints(props.sparklineData);
    children.push(
      React.createElement(
        "div",
        { key: "sparkline", className: styles.sparklineRow },
        React.createElement(
          "svg",
          {
            className: styles.sparklineSvg,
            viewBox: "0 0 80 24",
            "aria-hidden": "true",
          },
          React.createElement("polyline", {
            points: points,
            className: styles.sparklineLine,
          })
        )
      )
    );
  }

  return React.createElement(
    "div",
    {
      className: cardClass,
      role: "status",
      "aria-label": ariaLabel,
      tabIndex: props.onClick ? 0 : undefined,
      onClick: props.onClick,
      onKeyDown: props.onClick ? function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (props.onClick) props.onClick();
        }
      } : undefined,
    },
    children
  );
};

export default HyperChartsKpiCard;
