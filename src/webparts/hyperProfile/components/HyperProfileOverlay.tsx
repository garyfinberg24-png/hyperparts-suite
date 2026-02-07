import * as React from "react";
import type { OverlayPosition, TextAlignment } from "../models/IHyperProfileWebPartProps";
import styles from "./HyperProfileOverlay.module.scss";

export interface IHyperProfileOverlayProps {
  text: string;
  overlayColor: string;
  overlayTransparency: number;
  textColor: string;
  textAlignment: TextAlignment;
  position: OverlayPosition;
}

const HyperProfileOverlay: React.FC<IHyperProfileOverlayProps> = function (props) {
  if (!props.text) return React.createElement(React.Fragment);

  const positionClass =
    props.position === "top" ? styles.overlayTop
    : props.position === "bottom" ? styles.overlayBottom
    : styles.overlayFull;

  // Parse hex color and apply transparency
  const alpha = 1 - (props.overlayTransparency || 0) / 100;
  const bgColor = hexToRgba(props.overlayColor || "#000000", alpha);

  const overlayStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: props.textColor || "#ffffff",
    textAlign: (props.textAlignment || "center") as React.CSSProperties["textAlign"],
  };

  return React.createElement("div", {
    className: styles.overlay + " " + positionClass,
    style: overlayStyle,
    "aria-hidden": "true",
  },
    React.createElement("span", { className: styles.overlayText }, props.text)
  );
};

/** Convert hex color to rgba string */
function hexToRgba(hex: string, alpha: number): string {
  const shortHex = hex.replace("#", "");
  const fullHex = shortHex.length === 3
    ? shortHex.charAt(0) + shortHex.charAt(0) + shortHex.charAt(1) + shortHex.charAt(1) + shortHex.charAt(2) + shortHex.charAt(2)
    : shortHex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return "rgba(0, 0, 0, " + alpha + ")";
  }

  return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
}

export default HyperProfileOverlay;
