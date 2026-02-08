import * as React from "react";
import {
  TransitionType,
  EasingType,
  TransitionDirection,
  EASING_CSS_MAP
} from "../models";

/**
 * Get transition style for slide transitions
 */
export function getTransitionStyle(
  type: TransitionType,
  duration: number,
  easing: EasingType,
  direction: TransitionDirection
): React.CSSProperties {
  const easingValue = EASING_CSS_MAP[easing] || EASING_CSS_MAP.ease;
  const durationStr = duration + "ms";

  const baseStyle: React.CSSProperties = {
    transition: "all " + durationStr + " " + easingValue
  };

  return baseStyle;
}

/**
 * Get 3D perspective wrapper style for 3D transitions
 */
export function get3DPerspectiveStyle(type: TransitionType): React.CSSProperties {
  const is3D = type === "cube3D" || type === "flip3D" || type === "coverflow3D";

  if (is3D) {
    return {
      perspective: "1200px",
      transformStyle: "preserve-3d" as React.CSSProperties["transformStyle"]
    };
  }

  return {};
}

/**
 * Get clip-path value for wipe transitions
 */
export function getWipeClipPath(direction: string, progress: number): string {
  // direction: "left", "right", "top", "bottom"
  // progress: 0-100

  if (direction === "left") {
    return "inset(0 " + (100 - progress) + "% 0 0)";
  } else if (direction === "right") {
    return "inset(0 0 0 " + (100 - progress) + "%)";
  } else if (direction === "top") {
    return "inset(" + (100 - progress) + "% 0 0 0)";
  } else if (direction === "bottom") {
    return "inset(0 0 " + (100 - progress) + "% 0)";
  }

  return "none";
}

/**
 * Check if transition type requires 3D perspective wrapper
 */
export function is3DTransition(type: TransitionType): boolean {
  return type === "cube3D" || type === "flip3D" || type === "coverflow3D";
}
