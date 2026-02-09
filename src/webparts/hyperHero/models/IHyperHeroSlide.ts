import type { IAudienceTarget } from "../../../common/models";
import type { IHyperHeroCta } from "./IHyperHeroCta";
import type { IHyperHeroLayer } from "./IHyperHeroLayer";

/** Content mode for a slide — stack (flex column) or canvas (free positioning) */
export type ContentMode = "stack" | "canvas";

/** Background types for a hero slide */
export type BackgroundType = "image" | "video" | "lottie" | "solidColor";

/** Video source types */
export type VideoSource = "mp4" | "stream" | "youtube" | "vimeo";

/** Video background configuration */
export interface IHyperHeroVideoConfig {
  source: VideoSource;
  url: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  posterUrl?: string;
}

/** Lottie animation configuration */
export interface IHyperHeroLottieConfig {
  url: string;
  loop: boolean;
  autoplay: boolean;
  speed: number;
  renderer: "svg" | "canvas";
}

/** Slide background configuration */
export interface IHyperHeroSlideBackground {
  type: BackgroundType;
  imageUrl?: string;
  imageAlt?: string;
  imageFocalPoint?: { x: number; y: number };
  video?: IHyperHeroVideoConfig;
  lottie?: IHyperHeroLottieConfig;
  backgroundColor?: string;
}

/** Gradient overlay configuration */
export interface IHyperHeroGradient {
  enabled: boolean;
  type: "linear" | "radial";
  angle?: string;
  stops: IHyperHeroGradientStop[];
}

export interface IHyperHeroGradientStop {
  color: string;
  opacity: number;
  position: number;
}

/** Parallax configuration */
export interface IHyperHeroParallax {
  enabled: boolean;
  /** Speed factor (0.1 to 1.0, where 0.5 = half speed) */
  speed: number;
}

/** Countdown timer configuration */
export interface IHyperHeroCountdown {
  enabled: boolean;
  targetDate: string;
  label?: string;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  completedBehavior: "hide" | "showMessage";
  completedMessage?: string;
}

/** Slide link — makes the entire slide clickable */
export interface IHyperHeroSlideLink {
  url: string;
  openInNewTab: boolean;
  ariaLabel?: string;
}

/** Entrance animation types */
export type EntranceEffect = "fadeUp" | "fadeDown" | "fadeIn" | "slideLeft" | "slideRight" | "slideUp" | "slideDown" | "scaleUp" | "scaleDown" | "rotateIn" | "bounceIn" | "none";

/** Per-element animation configuration */
export interface IElementAnimation {
  effect: EntranceEffect;
  /** Delay in milliseconds (0-2000) */
  delayMs: number;
  /** Duration in milliseconds (200-2000) */
  durationMs: number;
}

/** Per-element animations for heading, subheading, description, CTAs */
export interface ISlideElementAnimations {
  heading?: IElementAnimation;
  subheading?: IElementAnimation;
  description?: IElementAnimation;
  ctas?: IElementAnimation;
}

/** Text overlay configuration — semi-transparent backdrop behind content */
export interface IHyperHeroTextOverlay {
  enabled: boolean;
  backgroundColor: string;
  opacity: number;
  padding: number;
  paddingHorizontal: number;
  paddingVertical: number;
  borderRadius: number;
  margin: number;
  maxWidth: number;
}

/** Per-element font settings */
export interface IHyperHeroFontSettings {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  letterSpacing: number;
  lineHeight: number;
  textTransform: string;
  textShadow: string;
}

/** Font configuration for heading, subheading, and description */
export interface IHyperHeroFontConfig {
  heading: IHyperHeroFontSettings;
  subheading: IHyperHeroFontSettings;
  description: IHyperHeroFontSettings;
}

/** Default font settings */
export const DEFAULT_FONT_SETTINGS: IHyperHeroFontSettings = {
  fontFamily: "Segoe UI",
  fontSize: 0,
  fontWeight: 0,
  color: "",
  letterSpacing: 0,
  lineHeight: 0,
  textTransform: "none",
  textShadow: "none",
};

/** Default element animation */
export const DEFAULT_ELEMENT_ANIMATION: IElementAnimation = {
  effect: "none",
  delayMs: 0,
  durationMs: 600,
};

/** A single HyperHero slide */
export interface IHyperHeroSlide {
  id: string;
  gridArea: string;
  heading: string;
  subheading?: string;
  description?: string;
  background: IHyperHeroSlideBackground;
  gradientOverlay?: IHyperHeroGradient;
  ctas: IHyperHeroCta[];
  audienceTarget: IAudienceTarget;
  countdown?: IHyperHeroCountdown;
  parallax?: IHyperHeroParallax;
  slideLink?: IHyperHeroSlideLink;
  entranceEffect?: EntranceEffect;
  /** Per-element entrance animations */
  elementAnimations?: ISlideElementAnimations;
  textAlign: "left" | "center" | "right";
  verticalAlign: "top" | "center" | "bottom";
  textColor?: string;
  /** Semi-transparent backdrop behind text content */
  textOverlay?: IHyperHeroTextOverlay;
  /** Per-element font customization */
  fontConfig?: IHyperHeroFontConfig;
  /** Content layout mode — "stack" (default flex column) or "canvas" (free positioning) */
  contentMode?: ContentMode;
  /** Free-positioned layers (used when contentMode is "canvas") */
  layers?: IHyperHeroLayer[];
  /** Per-slide transition effect override */
  slideTransition?: "fade" | "slide" | "zoom" | "kenBurns" | "flip" | "cube" | "cards" | "none";
  /** Per-slide transition duration in ms */
  slideTransitionDurationMs?: number;
  /** Per-slide transition easing */
  slideTransitionEasing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
  /** Hover effect applied to the slide */
  hoverEffect?: "none" | "zoom" | "darken" | "blur" | "kenBurns" | "colorShift" | "lift" | "glow" | "reveal";
  /** Ken Burns effect (slow zoom pan on static images) */
  kenBurnsEnabled?: boolean;
  /** Text backdrop blur (frosted glass behind text) */
  textBackdropEnabled?: boolean;
  /** Vignette darkening around edges */
  vignetteEnabled?: boolean;
  /** Internal notes (not displayed, editor-only) */
  internalNotes?: string;
  publishDate?: string;
  unpublishDate?: string;
  sortOrder: number;
  enabled: boolean;
}

/** Default gradient — dark bottom overlay for readable text on images */
export const DEFAULT_GRADIENT: IHyperHeroGradient = {
  enabled: true,
  type: "linear",
  angle: "180deg",
  stops: [
    { color: "#000000", opacity: 0, position: 0 },
    { color: "#000000", opacity: 0.6, position: 100 },
  ],
};

/** Default slide for first-time web part addition */
export const DEFAULT_SLIDE: IHyperHeroSlide = {
  id: "default-1",
  gridArea: "main",
  heading: "Welcome to HyperHero",
  subheading: "Click edit to customize this hero banner",
  background: { type: "solidColor", backgroundColor: "#0078d4" },
  gradientOverlay: DEFAULT_GRADIENT,
  ctas: [
    {
      id: "cta-1",
      label: "Learn More",
      url: "#",
      openInNewTab: false,
      variant: "primary",
      iconPosition: "before",
    },
  ],
  audienceTarget: { enabled: false, groups: [], matchAll: false },
  textAlign: "left",
  verticalAlign: "bottom",
  sortOrder: 0,
  enabled: true,
};
