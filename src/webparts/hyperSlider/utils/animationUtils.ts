import * as React from "react";
import {
  EntranceAnimation,
  ExitAnimation,
  LoopAnimation,
  HoverEffect,
  EasingType,
  EASING_CSS_MAP
} from "../models";

/**
 * Get CSS class name for entrance animation
 */
export function getEntranceClass(type: EntranceAnimation): string {
  if (type === "none") {
    return "";
  }
  return "hyperSliderEnter" + type.charAt(0).toUpperCase() + type.substring(1);
}

/**
 * Get CSS class name for exit animation
 */
export function getExitClass(type: ExitAnimation): string {
  if (type === "none") {
    return "";
  }
  return "hyperSliderExit" + type.charAt(0).toUpperCase() + type.substring(1);
}

/**
 * Get CSS class name for loop animation
 */
export function getLoopClass(type: LoopAnimation): string {
  if (type === "none") {
    return "";
  }
  return "hyperSliderLoop" + type.charAt(0).toUpperCase() + type.substring(1);
}

/**
 * Get CSS class name for hover effect
 */
export function getHoverClass(type: HoverEffect): string {
  if (type === "none") {
    return "";
  }
  return "hyperSliderHover" + type.charAt(0).toUpperCase() + type.substring(1);
}

/**
 * Build inline animation style with custom timing
 */
export function buildAnimationStyle(
  delay: number,
  duration: number,
  easing: EasingType
): React.CSSProperties {
  const easingValue = EASING_CSS_MAP[easing] || EASING_CSS_MAP.ease;
  return {
    animationDelay: delay + "ms",
    animationDuration: duration + "ms",
    animationTimingFunction: easingValue
  };
}

/**
 * Build inline transition style for hover effects
 */
export function buildHoverTransitionStyle(duration: number): React.CSSProperties {
  return {
    transition: "all " + duration + "ms ease"
  };
}
