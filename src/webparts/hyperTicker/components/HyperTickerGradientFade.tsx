import * as React from "react";
import styles from "./HyperTickerGradientFade.module.scss";

export interface IHyperTickerGradientFadeProps {
  /** horizontal (left/right) or vertical (top/bottom) */
  direction?: "horizontal" | "vertical";
  children?: React.ReactNode;
}

/**
 * Wraps content with gradient edge fade overlays for scroll/vertical modes.
 */
const HyperTickerGradientFade: React.FC<IHyperTickerGradientFadeProps> = function (props) {
  const dirClass = props.direction === "vertical"
    ? styles.gradientVertical
    : styles.gradientHorizontal;

  return React.createElement("div", {
    className: styles.gradientFadeWrapper + " " + dirClass,
  }, props.children);
};

export default HyperTickerGradientFade;
