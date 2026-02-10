import * as React from "react";

export interface IHyperTickerCategoryDividerProps {
  category: string;
}

/**
 * Visual divider between different categories in stacked/split modes.
 */
const HyperTickerCategoryDivider: React.FC<IHyperTickerCategoryDividerProps> = function (props) {
  return React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      padding: "4px 8px",
      fontSize: 11,
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
      color: "#605e5c",
      opacity: 0.8,
    },
    role: "separator",
    "aria-label": props.category + " section",
  },
    React.createElement("span", {
      style: {
        flex: "0 0 auto",
        marginRight: 8,
      },
    }, props.category),
    React.createElement("span", {
      "aria-hidden": "true",
      style: {
        flex: "1 1 auto",
        height: 1,
        backgroundColor: "currentColor",
        opacity: 0.3,
      },
    })
  );
};

export default HyperTickerCategoryDivider;
