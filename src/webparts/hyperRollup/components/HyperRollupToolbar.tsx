import * as React from "react";
import { useCallback } from "react";
import type { ViewMode } from "../models";
import styles from "./HyperRollupToolbar.module.scss";

export interface IHyperRollupToolbarProps {
  viewMode: ViewMode;
  searchQuery: string;
  enableSearch: boolean;
  enableExport: boolean;
  enableSavedViews: boolean;
  itemCount: number;
  activeFilterCount: number;
  onViewModeChange: (mode: ViewMode) => void;
  onSearchChange: (query: string) => void;
  onExport: () => void;
  onClearFilters: () => void;
}

const HyperRollupToolbarInner: React.FC<IHyperRollupToolbarProps> = (props) => {
  const handleSearchInput = useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    props.onSearchChange(e.target.value);
  }, [props.onSearchChange]);

  const handleClearSearch = useCallback(function (): void {
    props.onSearchChange("");
  }, [props.onSearchChange]);

  return React.createElement(
    "div",
    { className: styles.toolbar, role: "toolbar", "aria-label": "Content rollup toolbar" },

    // View mode buttons
    React.createElement(
      "div",
      { className: styles.viewSwitcher, role: "radiogroup", "aria-label": "View mode" },
      React.createElement(
        "button",
        {
          className: styles.viewButton + (props.viewMode === "card" ? " " + styles.active : ""),
          onClick: function () { props.onViewModeChange("card"); },
          "aria-pressed": props.viewMode === "card",
          title: "Card view",
        },
        React.createElement("i", { className: "ms-Icon ms-Icon--GridViewMedium", "aria-hidden": "true" })
      ),
      React.createElement(
        "button",
        {
          className: styles.viewButton + (props.viewMode === "table" ? " " + styles.active : ""),
          onClick: function () { props.onViewModeChange("table"); },
          "aria-pressed": props.viewMode === "table",
          title: "Table view",
        },
        React.createElement("i", { className: "ms-Icon ms-Icon--List", "aria-hidden": "true" })
      ),
      React.createElement(
        "button",
        {
          className: styles.viewButton + (props.viewMode === "kanban" ? " " + styles.active : ""),
          onClick: function () { props.onViewModeChange("kanban"); },
          "aria-pressed": props.viewMode === "kanban",
          title: "Kanban view",
        },
        React.createElement("i", { className: "ms-Icon ms-Icon--ViewAll2", "aria-hidden": "true" })
      )
    ),

    // Search bar
    props.enableSearch
      ? React.createElement(
          "div",
          { className: styles.searchBar },
          React.createElement("i", { className: "ms-Icon ms-Icon--Search " + styles.searchIcon, "aria-hidden": "true" }),
          React.createElement("input", {
            type: "text",
            className: styles.searchInput,
            placeholder: "Search items...",
            value: props.searchQuery,
            onChange: handleSearchInput,
            "aria-label": "Search rolled-up content",
          }),
          props.searchQuery
            ? React.createElement(
                "button",
                {
                  className: styles.clearButton,
                  onClick: handleClearSearch,
                  "aria-label": "Clear search",
                },
                React.createElement("i", { className: "ms-Icon ms-Icon--Cancel", "aria-hidden": "true" })
              )
            : undefined
        )
      : undefined,

    // Right side: item count + actions
    React.createElement(
      "div",
      { className: styles.toolbarRight },

      // Item count
      React.createElement(
        "span",
        { className: styles.itemCount, "aria-live": "polite" },
        String(props.itemCount) + " item" + (props.itemCount !== 1 ? "s" : "")
      ),

      // Active filter badge
      props.activeFilterCount > 0
        ? React.createElement(
            "button",
            { className: styles.filterBadge, onClick: props.onClearFilters, title: "Clear all filters" },
            String(props.activeFilterCount) + " filter" + (props.activeFilterCount !== 1 ? "s" : ""),
            React.createElement("i", { className: "ms-Icon ms-Icon--Cancel", "aria-hidden": "true" })
          )
        : undefined,

      // Export button
      props.enableExport
        ? React.createElement(
            "button",
            { className: styles.actionButton, onClick: props.onExport, title: "Export to CSV" },
            React.createElement("i", { className: "ms-Icon ms-Icon--Download", "aria-hidden": "true" }),
            " Export"
          )
        : undefined
    )
  );
};

export const HyperRollupToolbar = React.memo(HyperRollupToolbarInner);
