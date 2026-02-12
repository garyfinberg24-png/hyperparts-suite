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
}

var COLOR_CLASS_MAP: Record<GroupHeaderColor, string> = {
  blue: styles.iconBlue,
  green: styles.iconGreen,
  red: styles.iconRed,
  orange: styles.iconOrange,
};

var HyperPropertyPaneGroupHeaderInner: React.FC<IHyperPropertyPaneGroupHeaderProps> = function (props) {
  var iconClass = COLOR_CLASS_MAP[props.color] || styles.iconBlue;

  return React.createElement("div", { className: styles.header },
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
      : undefined
  );
};

export var HyperPropertyPaneGroupHeader = React.memo(HyperPropertyPaneGroupHeaderInner);
