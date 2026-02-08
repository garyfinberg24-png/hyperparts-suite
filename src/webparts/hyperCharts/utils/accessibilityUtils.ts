import type { ChartKind } from "../models";
import { formatChartValue } from "./chartColors";

/** Chart kind display names */
function getChartKindName(kind: ChartKind): string {
  switch (kind) {
    case "bar": return "bar chart";
    case "line": return "line chart";
    case "area": return "area chart";
    case "pie": return "pie chart";
    case "donut": return "donut chart";
    case "gauge": return "gauge";
    default: return "chart";
  }
}

/**
 * Generate alt text describing a chart for screen readers.
 * Example: "Bar chart titled 'Revenue'. 4 categories: Q1, Q2, Q3, Q4.
 *           1 series: Revenue, ranging from 120 to 230."
 */
export function generateChartAltText(
  title: string,
  chartKind: ChartKind,
  labels: string[],
  datasets: Array<{ label: string; data: number[] }>
): string {
  const parts: string[] = [];

  // Chart type and title
  const kindName = getChartKindName(chartKind);
  parts.push(kindName.substring(0, 1).toUpperCase() + kindName.substring(1) + " titled '" + title + "'.");

  // Categories
  if (labels.length > 0) {
    const displayLabels = labels.length <= 5
      ? labels.join(", ")
      : labels.slice(0, 3).join(", ") + ", and " + (labels.length - 3) + " more";
    parts.push(labels.length + " categories: " + displayLabels + ".");
  }

  // Series info
  datasets.forEach(function (ds) {
    if (ds.data.length === 0) return;
    let min = ds.data[0];
    let max = ds.data[0];
    let total = 0;
    ds.data.forEach(function (v) {
      if (v < min) min = v;
      if (v > max) max = v;
      total += v;
    });
    parts.push(
      "Series '" + ds.label + "': " + ds.data.length + " values, " +
      "min " + formatChartValue(min) + ", max " + formatChartValue(max) +
      ", total " + formatChartValue(total) + "."
    );
  });

  return parts.join(" ");
}
