import type { IAudienceTarget } from "../../../common/models";
import type { IHyperHeroCta } from "./IHyperHeroCta";

/** Background types for a hero tile */
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

/** Tile background configuration */
export interface IHyperHeroTileBackground {
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

/** Tile link — makes the entire tile clickable */
export interface IHyperHeroTileLink {
  url: string;
  openInNewTab: boolean;
  ariaLabel?: string;
}

/** Entrance animation types */
export type EntranceEffect = "fadeUp" | "slideLeft" | "slideRight" | "scaleUp" | "none";

/** A single HyperHero tile */
export interface IHyperHeroTile {
  id: string;
  gridArea: string;
  heading: string;
  subheading?: string;
  description?: string;
  background: IHyperHeroTileBackground;
  gradientOverlay?: IHyperHeroGradient;
  ctas: IHyperHeroCta[];
  audienceTarget: IAudienceTarget;
  countdown?: IHyperHeroCountdown;
  parallax?: IHyperHeroParallax;
  tileLink?: IHyperHeroTileLink;
  entranceEffect?: EntranceEffect;
  textAlign: "left" | "center" | "right";
  verticalAlign: "top" | "center" | "bottom";
  textColor?: string;
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

/** Default tile for first-time web part addition */
export const DEFAULT_TILE: IHyperHeroTile = {
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
