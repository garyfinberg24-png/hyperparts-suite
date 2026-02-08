// ─── Navigation Configuration ─────────────────────────────────────────────────
import type {
  NavArrowStyle, BulletStyle, BulletPosition,
  ThumbnailPosition, SwipeDirection, VerticalAlign, HorizontalAlign,
} from "./IHyperSliderEnums";

/** Arrow navigation config */
export interface ISliderArrowsConfig {
  enabled: boolean;
  style: NavArrowStyle;
  size: number;
  backgroundColor: string;
  iconColor: string;
  position: "inside" | "outside";
  verticalAlign: VerticalAlign;
}

/** Bullet/dot navigation config */
export interface ISliderBulletsConfig {
  enabled: boolean;
  style: BulletStyle;
  size: number;
  activeColor: string;
  inactiveColor: string;
  position: BulletPosition;
  alignment: HorizontalAlign;
  spacing: number;
}

/** Thumbnail filmstrip config */
export interface ISliderThumbnailsConfig {
  enabled: boolean;
  position: ThumbnailPosition;
  width: number;
  height: number;
  gap: number;
  activeOpacity: number;
  inactiveOpacity: number;
}

/** Tab navigation config */
export interface ISliderTabsConfig {
  enabled: boolean;
  position: BulletPosition;
  labels: string[];
}

/** Progress bar config */
export interface ISliderProgressConfig {
  enabled: boolean;
  position: "top" | "bottom";
  height: number;
  color: string;
  backgroundColor: string;
}

/** Slide count display config */
export interface ISliderCountConfig {
  enabled: boolean;
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  format: string;
  color: string;
  fontSize: number;
}

/** Swipe/drag gesture config */
export interface ISliderSwipeConfig {
  enabled: boolean;
  threshold: number;
  direction: SwipeDirection;
}

/** Full navigation configuration */
export interface ISliderNavigation {
  arrows: ISliderArrowsConfig;
  bullets: ISliderBulletsConfig;
  thumbnails: ISliderThumbnailsConfig;
  tabs: ISliderTabsConfig;
  progress: ISliderProgressConfig;
  slideCount: ISliderCountConfig;
  keyboard: boolean;
  swipe: ISliderSwipeConfig;
}

export const DEFAULT_ARROWS: ISliderArrowsConfig = {
  enabled: true,
  style: "rounded",
  size: 40,
  backgroundColor: "rgba(0,0,0,0.5)",
  iconColor: "#ffffff",
  position: "inside",
  verticalAlign: "center",
};

export const DEFAULT_BULLETS: ISliderBulletsConfig = {
  enabled: true,
  style: "solid",
  size: 10,
  activeColor: "#ffffff",
  inactiveColor: "rgba(255,255,255,0.4)",
  position: "bottom",
  alignment: "center",
  spacing: 8,
};

export const DEFAULT_THUMBNAILS: ISliderThumbnailsConfig = {
  enabled: false,
  position: "bottom",
  width: 80,
  height: 60,
  gap: 8,
  activeOpacity: 1,
  inactiveOpacity: 0.5,
};

export const DEFAULT_TABS: ISliderTabsConfig = {
  enabled: false,
  position: "bottom",
  labels: [],
};

export const DEFAULT_PROGRESS: ISliderProgressConfig = {
  enabled: false,
  position: "bottom",
  height: 3,
  color: "#ffffff",
  backgroundColor: "rgba(255,255,255,0.2)",
};

export const DEFAULT_COUNT: ISliderCountConfig = {
  enabled: false,
  position: "bottomRight",
  format: "{current} / {total}",
  color: "#ffffff",
  fontSize: 14,
};

export const DEFAULT_SWIPE: ISliderSwipeConfig = {
  enabled: true,
  threshold: 50,
  direction: "horizontal",
};

export const DEFAULT_NAVIGATION: ISliderNavigation = {
  arrows: DEFAULT_ARROWS,
  bullets: DEFAULT_BULLETS,
  thumbnails: DEFAULT_THUMBNAILS,
  tabs: DEFAULT_TABS,
  progress: DEFAULT_PROGRESS,
  slideCount: DEFAULT_COUNT,
  keyboard: true,
  swipe: DEFAULT_SWIPE,
};
