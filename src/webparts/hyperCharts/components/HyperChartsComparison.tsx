import * as React from "react";
import type { ChartKind } from "../models";
import type { ICanvasDataset } from "./HyperChartsCanvas";
import HyperChartsCanvas from "./HyperChartsCanvas";
import { getChartColorAlpha } from "../utils/chartColors";
import { HyperSkeleton } from "../../../common/components";
import styles from "./HyperChartsComparison.module.scss";

export interface IHyperChartsComparisonProps {
  chartKind: ChartKind;
  /** Current period labels */
  labels: string[];
  /** Current period datasets */
  datasets: ICanvasDataset[];
  /** Previous period datasets (overlaid with lower opacity) */
  comparisonDatasets: Array<{ label: string; data: number[] }>;
  /** Whether comparison data is still loading */
  comparisonLoading: boolean;
  showLegend: boolean;
  animate: boolean;
  ariaLabel: string;
}

const HyperChartsComparison: React.FC<IHyperChartsComparisonProps> = function (props) {
  if (props.comparisonLoading) {
    return React.createElement(
      "div",
      { className: styles.comparisonContainer },
      React.createElement(HyperSkeleton, { count: 1, width: "100%", height: "200px" })
    );
  }

  // Merge current and previous datasets
  const mergedDatasets: ICanvasDataset[] = [];

  // Current datasets (as-is)
  props.datasets.forEach(function (ds) {
    mergedDatasets.push(ds);
  });

  // Previous datasets (with alpha transparency)
  props.comparisonDatasets.forEach(function (ds, idx) {
    const alphaColor = getChartColorAlpha(idx, 0.3);
    const bgColors: string[] = [];
    const borderColors: string[] = [];
    ds.data.forEach(function () {
      bgColors.push(alphaColor);
      borderColors.push(getChartColorAlpha(idx, 0.5));
    });
    mergedDatasets.push({
      label: ds.label,
      data: ds.data,
      backgroundColor: bgColors,
      borderColor: borderColors,
    });
  });

  // Delta display (for first dataset only)
  let deltaElement: React.ReactElement | undefined;
  if (props.datasets.length > 0 && props.comparisonDatasets.length > 0) {
    const currentData = props.datasets[0].data;
    const previousData = props.comparisonDatasets[0].data;

    if (currentData.length > 0 && previousData.length > 0) {
      let currentTotal = 0;
      let previousTotal = 0;
      currentData.forEach(function (v) { currentTotal += v; });
      previousData.forEach(function (v) { previousTotal += v; });

      const delta = currentTotal - previousTotal;
      const deltaPercent = previousTotal !== 0 ? Math.round((delta / previousTotal) * 100) : 0;
      const deltaSign = delta >= 0 ? "+" : "";

      deltaElement = React.createElement(
        "div",
        { className: styles.deltaBar },
        React.createElement(
          "span",
          { className: delta >= 0 ? styles.deltaPositive : styles.deltaNegative },
          deltaSign + Math.round(delta) + " (" + deltaSign + deltaPercent + "%)"
        ),
        React.createElement("span", { className: styles.deltaLabel }, " vs. previous period")
      );
    }
  }

  return React.createElement(
    "div",
    { className: styles.comparisonContainer },
    React.createElement(HyperChartsCanvas, {
      chartKind: props.chartKind,
      labels: props.labels,
      datasets: mergedDatasets,
      showLegend: props.showLegend,
      animate: props.animate,
      ariaLabel: props.ariaLabel + " with comparison",
    }),
    deltaElement
  );
};

export default HyperChartsComparison;
