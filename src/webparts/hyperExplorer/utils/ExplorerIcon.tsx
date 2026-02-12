import * as React from "react";
import { ICON_PATHS } from "./explorerIcons";

export interface IExplorerIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * React component that renders an inline SVG icon.
 * Standard 8: Modern black/white line SVG icons only.
 */
var ExplorerIcon: React.FC<IExplorerIconProps> = function (props) {
  var size = props.size || 16;
  var pathData = ICON_PATHS[props.name] || ICON_PATHS["file"];

  var baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    lineHeight: 1,
  };

  // Merge custom style (ES5 safe — no Object.assign)
  var mergedStyle: Record<string, unknown> = {};
  var bk: string;
  for (bk in baseStyle) {
    if ((baseStyle as Record<string, unknown>).hasOwnProperty(bk)) {
      mergedStyle[bk] = (baseStyle as Record<string, unknown>)[bk];
    }
  }
  if (props.style) {
    for (bk in props.style) {
      if ((props.style as Record<string, unknown>).hasOwnProperty(bk)) {
        mergedStyle[bk] = (props.style as Record<string, unknown>)[bk];
      }
    }
  }

  return React.createElement("span", {
    className: props.className,
    style: mergedStyle as React.CSSProperties,
    "aria-hidden": "true",
    dangerouslySetInnerHTML: {
      __html: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + pathData + '</svg>',
    },
  });
};

export default ExplorerIcon;
