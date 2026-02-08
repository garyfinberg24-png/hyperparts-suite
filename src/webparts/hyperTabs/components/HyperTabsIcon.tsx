import * as React from "react";
import type { IHyperTabIcon } from "../models";

export interface IHyperTabsIconProps {
  icon: IHyperTabIcon | undefined;
  className?: string;
}

const HyperTabsIcon: React.FC<IHyperTabsIconProps> = function (props) {
  const { icon, className } = props;

  // eslint-disable-next-line @rushstack/no-new-null
  if (!icon) return null;

  if (icon.type === "emoji") {
    return React.createElement(
      "span",
      {
        className: className,
        style: { fontSize: "1.2em" },
        "aria-hidden": "true",
      },
      icon.value
    );
  }

  if (icon.type === "fluent") {
    const iconClass = "ms-Icon ms-Icon--" + icon.value;
    return React.createElement("i", {
      className: className ? className + " " + iconClass : iconClass,
      style: icon.color ? { color: icon.color } : undefined,
      "aria-hidden": "true",
    });
  }

  // eslint-disable-next-line @rushstack/no-new-null
  return null;
};

export default React.memo(HyperTabsIcon);
