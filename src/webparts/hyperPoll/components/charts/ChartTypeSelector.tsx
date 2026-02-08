import * as React from "react";
import type { ChartType } from "../../models";
import styles from "./ChartTypeSelector.module.scss";

export interface IChartTypeSelectorProps {
  activeType: ChartType;
  onChange: (chartType: ChartType) => void;
}

const CHART_TYPES: Array<{ type: ChartType; label: string }> = [
  { type: "bar", label: "Bar" },
  { type: "pie", label: "Pie" },
  { type: "donut", label: "Donut" },
];

const ChartTypeSelector: React.FC<IChartTypeSelectorProps> = function (props) {
  const buttons: React.ReactElement[] = [];

  CHART_TYPES.forEach(function (ct) {
    const isActive = props.activeType === ct.type;
    const className = styles.chartTypeButton + (isActive ? " " + styles.chartTypeButtonActive : "");

    buttons.push(
      React.createElement(
        "button",
        {
          key: ct.type,
          type: "button",
          className: className,
          "aria-pressed": isActive,
          "aria-label": ct.label + " chart",
          onClick: function () { props.onChange(ct.type); },
        },
        ct.label
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.chartTypeSelector, role: "group", "aria-label": "Chart type" },
    buttons
  );
};

export default ChartTypeSelector;
