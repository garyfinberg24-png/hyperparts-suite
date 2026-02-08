import * as React from "react";
import { HyperModal } from "../../../common/components";
import { formatChartValue } from "../utils/chartColors";
import styles from "./HyperChartsDrillDown.module.scss";

export interface IHyperChartsDrillDownProps {
  isOpen: boolean;
  onClose: () => void;
  chartTitle: string;
  segmentLabel: string;
  segmentValue: number;
  /** Raw data items that make up this segment */
  items: Array<Record<string, unknown>>;
  /** Column names for the data table */
  columns: string[];
}

/** Sortable column header sub-component */
interface ISortState {
  column: string;
  ascending: boolean;
}

const HyperChartsDrillDown: React.FC<IHyperChartsDrillDownProps> = function (props) {
  const [sortState, setSortState] = React.useState<ISortState>({
    column: "",
    ascending: true,
  });

  if (!props.isOpen) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  // Determine columns to display
  const columns = props.columns.length > 0
    ? props.columns
    : (props.items.length > 0 ? Object.keys(props.items[0]) : []);

  // Sort items
  const sortedItems = props.items.slice();
  if (sortState.column) {
    const col = sortState.column;
    const asc = sortState.ascending;
    sortedItems.sort(function (a, b) {
      const aVal = String(a[col] || "");
      const bVal = String(b[col] || "");
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return asc ? cmp : -cmp;
    });
  }

  // Toggle sort handler
  const handleSort = function (column: string): void {
    setSortState(function (prev) {
      if (prev.column === column) {
        return { column: column, ascending: !prev.ascending };
      }
      return { column: column, ascending: true };
    });
  };

  // Build table headers
  const headers: React.ReactElement[] = [];
  columns.forEach(function (col) {
    const sortIndicator = sortState.column === col
      ? (sortState.ascending ? " \u25B2" : " \u25BC")
      : "";
    headers.push(
      React.createElement(
        "th",
        {
          key: col,
          scope: "col",
          onClick: function () { handleSort(col); },
          "aria-sort": sortState.column === col
            ? (sortState.ascending ? "ascending" : "descending")
            : "none",
        },
        col,
        sortIndicator
          ? React.createElement("span", { className: styles.sortIndicator }, sortIndicator)
          : undefined
      )
    );
  });

  // Build table rows
  const rows: React.ReactElement[] = [];
  sortedItems.forEach(function (item, rowIdx) {
    const cells: React.ReactElement[] = [];
    columns.forEach(function (col) {
      cells.push(
        React.createElement("td", { key: col }, String(item[col] !== undefined ? item[col] : ""))
      );
    });
    rows.push(React.createElement("tr", { key: rowIdx }, cells));
  });

  const modalContent = React.createElement(
    "div",
    undefined,
    React.createElement(
      "div",
      { className: styles.drillDownHeader },
      React.createElement("span", { className: styles.drillDownLabel }, props.segmentLabel),
      React.createElement("span", { className: styles.drillDownValue }, formatChartValue(props.segmentValue))
    ),
    sortedItems.length > 0
      ? React.createElement(
          "table",
          {
            className: styles.dataTable,
            role: "table",
            "aria-label": "Drill-down data for " + props.segmentLabel,
          },
          React.createElement("thead", undefined,
            React.createElement("tr", undefined, headers)
          ),
          React.createElement("tbody", undefined, rows)
        )
      : React.createElement("div", { className: styles.emptyMessage }, "No detail records available.")
  );

  return React.createElement(
    HyperModal,
    {
      isOpen: true,
      onClose: props.onClose,
      title: props.chartTitle + " - Drill Down",
      size: "large",
    },
    modalContent
  );
};

export default HyperChartsDrillDown;
