import type { CtaVariant } from "./IHyperHeroCta";
import type { IHyperHeroFontSettings, IHyperHeroTextOverlay } from "./IHyperHeroSlide";

/** Layer types available in canvas mode */
export type LayerType = "text" | "image" | "button" | "shape" | "icon";

/** Shape types for shape layers */
export type ShapeType = "rectangle" | "circle" | "line" | "triangle";

/** Image fit modes */
export type ImageFitMode = "cover" | "contain" | "fill";

/** A single layer in canvas mode */
export interface IHyperHeroLayer {
  id: string;
  type: LayerType;
  /** User-friendly label shown in layer list */
  name: string;
  /** Horizontal position as % from left (0-100) */
  x: number;
  /** Vertical position as % from top (0-100) */
  y: number;
  /** Width as % of slide width (1-100) */
  width: number;
  /** Height as % of slide height (0 = auto for text) */
  height: number;
  /** Rotation in degrees */
  rotation: number;
  /** Opacity 0-100 */
  opacity: number;
  /** Stacking order */
  zIndex: number;
  /** Whether layer is visible */
  visible: boolean;
  /** Whether layer is locked (prevents dragging) */
  locked: boolean;

  // ── Text layer fields ──
  textContent?: string;
  fontConfig?: IHyperHeroFontSettings;
  textOverlay?: IHyperHeroTextOverlay;

  // ── Image layer fields ──
  imageUrl?: string;
  imageAlt?: string;
  imageFit?: ImageFitMode;

  // ── Button layer fields ──
  buttonLabel?: string;
  buttonUrl?: string;
  buttonVariant?: CtaVariant;
  buttonOpenInNewTab?: boolean;

  // ── Shape layer fields ──
  shapeType?: ShapeType;
  shapeColor?: string;
  shapeBorderWidth?: number;
  shapeBorderColor?: string;

  // ── Icon layer fields ──
  iconEmoji?: string;
  iconSize?: number;
}

/** Default layer factory functions */
export function createDefaultLayer(type: LayerType, index: number): IHyperHeroLayer {
  const base: IHyperHeroLayer = {
    id: "layer-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    type: type,
    name: type.charAt(0).toUpperCase() + type.substring(1) + " " + (index + 1),
    x: 10,
    y: 10,
    width: 40,
    height: 0,
    rotation: 0,
    opacity: 100,
    zIndex: index + 1,
    visible: true,
    locked: false,
  };

  if (type === "text") {
    base.textContent = "Enter text here";
    base.height = 0; // auto for text
  } else if (type === "image") {
    base.imageUrl = "";
    base.imageFit = "cover";
    base.height = 30;
  } else if (type === "button") {
    base.buttonLabel = "Click Me";
    base.buttonUrl = "#";
    base.buttonVariant = "primary";
    base.buttonOpenInNewTab = false;
    base.width = 20;
    base.height = 0;
  } else if (type === "shape") {
    base.shapeType = "rectangle";
    base.shapeColor = "#0078d4";
    base.shapeBorderWidth = 0;
    base.shapeBorderColor = "#000000";
    base.height = 20;
  } else if (type === "icon") {
    base.iconEmoji = "\u2B50";
    base.iconSize = 48;
    base.width = 10;
    base.height = 0;
  }

  return base;
}
