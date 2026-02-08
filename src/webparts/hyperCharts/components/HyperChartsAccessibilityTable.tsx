import * as React from "react";
import { formatChartValue } from "../utils/chartColors";
import styles from "./HyperChartsAccessibilityTable.module.scss";

export interface IHyperChartsAccessibilityTableProps {
  /** Chart title (for table caption) */
  title: string;
  /** Whether the table is visible or sr-only */
  visibleMode: boolean;
  /** Category labels */
  labels: string[];
  /** Data series */
  datasets: Array<{ label: string; data: number[] }>;
}

const HyperChartsAccessibilityTable: React.FC<IHyperChartsAccessibilityTableProps> = function (props) {
  if (props.labels.length === 0 || props.datasets.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  // Build header cells: Category, Series1, Series2, ...
  const headers: React.ReactElement[] = [];
  headers.push(React.createElement("th", { key: "cat", scope: "col" }, "Category"));
  props.datasets.forEach(function (ds) {
    headers.push(React.createElement("th", { key: ds.label, scope: "col" }, ds.label));
  });

  // Build data rows
  const rows: React.ReactElement[] = [];
  props.labels.forEach(function (label, rowIdx) {
    const cells: React.ReactElement[] = [];
    cells.push(React.createElement("th", { key: "cat", scope: "row" }, label));
    props.datasets.forEach(function (ds) {
      const val = rowIdx < ds.data.length ? formatChartValue(ds.data[rowIdx]) : "";
      cells.push(React.createElement("td", { key: ds.label }, val));
    });
    rows.push(React.createElement("tr", { key: rowIdx }, cells));
  });

  const tableClass = props.visibleMode ? styles.visibleTable : styles.srOnly;

  return React.createElement(
    "table",
    {
      className: tableClass,
      role: "table",
      "aria-label": "Data table for " + props.title,
    },
    React.createElement("caption", { className: styles.caption }, props.title + " - Data"),
    React.createElement("thead", undefined,
      React.createElement("tr", undefined, headers)
    ),
    React.createElement("tbody", undefined, rows)
  );
};

export default HyperChartsAccessibilityTable;
