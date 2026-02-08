// ─── Layer Animation Configuration ────────────────────────────────────────────
import type { EntranceAnimation, ExitAnimation, LoopAnimation, HoverEffect, EasingType } from "./IHyperSliderEnums";

/** Entrance animation configuration for a layer */
export interface ILayerEntranceAnim {
  type: EntranceAnimation;
  delay: number;
  duration: number;
  easing: EasingType;
}

/** Exit animation configuration for a layer */
export interface ILayerExitAnim {
  type: ExitAnimation;
  delay: number;
  duration: number;
  easing: EasingType;
}

/** Loop animation configuration for a layer */
export interface ILayerLoopAnim {
  type: LoopAnimation;
  duration: number;
  delay: number;
}

/** Hover effect configuration for a layer */
export interface ILayerHoverEffect {
  type: HoverEffect;
  scale: number;
  rotation: number;
  duration: number;
}

/** Scroll-based animation for a layer */
export interface ILayerScrollAnim {
  enabled: boolean;
  parallaxSpeed: number;
  opacityRange: [number, number];
  scaleRange: [number, number];
}

/** Full animation bundle for a single layer */
export interface ILayerAnimation {
  entrance: ILayerEntranceAnim;
  exit: ILayerExitAnim;
  loop: ILayerLoopAnim;
  hover: ILayerHoverEffect;
  scroll: ILayerScrollAnim;
}

export const DEFAULT_ENTRANCE: ILayerEntranceAnim = {
  type: "fade",
  delay: 0,
  duration: 600,
  easing: "easeOut",
};

export const DEFAULT_EXIT: ILayerExitAnim = {
  type: "fadeOut",
  delay: 0,
  duration: 400,
  easing: "easeIn",
};

export const DEFAULT_LOOP: ILayerLoopAnim = {
  type: "none",
  duration: 2000,
  delay: 0,
};

export const DEFAULT_HOVER: ILayerHoverEffect = {
  type: "none",
  scale: 1.05,
  rotation: 3,
  duration: 300,
};

export const DEFAULT_SCROLL: ILayerScrollAnim = {
  enabled: false,
  parallaxSpeed: 0.5,
  opacityRange: [1, 1],
  scaleRange: [1, 1],
};

export const DEFAULT_ANIMATION: ILayerAnimation = {
  entrance: DEFAULT_ENTRANCE,
  exit: DEFAULT_EXIT,
  loop: DEFAULT_LOOP,
  hover: DEFAULT_HOVER,
  scroll: DEFAULT_SCROLL,
};
