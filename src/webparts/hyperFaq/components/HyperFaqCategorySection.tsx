import * as React from "react";
import styles from "./HyperFaqCategorySection.module.scss";

export interface IHyperFaqCategorySectionProps {
  name: string;
  itemCount: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const HyperFaqCategorySection: React.FC<IHyperFaqCategorySectionProps> = function (props) {
  const chevronClass = props.isExpanded
    ? styles.chevron + " " + styles.chevronExpanded
    : styles.chevron;

  const contentClass = props.isExpanded
    ? styles.categoryContent + " " + styles.categoryContentExpanded
    : styles.categoryContent;

  return React.createElement(
    "div",
    { className: styles.categorySection, role: "region", "aria-label": props.name },
    React.createElement(
      "button",
      {
        className: styles.categoryHeader,
        onClick: props.onToggle,
        "aria-expanded": props.isExpanded,
        type: "button",
      },
      React.createElement("i", {
        className: "ms-Icon ms-Icon--ChevronRight " + chevronClass,
        "aria-hidden": "true",
      }),
      React.createElement("span", { className: styles.categoryName }, props.name),
      React.createElement("span", { className: styles.itemCount }, "(" + String(props.itemCount) + ")")
    ),
    React.createElement(
      "div",
      { className: contentClass },
      props.children
    )
  );
};

export default HyperFaqCategorySection;
