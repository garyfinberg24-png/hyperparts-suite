import * as React from "react";
import type { IEventCategory } from "../models";
import styles from "./HyperEventsCategoryBar.module.scss";

export interface IHyperEventsCategoryBarProps {
  categories: IEventCategory[];
  selectedCategories: string[];
  onToggleCategory: (categoryName: string) => void;
}

/** Horizontal colored filter chips for categories */
const HyperEventsCategoryBar: React.FC<IHyperEventsCategoryBarProps> = function (props) {
  const children: React.ReactNode[] = [];

  // Label
  children.push(
    React.createElement("span", {
      key: "label",
      className: styles.hyperEventsCategoryBarLabel,
    }, "Filter:")
  );

  // Category chips
  props.categories.forEach(function (cat) {
    const isActive = props.selectedCategories.indexOf(cat.name) !== -1;
    const chipClass = styles.hyperEventsCategoryChip +
      (isActive ? " " + styles.hyperEventsCategoryChipActive : "");

    const chipStyle: React.CSSProperties = isActive
      ? { backgroundColor: cat.color, borderColor: cat.color }
      : {};

    children.push(
      React.createElement(
        "button",
        {
          key: cat.id,
          className: chipClass,
          style: chipStyle,
          onClick: function () { props.onToggleCategory(cat.name); },
          role: "checkbox",
          "aria-checked": isActive,
          type: "button",
        },
        React.createElement("span", {
          className: styles.hyperEventsCategoryChipDot,
          style: { backgroundColor: isActive ? "#fff" : cat.color },
        }),
        cat.name
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.hyperEventsCategoryBar, role: "group", "aria-label": "Category filters" },
    children
  );
};

export default HyperEventsCategoryBar;
