// ============================================================
// HyperFlow — React SVG icon component
// Renders inline SVG from flowIcons path data
// Pattern from: HyperExplorer/utils/ExplorerIcon.tsx
// ============================================================

import * as React from "react";
import { FLOW_ICONS } from "./flowIcons";

export interface IFlowIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

var FlowIcon: React.FC<IFlowIconProps> = function (props) {
  var iconData = FLOW_ICONS[props.name];
  if (!iconData) {
    return React.createElement("span");
  }

  var size = props.size || 20;

  // ES5-safe style merge — no Object.assign or spread
  var svgStyle: Record<string, unknown> = {
    width: size,
    height: size,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    lineHeight: 1,
    verticalAlign: "middle",
  };
  if (props.color) {
    svgStyle.color = props.color;
  }

  return React.createElement("span", {
    className: props.className,
    style: svgStyle as React.CSSProperties,
    "aria-hidden": "true",
    dangerouslySetInnerHTML: {
      __html:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' +
        iconData.viewBox +
        '" width="' +
        size +
        '" height="' +
        size +
        '">' +
        iconData.paths +
        "</svg>",
    },
  });
};

export default FlowIcon;
