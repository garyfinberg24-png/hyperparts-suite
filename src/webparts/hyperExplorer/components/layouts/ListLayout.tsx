import * as React from "react";
import type { IExplorerFile, SortMode } from "../../models";
import { formatFileSize } from "../../utils/fileTypeUtils";
import styles from "./ListLayout.module.scss";

export interface IListLayoutProps {
  files: IExplorerFile[];
  selectedIds: string[];
  sortMode: SortMode;
  sortDirection: string;
  showMetadataOverlay: boolean;
  onSelect: (id: string) => void;
  onClick: (file: IExplorerFile) => void;
  onContextMenu: (file: IExplorerFile, x: number, y: number) => void;
  onSortChange: (mode: SortMode) => void;
}

/** Category → emoji */
var CAT_ICON: Record<string, string> = {
  document: "\uD83D\uDCC4",
  image: "\uD83D\uDDBC\uFE0F",
  video: "\uD83C\uDFA5",
  audio: "\uD83C\uDFB5",
  archive: "\uD83D\uDDC3\uFE0F",
  folder: "\uD83D\uDCC1",
  other: "\uD83D\uDCC3",
};

var SORT_INDICATOR: Record<string, string> = {
  asc: " \u2191",
  desc: " \u2193",
};

var ListLayout: React.FC<IListLayoutProps> = function (props) {
  if (!props.files || props.files.length === 0) {
    return React.createElement("div", { className: styles.emptyList }, "No files to display");
  }

  var handleSort = React.useCallback(function (mode: SortMode) {
    return function (): void {
      props.onSortChange(mode);
    };
  }, [props.onSortChange]);

  // Build sort indicator
  function getSortLabel(col: SortMode): string {
    if (props.sortMode === col) {
      return SORT_INDICATOR[props.sortDirection] || "";
    }
    return "";
  }

  // Header row
  var headerCells: React.ReactNode[] = [];

  // Checkbox column header
  headerCells.push(
    React.createElement("th", { key: "hdr-chk", className: styles.headerCheckbox }, "")
  );

  // Icon column
  headerCells.push(
    React.createElement("th", { key: "hdr-icon", className: styles.headerIcon }, "")
  );

  // Name
  headerCells.push(
    React.createElement("th", {
      key: "hdr-name",
      className: styles.headerSortable,
      onClick: handleSort("name"),
      role: "columnheader",
      "aria-sort": props.sortMode === "name" ? (props.sortDirection === "asc" ? "ascending" : "descending") : "none",
    }, "Name" + getSortLabel("name"))
  );

  // Modified
  headerCells.push(
    React.createElement("th", {
      key: "hdr-mod",
      className: styles.headerSortable + " " + styles.headerMedium,
      onClick: handleSort("modified"),
      role: "columnheader",
      "aria-sort": props.sortMode === "modified" ? (props.sortDirection === "asc" ? "ascending" : "descending") : "none",
    }, "Modified" + getSortLabel("modified"))
  );

  // Size
  headerCells.push(
    React.createElement("th", {
      key: "hdr-size",
      className: styles.headerSortable + " " + styles.headerSmall,
      onClick: handleSort("size"),
      role: "columnheader",
      "aria-sort": props.sortMode === "size" ? (props.sortDirection === "asc" ? "ascending" : "descending") : "none",
    }, "Size" + getSortLabel("size"))
  );

  // Author
  if (props.showMetadataOverlay) {
    headerCells.push(
      React.createElement("th", {
        key: "hdr-auth",
        className: styles.headerSortable + " " + styles.headerMedium,
        onClick: handleSort("author"),
        role: "columnheader",
        "aria-sort": props.sortMode === "author" ? (props.sortDirection === "asc" ? "ascending" : "descending") : "none",
      }, "Author" + getSortLabel("author"))
    );
  }

  var thead = React.createElement("thead", {},
    React.createElement("tr", { key: "header-row" }, headerCells)
  );

  // Data rows
  var rows = props.files.map(function (file) {
    var isSelected = props.selectedIds.indexOf(file.id) !== -1;
    var rowClass = isSelected ? styles.row + " " + styles.rowSelected : styles.row;
    var categoryKey = file.isFolder ? "folder" : (file.fileCategory as string);

    var cells: React.ReactNode[] = [];

    // Checkbox
    cells.push(
      React.createElement("td", { key: "chk", className: styles.cellCheckbox },
        React.createElement("span", {
          className: isSelected ? styles.listCheckbox + " " + styles.listCheckboxChecked : styles.listCheckbox,
          onClick: function (e: React.MouseEvent) {
            e.stopPropagation();
            props.onSelect(file.id);
          },
          role: "checkbox",
          "aria-checked": isSelected ? "true" : "false",
          tabIndex: 0,
        }, isSelected ? "\u2713" : "")
      )
    );

    // Icon
    cells.push(
      React.createElement("td", { key: "icon", className: styles.cellIcon },
        CAT_ICON[categoryKey] || "\uD83D\uDCC3"
      )
    );

    // Name
    cells.push(
      React.createElement("td", { key: "name", className: styles.cellName },
        React.createElement("span", { className: styles.nameText, title: file.name }, file.name),
        file.version && file.version !== "1.0"
          ? React.createElement("span", { className: styles.listVersionBadge }, "v" + file.version)
          : undefined
      )
    );

    // Modified
    cells.push(
      React.createElement("td", { key: "mod", className: styles.cellMeta },
        file.modified ? new Date(file.modified).toLocaleDateString() : ""
      )
    );

    // Size
    cells.push(
      React.createElement("td", { key: "size", className: styles.cellMeta },
        file.isFolder ? "--" : formatFileSize(file.size)
      )
    );

    // Author
    if (props.showMetadataOverlay) {
      cells.push(
        React.createElement("td", { key: "auth", className: styles.cellMeta },
          file.author || ""
        )
      );
    }

    return React.createElement("tr", {
      key: file.id,
      className: rowClass,
      onClick: function () { props.onClick(file); },
      onContextMenu: function (e: React.MouseEvent) {
        e.preventDefault();
        props.onContextMenu(file, e.clientX, e.clientY);
      },
      tabIndex: 0,
      role: "row",
      "aria-selected": isSelected ? "true" : "false",
    }, cells);
  });

  var tbody = React.createElement("tbody", {}, rows);

  return React.createElement("table", {
    className: styles.listTable,
    role: "grid",
    "aria-label": "File list",
  }, thead, tbody);
};

export default ListLayout;
