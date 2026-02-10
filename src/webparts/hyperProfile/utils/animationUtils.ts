import type { ProfileAnimation } from "../models/IHyperProfileAnimation";
import type { IHeaderConfig } from "../models/IHyperProfileAnimation";

/** Map animation type to CSS class name (from HyperProfileAnimations.module.scss) */
export function getAnimationClass(animation: ProfileAnimation): string {
  if (animation === "shake") return "animateShake";
  if (animation === "flip") return "animateFlip";
  if (animation === "bounce") return "animateBounce";
  if (animation === "pulse") return "animatePulse";
  if (animation === "glow") return "animateGlow";
  if (animation === "slideIn") return "animateSlideIn";
  return "";
}

/** SVG data URI patterns for header backgrounds */
export const HEADER_PATTERNS: Record<string, string> = {
  dots: "data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(255,255,255,0.15)'/%3E%3C/svg%3E",
  grid: "data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1'/%3E%3C/svg%3E",
  diagonal: "data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-5,5 l10,-10 M0,20 l20,-20 M15,25 l10,-10' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3C/svg%3E",
  waves: "data:image/svg+xml,%3Csvg width='40' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q10 0 20 10 Q30 20 40 10' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3C/svg%3E",
  circles: "data:image/svg+xml,%3Csvg width='30' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='8' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1'/%3E%3C/svg%3E",
  chevrons: "data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 15 L10 5 L20 15' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3C/svg%3E",
};

/** Build CSSProperties for header background based on config */
export function getHeaderStyleVars(config: IHeaderConfig): React.CSSProperties {
  const result: React.CSSProperties = {};
  const style = config.style;

  if (style === "solid") {
    result.backgroundColor = config.primaryColor;
  } else if (style === "gradient") {
    result.background = "linear-gradient(135deg, " + (config.primaryColor || "#0078d4") + ", " + (config.secondaryColor || "#106ebe") + ")";
  } else if (style === "image" && config.imageUrl) {
    result.backgroundImage = "url(" + config.imageUrl + ")";
    result.backgroundSize = "cover";
    result.backgroundPosition = "center";
    result.backgroundRepeat = "no-repeat";
  } else if (style === "pattern") {
    const patternUrl = config.patternId ? HEADER_PATTERNS[config.patternId] : HEADER_PATTERNS.dots;
    result.backgroundColor = config.primaryColor;
    if (patternUrl) {
      result.backgroundImage = "url(\"" + patternUrl + "\")";
      result.backgroundRepeat = "repeat";
    }
  } else if (style === "accent") {
    result.borderTop = "4px solid " + (config.primaryColor || "#0078d4");
  }

  if (config.height) {
    result.minHeight = config.height + "px";
  }

  return result;
}

/** Get photo shape CSS properties */
export function getPhotoShapeStyle(shape: string): React.CSSProperties {
  if (shape === "circle") return { borderRadius: "50%" };
  if (shape === "rounded") return { borderRadius: "16px" };
  if (shape === "square") return { borderRadius: "0" };
  if (shape === "hexagon") return { clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" };
  if (shape === "diamond") return { clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" };
  if (shape === "shield") return { clipPath: "polygon(50% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%, 0% 0%)" };
  return { borderRadius: "50%" };
}
