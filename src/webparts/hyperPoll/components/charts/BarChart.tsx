import * as React from "react";
import type { IChartData } from "../../models";
import { formatPercentage } from "../../utils/chartUtils";
import styles from "./BarChart.module.scss";

export interface IBarChartProps {
  data: IChartData[];
  ariaLabel: string;
}

const BarChart: React.FC<IBarChartProps> = function (props) {
  const bars: React.ReactElement[] = [];

  props.data.forEach(function (item, idx) {
    bars.push(
      React.createElement(
        "div",
        { key: idx, className: styles.barRow },
        React.createElement("span", { className: styles.barLabel }, item.label),
        React.createElement(
          "div",
          {
            className: styles.barTrack,
            role: "meter",
            "aria-valuenow": Math.round(item.percentage),
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-label": item.label + ": " + formatPercentage(item.percentage),
          },
          React.createElement("div", {
            className: styles.barFill,
            style: {
              width: formatPercentage(item.percentage),
              backgroundColor: item.color,
            },
          })
        ),
        React.createElement(
          "span",
          { className: styles.barValue },
          item.value + " (" + formatPercentage(item.percentage) + ")"
        )
      )
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.barChart,
      role: "img",
      "aria-label": props.ariaLabel,
    },
    bars
  );
};

export default BarChart;
