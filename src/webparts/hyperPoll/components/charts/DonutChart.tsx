import * as React from "react";
import type { IChartData } from "../../models";
import { formatPercentage } from "../../utils/chartUtils";
import styles from "./DonutChart.module.scss";

export interface IDonutChartProps {
  data: IChartData[];
  totalVotes: number;
  ariaLabel: string;
}

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DonutChart: React.FC<IDonutChartProps> = function (props) {
  let cumulativePercentage = 0;
  const segments: React.ReactElement[] = [];
  const legendItems: React.ReactElement[] = [];

  props.data.forEach(function (item, idx) {
    const dashArray = (item.percentage / 100) * CIRCUMFERENCE;
    const dashOffset = -(cumulativePercentage / 100) * CIRCUMFERENCE;

    segments.push(
      React.createElement("circle", {
        key: idx,
        className: styles.donutSegment,
        cx: 100,
        cy: 100,
        r: RADIUS,
        fill: "none",
        stroke: item.color,
        strokeWidth: 30,
        strokeDasharray: dashArray + " " + CIRCUMFERENCE,
        strokeDashoffset: dashOffset,
        transform: "rotate(-90 100 100)",
      })
    );

    legendItems.push(
      React.createElement(
        "div",
        { key: idx, className: styles.donutLegendItem },
        React.createElement("div", {
          className: styles.donutLegendDot,
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
      className: styles.donutChart,
      role: "img",
      "aria-label": props.ariaLabel,
    },
    React.createElement(
      "svg",
      { className: styles.donutSvg, viewBox: "0 0 200 200" },
      segments,
      React.createElement(
        "text",
        { className: styles.donutCenter, x: 100, y: 100 },
        String(props.totalVotes)
      )
    ),
    React.createElement("div", { className: styles.donutLegend }, legendItems)
  );
};

export default DonutChart;
