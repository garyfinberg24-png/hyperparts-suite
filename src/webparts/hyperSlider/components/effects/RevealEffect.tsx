import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./RevealEffect.module.scss");

export interface IRevealEffectProps {
  direction?: string;
  duration?: number;
  delay?: number;
}

const DEFAULT_DURATION = 800;
const DEFAULT_DIRECTION = "circle";

/** Map direction to SCSS module class name */
const DIRECTION_CLASS_MAP: Record<string, string> = {
  circle: "revealCircle",
  inset: "revealInset",
  left: "revealLeft",
  right: "revealRight",
  top: "revealTop",
  bottom: "revealBottom",
};

const RevealEffect: React.FC<IRevealEffectProps> = function (props) {
  const direction = props.direction !== undefined ? props.direction : DEFAULT_DIRECTION;
  const duration = props.duration !== undefined ? props.duration : DEFAULT_DURATION;
  const delay = props.delay !== undefined ? props.delay : 0;

  // Resolve the animation class from the direction
  const directionKey = DIRECTION_CLASS_MAP[direction];
  const animationClass = directionKey
    ? (styles as Record<string, string>)[directionKey] || ""
    : "";

  const containerClass = styles.reveal + (animationClass ? " " + animationClass : "");

  const containerStyle: React.CSSProperties = {
    animationDuration: duration + "ms",
    animationDelay: delay + "ms",
  };

  return React.createElement(
    "div",
    {
      className: containerClass,
      style: containerStyle,
    },
    props.children
  );
};

export default RevealEffect;
