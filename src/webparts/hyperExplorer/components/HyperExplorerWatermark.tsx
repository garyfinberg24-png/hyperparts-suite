import * as React from "react";
import styles from "./HyperExplorerWatermark.module.scss";

export interface IHyperExplorerWatermarkProps {
  /** Watermark text */
  text: string;
  /** Whether to use tiled/repeating pattern (default: single centered) */
  tiled?: boolean;
  /** Light variant for dark backgrounds */
  lightText?: boolean;
}

/** Generate tiled watermark items */
function generateTileItems(text: string, count: number): React.ReactNode[] {
  var items: React.ReactNode[] = [];
  var i: number;
  for (i = 0; i < count; i++) {
    items.push(
      React.createElement("span", {
        key: "tile-" + i,
        className: styles.watermarkTileItem,
      }, text)
    );
  }
  return items;
}

var HyperExplorerWatermark: React.FC<IHyperExplorerWatermarkProps> = function (props) {
  if (!props.text) {
    return React.createElement(React.Fragment);
  }

  var overlayClass = styles.watermarkOverlay;
  if (props.lightText) {
    overlayClass = overlayClass + " " + styles.watermarkLight;
  }

  var content: React.ReactNode;

  if (props.tiled) {
    // Tiled repeating pattern — ~60 items fills typical viewport
    var tiles = generateTileItems(props.text, 60);
    content = React.createElement("div", { className: styles.watermarkTiled }, tiles);
  } else {
    // Single centered watermark
    content = React.createElement("span", { className: styles.watermarkText }, props.text);
  }

  return React.createElement("div", {
    className: overlayClass,
    "aria-hidden": "true",
  }, content);
};

export default HyperExplorerWatermark;
