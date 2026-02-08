import * as React from "react";
import type { ITickerItem } from "../models";

export interface IHyperTickerItemProps {
  item: ITickerItem;
  severityClassName: string;
}

const HyperTickerItem: React.FC<IHyperTickerItemProps> = function (props) {
  const item = props.item;
  const iconClassName = "ms-Icon ms-Icon--" + item.iconName;

  const iconEl = React.createElement("i", {
    className: iconClassName,
    "aria-hidden": "true",
    style: { marginRight: 6, fontSize: 14 },
  });

  const titleEl = React.createElement("span", undefined, item.title);

  if (item.url) {
    return React.createElement(
      "a",
      {
        href: item.url,
        target: "_blank",
        rel: "noopener noreferrer",
        style: { color: "inherit", textDecoration: "none", display: "flex", alignItems: "center" },
        "aria-label": item.title,
      },
      iconEl,
      titleEl
    );
  }

  return React.createElement(
    "span",
    { style: { display: "flex", alignItems: "center" } },
    iconEl,
    titleEl
  );
};

export default HyperTickerItem;
