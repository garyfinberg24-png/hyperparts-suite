// ─── Slide Transition Configuration ───────────────────────────────────────────
import type { TransitionType, EasingType } from "./IHyperSliderEnums";

/** Transition configuration for slides */
export interface ISliderTransition {
  type: TransitionType;
  duration: number;
  easing: EasingType;
}

/** Ken Burns pan+zoom configuration (per slide) */
export interface ISliderKenBurns {
  enabled: boolean;
  startScale: number;
  endScale: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const DEFAULT_TRANSITION: ISliderTransition = {
  type: "fade",
  duration: 800,
  easing: "easeInOut",
};

export const DEFAULT_KEN_BURNS: ISliderKenBurns = {
  enabled: false,
  startScale: 1,
  endScale: 1.2,
  startX: 50,
  startY: 50,
  endX: 50,
  endY: 50,
};

/** Maps EasingType to CSS cubic-bezier values */
export const EASING_CSS_MAP: Record<EasingType, string> = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  easeInBack: "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
  easeOutBack: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  easeInOutBack: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  easeInElastic: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  easeOutElastic: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  easeInOutElastic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  easeInBounce: "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
  easeOutBounce: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
};
