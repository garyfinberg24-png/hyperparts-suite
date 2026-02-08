import * as React from "react";
import type { IChartData } from "../../models";
import { formatPercentage } from "../../utils/chartUtils";
import styles from "./PieChart.module.scss";

export interface IPieChartProps {
  data: IChartData[];
  ariaLabel: string;
}

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PieChart: React.FC<IPieChartProps> = function (props) {
  let cumulativePercentage = 0;
  const segments: React.ReactElement[] = [];
  const legendItems: React.ReactElement[] = [];

  props.data.forEach(function (item, idx) {
    const dashArray = (item.percentage / 100) * CIRCUMFERENCE;
    const dashOffset = -(cumulativePercentage / 100) * CIRCUMFERENCE;

    segments.push(
      React.createElement("circle", {
        key: idx,
        className: styles.pieSegment,
        cx: 100,
        cy: 100,
        r: RADIUS,
        fill: "none",
        stroke: item.color,
        strokeWidth: 40,
        strokeDasharray: dashArray + " " + CIRCUMFERENCE,
        strokeDashoffset: dashOffset,
        transform: "rotate(-90 100 100)",
      })
    );

    legendItems.push(
      React.createElement(
        "div",
        { key: idx, className: styles.pieLegendItem },
        React.createElement("div", {
          className: styles.pieLegendDot,
          style: { backgroundColor: item.color },
        }),
        React.createElement("span", undefined, item.label + ": " + item.value + " (" + formatPercentage(item.percentage) + ")")
      )
    );

    cumulativePercentage += item.percentage;
  });

  return React.createElement(
    "div",
    {
      className: styles.pieChart,
      role: "img",
      "aria-label": props.ariaLabel,
    },
    React.createElement(
      "svg",
      { className: styles.pieSvg, viewBox: "0 0 200 200" },
      segments
    ),
    React.createElement("div", { className: styles.pieLegend }, legendItems)
  );
};

export default PieChart;
