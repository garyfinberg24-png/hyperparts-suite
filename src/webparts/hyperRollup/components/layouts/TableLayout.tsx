import * as React from "react";
import type { IHyperRollupItem, IHyperRollupColumn, IHyperRollupGroup } from "../../models";
import { evaluateFormatting } from "../../utils/columnFormatter";
import { HyperRollupGroupHeader } from "../HyperRollupGroupHeader";
import styles from "./TableLayout.module.scss";

export interface ITableLayoutProps {
  groups: IHyperRollupGroup[];
  isGrouped: boolean;
  columns: IHyperRollupColumn[];
  selectedItemId: string | undefined;
  expandedGroups: string[];
  sortField: string;
  sortDirection: "asc" | "desc";
  compact: boolean;
  onSelectItem: (itemId: string) => void;
  onSort: (field: string) => void;
  onToggleGroup: (groupKey: string) => void;
}

/**
 * Gets a display value from an item for a given column.
 */
function getCellValue(item: IHyperRollupItem, col: IHyperRollupColumn): string {
  const f = col.fieldName;
  if (f === "title") return item.title || "";
  if (f === "author") return item.author || "";
  if (f === "editor") return item.editor || "";
  if (f === "modified" || f === "created") {
    const dateStr = f === "modified" ? item.modified : item.created;
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString();
  }
  if (f === "fileType") return item.fileType || "";
  if (f === "contentType") return item.contentType || "";
  if (f === "sourceSiteName") return item.sourceSiteName || "";
  if (f === "sourceListName") return item.sourceListName || "";

  const raw = item.fields[f];
  if (raw === undefined) return "";
  return String(raw);
}

const TableLayoutInner: React.FC<ITableLayoutProps> = (props) => {
  const visibleColumns: IHyperRollupColumn[] = [];
  props.columns.forEach(function (col) {
    if (col.visible) {
      visibleColumns.push(col);
    }
  });

  function renderTableHeader(): React.ReactElement {
    const headerCells: React.ReactElement[] = [];

    visibleColumns.forEach(function (col) {
      const isSorted = props.sortField === col.fieldName;
      const sortIcon = isSorted
        ? (props.sortDirection === "asc" ? " \u25B2" : " \u25BC")
        : "";

      headerCells.push(
        React.createElement(
          "th",
          {
            key: col.id,
            className: styles.headerCell + (col.sortable ? " " + styles.sortable : ""),
            style: col.width ? { width: String(col.width) + "px" } : undefined,
            onClick: col.sortable ? function () { props.onSort(col.fieldName); } : undefined,
            "aria-sort": isSorted ? (props.sortDirection === "asc" ? "ascending" : "descending") : undefined,
            scope: "col",
          },
          col.displayName + sortIcon
        )
      );
    });

    return React.createElement("tr", undefined, headerCells);
  }

  function renderTableRows(items: IHyperRollupItem[]): React.ReactElement[] {
    return items.map(function (item) {
      const cells: React.ReactElement[] = [];

      visibleColumns.forEach(function (col) {
        const cellValue = getCellValue(item, col);
        const formatting = evaluateFormatting(col, cellValue);

        const cellStyle: React.CSSProperties = {};
        if (formatting.backgroundColor) cellStyle.backgroundColor = formatting.backgroundColor;
        if (formatting.textColor) cellStyle.color = formatting.textColor;

        const cellContent: React.ReactNode[] = [];

        if (formatting.iconName) {
          cellContent.push(
            React.createElement("i", {
              key: "icon",
              className: "ms-Icon ms-Icon--" + formatting.iconName,
              style: { marginRight: "4px" },
              "aria-hidden": "true",
            })
          );
        }

        cellContent.push(React.createElement("span", { key: "text" }, cellValue));

        if (formatting.progressPercent !== undefined) {
          cellContent.push(
            React.createElement(
              "div",
              { key: "progress", className: styles.progressBar },
              React.createElement("div", {
                className: styles.progressFill,
                style: { width: String(formatting.progressPercent) + "%" },
              })
            )
          );
        }

        cells.push(
          React.createElement("td", { key: col.id, className: styles.cell, style: cellStyle }, cellContent)
        );
      });

      return React.createElement(
        "tr",
        {
          key: item.id,
          className: styles.row + (props.selectedItemId === item.id ? " " + styles.selected : ""),
          onClick: function () { props.onSelectItem(item.id); },
          tabIndex: 0,
          "aria-selected": props.selectedItemId === item.id,
        },
        cells
      );
    });
  }

  if (!props.isGrouped) {
    const allItems: IHyperRollupItem[] = [];
    props.groups.forEach(function (g) {
      g.items.forEach(function (item) { allItems.push(item); });
    });

    return React.createElement(
      "div",
      { className: styles.tableContainer },
      React.createElement(
        "table",
        { className: styles.table + (props.compact ? " " + styles.compact : ""), role: "grid" },
        React.createElement("thead", undefined, renderTableHeader()),
        React.createElement("tbody", undefined, renderTableRows(allItems))
      )
    );
  }

  // Grouped: render table per group
  const groupElements: React.ReactElement[] = [];

  props.groups.forEach(function (group) {
    const isExpanded = props.expandedGroups.indexOf(group.key) !== -1;

    groupElements.push(
      React.createElement(
        "div",
        { key: group.key, className: styles.groupSection },
        React.createElement(HyperRollupGroupHeader, {
          groupKey: group.key,
          label: group.label,
          count: group.count,
          isExpanded: isExpanded,
          onToggle: props.onToggleGroup,
        }),
        isExpanded
          ? React.createElement(
              "table",
              {
                id: "group-" + group.key,
                className: styles.table + (props.compact ? " " + styles.compact : ""),
                role: "grid",
              },
              React.createElement("thead", undefined, renderTableHeader()),
              React.createElement("tbody", undefined, renderTableRows(group.items))
            )
          : undefined
      )
    );
  });

  return React.createElement("div", { className: styles.tableContainer }, groupElements);
};

export const TableLayout = React.memo(TableLayoutInner);
