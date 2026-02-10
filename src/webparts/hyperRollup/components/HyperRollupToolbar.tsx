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
  enableAutoRefresh?: boolean;
  itemCount: number;
  activeFilterCount: number;
  onViewModeChange: (mode: ViewMode) => void;
  onSearchChange: (query: string) => void;
  onExport: () => void;
  onClearFilters: () => void;
  onRefresh?: () => void;
}

/** Primary view modes shown as inline icon buttons */
var PRIMARY_VIEWS: Array<{ mode: ViewMode; icon: string; label: string }> = [
  { mode: "card", icon: "ms-Icon--GridViewMedium", label: "Card view" },
  { mode: "table", icon: "ms-Icon--List", label: "Table view" },
  { mode: "list", icon: "ms-Icon--AlignLeft", label: "List view" },
  { mode: "kanban", icon: "ms-Icon--ViewAll2", label: "Kanban view" },
];

/** Overflow view modes shown in dropdown */
var OVERFLOW_VIEWS: Array<{ mode: ViewMode; icon: string; label: string }> = [
  { mode: "carousel", icon: "ms-Icon--Slideshow", label: "Carousel" },
  { mode: "filmstrip", icon: "ms-Icon--Video", label: "Filmstrip" },
  { mode: "gallery", icon: "ms-Icon--PictureFill", label: "Gallery" },
  { mode: "timeline", icon: "ms-Icon--TimelineProgress", label: "Timeline" },
  { mode: "calendar", icon: "ms-Icon--Calendar", label: "Calendar" },
  { mode: "magazine", icon: "ms-Icon--ReadingMode", label: "Magazine" },
  { mode: "top10", icon: "ms-Icon--Trophy2", label: "Top 10" },
];

/** Check if a mode is in the overflow set */
function isOverflowMode(mode: ViewMode): boolean {
  var found = false;
  OVERFLOW_VIEWS.forEach(function (v) {
    if (v.mode === mode) found = true;
  });
  return found;
}

const HyperRollupToolbarInner: React.FC<IHyperRollupToolbarProps> = (props) => {
  var moreMenuState = React.useState(false);
  var isMoreOpen = moreMenuState[0];
  var setMoreOpen = moreMenuState[1];

  var handleSearchInput = useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    props.onSearchChange(e.target.value);
  }, [props.onSearchChange]);

  var handleClearSearch = useCallback(function (): void {
    props.onSearchChange("");
  }, [props.onSearchChange]);

  var handleToggleMore = useCallback(function (): void {
    setMoreOpen(function (prev) { return !prev; });
  }, []);

  var handleOverflowSelect = useCallback(function (mode: ViewMode): void {
    props.onViewModeChange(mode);
    setMoreOpen(false);
  }, [props.onViewModeChange]);

  // Close overflow on outside click
  React.useEffect(function () {
    if (!isMoreOpen) return undefined;
    function handleDocClick(): void {
      setMoreOpen(false);
    }
    // Delay to avoid closing immediately
    var id = window.setTimeout(function () {
      document.addEventListener("click", handleDocClick);
    }, 0);
    return function () {
      window.clearTimeout(id);
      document.removeEventListener("click", handleDocClick);
    };
  }, [isMoreOpen]);

  // Primary view buttons
  var primaryButtons: React.ReactElement[] = [];
  PRIMARY_VIEWS.forEach(function (view) {
    primaryButtons.push(
      React.createElement(
        "button",
        {
          key: view.mode,
          className: styles.viewButton + (props.viewMode === view.mode ? " " + styles.active : ""),
          onClick: function () { props.onViewModeChange(view.mode); },
          "aria-pressed": props.viewMode === view.mode,
          title: view.label,
        },
        React.createElement("i", { className: "ms-Icon " + view.icon, "aria-hidden": "true" })
      )
    );
  });

  // More views dropdown
  var overflowMenuItems: React.ReactElement[] = [];
  OVERFLOW_VIEWS.forEach(function (view) {
    overflowMenuItems.push(
      React.createElement(
        "button",
        {
          key: view.mode,
          className: styles.overflowItem + (props.viewMode === view.mode ? " " + styles.overflowActive : ""),
          onClick: function (e: React.MouseEvent) {
            e.stopPropagation();
            handleOverflowSelect(view.mode);
          },
        },
        React.createElement("i", { className: "ms-Icon " + view.icon, "aria-hidden": "true" }),
        React.createElement("span", undefined, view.label)
      )
    );
  });

  var moreButton = React.createElement(
    "div",
    { className: styles.moreViewsContainer },
    React.createElement(
      "button",
      {
        className: styles.viewButton + (isOverflowMode(props.viewMode) ? " " + styles.active : ""),
        onClick: handleToggleMore,
        "aria-expanded": isMoreOpen,
        "aria-haspopup": "true",
        title: "More views",
      },
      React.createElement("i", { className: "ms-Icon ms-Icon--More", "aria-hidden": "true" })
    ),
    isMoreOpen
      ? React.createElement(
          "div",
          { className: styles.overflowMenu, role: "menu" },
          overflowMenuItems
        )
      : undefined
  );

  return React.createElement(
    "div",
    { className: styles.toolbar, role: "toolbar", "aria-label": "Content rollup toolbar" },

    // View mode buttons (4 primary + more dropdown)
    React.createElement(
      "div",
      { className: styles.viewSwitcher, role: "radiogroup", "aria-label": "View mode" },
      primaryButtons,
      moreButton
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
        : undefined,

      // Manual refresh button (shown when auto-refresh is enabled)
      props.enableAutoRefresh && props.onRefresh
        ? React.createElement(
            "button",
            { className: styles.actionButton, onClick: props.onRefresh, title: "Refresh data now" },
            React.createElement("i", { className: "ms-Icon ms-Icon--Refresh", "aria-hidden": "true" }),
            " Refresh"
          )
        : undefined
    )
  );
};

export const HyperRollupToolbar = React.memo(HyperRollupToolbarInner);
