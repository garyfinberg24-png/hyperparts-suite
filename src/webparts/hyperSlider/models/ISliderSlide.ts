// ─── Slide Model ──────────────────────────────────────────────────────────────
import type { IAudienceTarget } from "../../../common/models";
import type { SlideBackgroundType, GradientType, EasingType, TransitionType } from "./IHyperSliderEnums";
import type { ISliderVideoConfig, ISliderLottieConfig, ISliderLayer } from "./ISliderLayer";
import type { ISliderKenBurns } from "./ISliderTransition";
import { DEFAULT_KEN_BURNS } from "./ISliderTransition";

// ─── Gradient ────────────────────────────────────────────────────────────────

export interface ISliderGradientStop {
  color: string;
  opacity: number;
  position: number;
}

export interface ISliderGradient {
  type: GradientType;
  angle: string;
  stops: ISliderGradientStop[];
}

export const DEFAULT_OVERLAY_GRADIENT: ISliderGradient = {
  type: "linear",
  angle: "180deg",
  stops: [
    { color: "#000000", opacity: 0, position: 0 },
    { color: "#000000", opacity: 0.5, position: 100 },
  ],
};

// ─── Slide Background ────────────────────────────────────────────────────────

export interface ISlideBackgroundParallax {
  enabled: boolean;
  speed: number;
}

export interface ISlideBackground {
  type: SlideBackgroundType;
  imageUrl: string;
  imageAlt: string;
  focalPoint: { x: number; y: number };
  video?: ISliderVideoConfig;
  lottie?: ISliderLottieConfig;
  gradient?: ISliderGradient;
  backgroundColor: string;
  parallax: ISlideBackgroundParallax;
  overlay?: ISliderGradient;
}

export const DEFAULT_BACKGROUND: ISlideBackground = {
  type: "solidColor",
  imageUrl: "",
  imageAlt: "",
  focalPoint: { x: 50, y: 50 },
  backgroundColor: "#0078d4",
  parallax: { enabled: false, speed: 0.5 },
};

// ─── Slide Transition Override ───────────────────────────────────────────────

export interface ISlideTransitionOverride {
  type: TransitionType;
  duration: number;
  easing: EasingType;
}

// ─── Slide ───────────────────────────────────────────────────────────────────

/** A single slide in the slider */
export interface ISliderSlide {
  id: string;
  title: string;
  layers: ISliderLayer[];
  background: ISlideBackground;
  transition?: ISlideTransitionOverride;
  duration: number;
  kenBurns: ISliderKenBurns;
  audienceTarget: IAudienceTarget;
  publishDate?: string;
  unpublishDate?: string;
  enabled: boolean;
  sortOrder: number;
}

export const DEFAULT_SLIDE: ISliderSlide = {
  id: "slide-default",
  title: "Slide 1",
  layers: [],
  background: DEFAULT_BACKGROUND,
  duration: 5000,
  kenBurns: DEFAULT_KEN_BURNS,
  audienceTarget: { enabled: false, groups: [], matchAll: false },
  enabled: true,
  sortOrder: 0,
};
