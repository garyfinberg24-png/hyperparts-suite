// ─── Layer Model & Type-Specific Configs ──────────────────────────────────────
import type {
  LayerType, VideoSource, ShapeType, ButtonVariant,
  IconPosition, PositionUnit, SizeUnit,
} from "./IHyperSliderEnums";
import type { ILayerAnimation } from "./ISliderAnimation";
import type { ILayerResponsive } from "./ISliderResponsive";
import { DEFAULT_ANIMATION } from "./ISliderAnimation";
import { DEFAULT_RESPONSIVE } from "./ISliderResponsive";

// ─── Layer Position & Size ───────────────────────────────────────────────────

export interface ILayerPosition {
  x: number;
  y: number;
  xUnit: PositionUnit;
  yUnit: PositionUnit;
}

export interface ILayerSize {
  width: number;
  height: number;
  widthUnit: SizeUnit;
  heightUnit: SizeUnit;
}

// ─── Type-Specific Layer Configs ─────────────────────────────────────────────

/** Text layer: rich HTML content with typography */
export interface ITextLayerConfig {
  content: string;
  fontSize: number;
  fontWeight: string;
  fontFamily: string;
  color: string;
  textAlign: string;
  lineHeight: string;
  letterSpacing: number;
  textShadow: string;
  whiteSpace: string;
}

/** Image layer: positioned image with optional mask */
export interface IImageLayerConfig {
  url: string;
  alt: string;
  objectFit: string;
  objectPosition: string;
  borderRadius: number;
  opacity: number;
  mask: string;
}

/** Video layer: MP4/YouTube/Vimeo with playback controls */
export interface ISliderVideoConfig {
  source: VideoSource;
  url: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  posterUrl: string;
  controls: boolean;
}

/** Button layer: CTA link with variants */
export interface IButtonLayerConfig {
  label: string;
  url: string;
  openInNewTab: boolean;
  variant: ButtonVariant;
  iconName: string;
  iconPosition: IconPosition;
  customBgColor: string;
  customTextColor: string;
  borderRadius: number;
  padding: { top: number; right: number; bottom: number; left: number };
}

/** Shape layer: SVG primitives */
export interface IShapeLayerConfig {
  shape: ShapeType;
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius: number;
  opacity: number;
  svgPath: string;
}

/** Icon layer: Fluent UI icon */
export interface IIconLayerConfig {
  iconName: string;
  size: number;
  color: string;
  backgroundColor: string;
  borderRadius: number;
}

/** Lottie layer: animated JSON */
export interface ISliderLottieConfig {
  url: string;
  loop: boolean;
  autoplay: boolean;
  speed: number;
  renderer: "svg" | "canvas";
}

/** Group layer: container with child layers */
export interface IGroupLayerConfig {
  childLayers: ISliderLayer[];
}

// ─── Main Layer Interface ────────────────────────────────────────────────────

/** A single positioned, animated layer within a slide */
export interface ISliderLayer {
  id: string;
  type: LayerType;
  zIndex: number;
  position: ILayerPosition;
  size: ILayerSize;
  responsive: ILayerResponsive;
  animation: ILayerAnimation;

  // Type-specific configs (only one populated per layer)
  textConfig?: ITextLayerConfig;
  imageConfig?: IImageLayerConfig;
  videoConfig?: ISliderVideoConfig;
  buttonConfig?: IButtonLayerConfig;
  shapeConfig?: IShapeLayerConfig;
  iconConfig?: IIconLayerConfig;
  lottieConfig?: ISliderLottieConfig;
  groupConfig?: IGroupLayerConfig;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export const DEFAULT_POSITION: ILayerPosition = {
  x: 50,
  y: 50,
  xUnit: "%",
  yUnit: "%",
};

export const DEFAULT_SIZE: ILayerSize = {
  width: 300,
  height: 50,
  widthUnit: "px",
  heightUnit: "px",
};

export const DEFAULT_TEXT_CONFIG: ITextLayerConfig = {
  content: "Sample Text",
  fontSize: 24,
  fontWeight: "600",
  fontFamily: "inherit",
  color: "#ffffff",
  textAlign: "center",
  lineHeight: "1.4",
  letterSpacing: 0,
  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  whiteSpace: "normal",
};

export const DEFAULT_IMAGE_CONFIG: IImageLayerConfig = {
  url: "",
  alt: "",
  objectFit: "cover",
  objectPosition: "50% 50%",
  borderRadius: 0,
  opacity: 1,
  mask: "",
};

export const DEFAULT_VIDEO_CONFIG: ISliderVideoConfig = {
  source: "mp4",
  url: "",
  autoplay: true,
  loop: true,
  muted: true,
  posterUrl: "",
  controls: false,
};

export const DEFAULT_BUTTON_CONFIG: IButtonLayerConfig = {
  label: "Learn More",
  url: "#",
  openInNewTab: false,
  variant: "primary",
  iconName: "",
  iconPosition: "before",
  customBgColor: "#0078d4",
  customTextColor: "#ffffff",
  borderRadius: 4,
  padding: { top: 10, right: 24, bottom: 10, left: 24 },
};

export const DEFAULT_SHAPE_CONFIG: IShapeLayerConfig = {
  shape: "rectangle",
  fill: "rgba(0,0,0,0.3)",
  stroke: "transparent",
  strokeWidth: 0,
  borderRadius: 0,
  opacity: 1,
  svgPath: "",
};

export const DEFAULT_ICON_CONFIG: IIconLayerConfig = {
  iconName: "Info",
  size: 32,
  color: "#ffffff",
  backgroundColor: "transparent",
  borderRadius: 0,
};

export const DEFAULT_LOTTIE_CONFIG: ISliderLottieConfig = {
  url: "",
  loop: true,
  autoplay: true,
  speed: 1,
  renderer: "svg",
};

export const DEFAULT_LAYER: ISliderLayer = {
  id: "layer-default",
  type: "text",
  zIndex: 1,
  position: DEFAULT_POSITION,
  size: DEFAULT_SIZE,
  responsive: DEFAULT_RESPONSIVE,
  animation: DEFAULT_ANIMATION,
  textConfig: DEFAULT_TEXT_CONFIG,
};
