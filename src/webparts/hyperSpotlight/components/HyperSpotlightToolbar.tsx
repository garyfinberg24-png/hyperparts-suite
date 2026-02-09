import * as React from "react";
import type { IHyperSpotlightEmployee } from "../models";
import { LayoutMode } from "../models";
import styles from "./HyperSpotlight.module.scss";

export interface IHyperSpotlightToolbarProps {
  employees: IHyperSpotlightEmployee[];
  showViewSwitcher: boolean;
  showDepartmentFilter: boolean;
  currentLayout: LayoutMode;
  onLayoutChange: (layout: LayoutMode) => void;
  currentDepartment: string;
  onDepartmentChange: (dept: string) => void;
}

/** Layout icon/label mapping */
const LAYOUT_ICONS: Array<{ mode: LayoutMode; label: string; icon: string }> = [
  { mode: LayoutMode.Grid, label: "Grid", icon: "\uD83D\uDD33" },
  { mode: LayoutMode.List, label: "List", icon: "\uD83D\uDCCB" },
  { mode: LayoutMode.Carousel, label: "Carousel", icon: "\uD83C\uDFA0" },
  { mode: LayoutMode.Banner, label: "Banner", icon: "\uD83C\uDFF3\uFE0F" },
  { mode: LayoutMode.Timeline, label: "Timeline", icon: "\uD83D\uDCC5" },
  { mode: LayoutMode.Masonry, label: "Masonry", icon: "\uD83E\uDDF1" },
  { mode: LayoutMode.Tiled, label: "Tiled", icon: "\uD83D\uDD32" },
  { mode: LayoutMode.FeaturedHero, label: "Hero", icon: "\u2B50" },
  { mode: LayoutMode.WallOfFame, label: "Wall of Fame", icon: "\uD83C\uDFC6" },
];

/**
 * Runtime toolbar with view-mode switcher and department filter dropdown.
 */
const HyperSpotlightToolbar: React.FC<IHyperSpotlightToolbarProps> = function (props) {
  const children: React.ReactNode[] = [];

  // View mode switcher
  if (props.showViewSwitcher) {
    const viewButtons: React.ReactNode[] = [];
    LAYOUT_ICONS.forEach(function (item) {
      const isActive = props.currentLayout === item.mode;
      viewButtons.push(
        React.createElement("button", {
          key: item.mode,
          className: styles.toolbarViewBtn + (isActive ? " " + styles.toolbarViewBtnActive : ""),
          onClick: function () { props.onLayoutChange(item.mode); },
          "aria-label": item.label + " view",
          "aria-pressed": isActive,
          title: item.label,
          type: "button",
        }, React.createElement("span", { "aria-hidden": "true" }, item.icon))
      );
    });
    children.push(
      React.createElement("div", { key: "views", className: styles.toolbarViews, role: "toolbar", "aria-label": "View modes" },
        viewButtons
      )
    );
  }

  // Department filter
  if (props.showDepartmentFilter) {
    // Extract unique departments from employees
    const deptSet: Record<string, boolean> = {};
    props.employees.forEach(function (emp) {
      if (emp.department) {
        deptSet[emp.department] = true;
      }
    });
    const departments = Object.keys(deptSet).sort();

    const deptOptions: React.ReactNode[] = [];
    deptOptions.push(
      React.createElement("option", { key: "all", value: "" }, "All Departments")
    );
    departments.forEach(function (dept) {
      deptOptions.push(
        React.createElement("option", { key: dept, value: dept }, dept)
      );
    });

    children.push(
      React.createElement("div", { key: "filter", className: styles.toolbarFilter },
        React.createElement("select", {
          className: styles.toolbarSelect,
          value: props.currentDepartment,
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
            props.onDepartmentChange(e.target.value);
          },
          "aria-label": "Filter by department",
        }, deptOptions)
      )
    );
  }

  if (children.length === 0) return React.createElement(React.Fragment);

  return React.createElement("div", { className: styles.toolbar }, children);
};

export default HyperSpotlightToolbar;
