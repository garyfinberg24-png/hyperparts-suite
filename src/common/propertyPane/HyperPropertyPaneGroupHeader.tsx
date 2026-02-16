import * as React from "react";
import styles from "./HyperPropertyPaneGroupHeader.module.scss";

export type GroupHeaderColor = "blue" | "green" | "red" | "orange";

export interface IHyperPropertyPaneGroupHeaderProps {
  /** Emoji or icon character */
  icon: string;
  /** Group title (rendered uppercase) */
  title: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Optional item count badge */
  itemCount?: number;
  /** Color theme for the icon background */
  color: GroupHeaderColor;
  /** If true, header is clickable and toggles sibling field visibility */
  collapsible?: boolean;
  /** If true AND collapsible, start collapsed */
  startCollapsed?: boolean;
}

var COLOR_CLASS_MAP: Record<GroupHeaderColor, string> = {
  blue: styles.iconBlue,
  green: styles.iconGreen,
  red: styles.iconRed,
  orange: styles.iconOrange,
};

/**
 * Pure visual component — renders the header UI only.
 * All collapse/expand behavior is handled by createGroupHeaderField.ts
 * at the DOM level (outside React).
 */
var HyperPropertyPaneGroupHeaderInner: React.FC<IHyperPropertyPaneGroupHeaderProps> = function (props) {
  var iconClass = COLOR_CLASS_MAP[props.color] || styles.iconBlue;

  var headerClass = props.collapsible
    ? styles.header + " " + styles.headerClickable
    : styles.header;

  return React.createElement("div", {
    className: headerClass,
  },
    React.createElement("span", {
      className: iconClass,
      "aria-hidden": "true",
    }, props.icon),
    React.createElement("div", { className: styles.titleBlock },
      React.createElement("span", { className: styles.title }, props.title),
      props.subtitle
        ? React.createElement("span", { className: styles.subtitle }, props.subtitle)
        : undefined
    ),
    props.itemCount !== undefined
      ? React.createElement("span", { className: styles.itemCount }, String(props.itemCount))
      : undefined,
    props.collapsible
      ? React.createElement("span", {
          "data-hyper-chevron": "true",
          className: props.startCollapsed ? styles.chevronCollapsed : styles.chevron,
          "aria-hidden": "true",
        }, "\u276F")
      : undefined
  );
};

export var HyperPropertyPaneGroupHeader = React.memo(HyperPropertyPaneGroupHeaderInner);
