import * as React from "react";
import styles from "./HyperLinksGroupSection.module.scss";

export interface IHyperLinksGroupSectionProps {
  groupName: string;
  linkCount: number;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export const HyperLinksGroupSection: React.FC<IHyperLinksGroupSectionProps> = function (props) {
  // Unnamed group renders children directly without header
  if (!props.groupName) {
    return React.createElement("div", { className: styles.groupSection }, props.children);
  }

  return React.createElement(
    "div",
    {
      className: styles.groupSection,
      role: "region",
      "aria-label": props.groupName,
    },
    React.createElement(
      "button",
      {
        className: styles.groupHeader,
        onClick: props.onToggle,
        "aria-expanded": props.expanded,
      },
      React.createElement("i", {
        className: styles.groupChevron +
          (props.expanded ? " " + styles.groupChevronOpen : "") +
          " ms-Icon ms-Icon--ChevronRight",
        "aria-hidden": "true",
      }),
      React.createElement("span", { className: styles.groupName }, props.groupName),
      React.createElement("span", { className: styles.groupCount }, String(props.linkCount))
    ),
    props.expanded
      ? React.createElement(
        "div",
        { className: styles.groupContent },
        props.children
      )
      // eslint-disable-next-line @rushstack/no-new-null
      : null
  );
};
