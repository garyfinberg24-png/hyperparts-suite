import * as React from "react";
import type { ViewMode, SortMode } from "../models";
import { VIEW_MODE_OPTIONS, SORT_MODE_OPTIONS } from "../models";
import styles from "./HyperExplorerToolbar.module.scss";

export interface IHyperExplorerToolbarProps {
  viewMode: ViewMode;
  sortMode: SortMode;
  sortDirection: string;
  searchQuery: string;
  selectedCount: number;
  enableUpload: boolean;
  enableFilePlan: boolean;
  onSearchChange: (query: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onSortModeChange: (mode: SortMode) => void;
  onSortDirectionToggle: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDownloadSelected: () => void;
  onUploadClick: () => void;
  onFilePlanClick: () => void;
}

var VIEW_MODE_ICONS: Record<string, string> = {
  grid: "\u25A6",
  masonry: "\u2593",
  list: "\u2630",
  filmstrip: "\u25EB",
  tiles: "\u25A3",
};

var HyperExplorerToolbar: React.FC<IHyperExplorerToolbarProps> = function (props) {
  // eslint-disable-next-line @rushstack/no-new-null
  var searchInputRef = React.useRef<HTMLInputElement>(null);
  var searchTimerRef = React.useRef<number>(0);

  var handleSearchInput = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    var value = e.target.value;
    window.clearTimeout(searchTimerRef.current);
    searchTimerRef.current = window.setTimeout(function () {
      props.onSearchChange(value);
    }, 300);
  }, [props.onSearchChange]);

  // View mode buttons
  var viewModeButtons = VIEW_MODE_OPTIONS.map(function (opt) {
    var isActive = opt.key === props.viewMode;
    var className = isActive
      ? styles.viewModeButton + " " + styles.viewModeButtonActive
      : styles.viewModeButton;

    return React.createElement("button", {
      key: opt.key,
      className: className,
      onClick: function () { props.onViewModeChange(opt.key); },
      title: opt.text,
      "aria-label": opt.text + " view",
      "aria-pressed": isActive ? "true" : "false",
      type: "button",
    }, VIEW_MODE_ICONS[opt.key] || opt.text.charAt(0));
  });

  // Sort select options
  var sortOptions = SORT_MODE_OPTIONS.map(function (opt) {
    return React.createElement("option", { key: opt.key, value: opt.key }, opt.text);
  });

  var children: React.ReactNode[] = [];

  // Search input
  children.push(
    React.createElement("input", {
      key: "search",
      ref: searchInputRef,
      className: styles.searchInput,
      type: "text",
      placeholder: "Search files...",
      defaultValue: props.searchQuery,
      onChange: handleSearchInput,
      "aria-label": "Search files",
    })
  );

  // View mode group
  children.push(
    React.createElement("div", {
      key: "view-modes",
      className: styles.viewModeGroup,
      role: "group",
      "aria-label": "View mode",
    }, viewModeButtons)
  );

  // Sort group
  children.push(
    React.createElement("div", { key: "sort-group", className: styles.sortGroup },
      React.createElement("select", {
        className: styles.sortSelect,
        value: props.sortMode,
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
          props.onSortModeChange(e.target.value as SortMode);
        },
        "aria-label": "Sort by",
      }, sortOptions),
      React.createElement("button", {
        className: styles.sortDirectionButton,
        onClick: props.onSortDirectionToggle,
        title: props.sortDirection === "asc" ? "Ascending" : "Descending",
        "aria-label": "Toggle sort direction",
        type: "button",
      }, props.sortDirection === "asc" ? "\u2191" : "\u2193")
    )
  );

  // Action group
  var actionButtons: React.ReactNode[] = [];

  if (props.selectedCount > 0) {
    actionButtons.push(
      React.createElement("span", {
        key: "selection-info",
        className: styles.selectionInfo,
      }, props.selectedCount + " selected")
    );
    actionButtons.push(
      React.createElement("button", {
        key: "download",
        className: styles.actionButton,
        onClick: props.onDownloadSelected,
        title: "Download selected files",
        type: "button",
      }, "\u2B07 Download")
    );
    actionButtons.push(
      React.createElement("button", {
        key: "clear",
        className: styles.actionButton,
        onClick: props.onClearSelection,
        title: "Clear selection",
        type: "button",
      }, "\u2715 Clear")
    );
  }

  if (props.enableUpload) {
    actionButtons.push(
      React.createElement("button", {
        key: "upload",
        className: styles.actionButton + " " + styles.uploadButton,
        onClick: props.onUploadClick,
        title: "Upload files",
        type: "button",
      }, "\u2B06 Upload")
    );
  }

  if (props.enableFilePlan) {
    actionButtons.push(
      React.createElement("button", {
        key: "file-plan",
        className: styles.actionButton,
        onClick: props.onFilePlanClick,
        title: "File Plan Dashboard",
        type: "button",
      }, "\uD83D\uDCCB File Plan")
    );
  }

  if (actionButtons.length > 0) {
    children.push(
      React.createElement("div", {
        key: "actions",
        className: styles.actionGroup,
      }, actionButtons)
    );
  }

  return React.createElement("div", {
    className: styles.toolbar,
    role: "toolbar",
    "aria-label": "File explorer toolbar",
  }, children);
};

export default HyperExplorerToolbar;
