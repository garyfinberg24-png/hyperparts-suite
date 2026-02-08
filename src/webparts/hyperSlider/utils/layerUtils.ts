import * as React from "react";
import type {
  ISliderLayer,
  ISliderSlide,
  PositionUnit,
  SizeUnit
} from "../models";

/**
 * Build CSS position style from layer position
 */
export function getLayerPositionStyle(
  x: number,
  y: number,
  xUnit: PositionUnit,
  yUnit: PositionUnit
): React.CSSProperties {
  return {
    left: x + xUnit,
    top: y + yUnit
  };
}

/**
 * Build CSS size style from layer size
 */
export function getLayerSizeStyle(
  w: number,
  h: number,
  wUnit: SizeUnit,
  hUnit: SizeUnit
): React.CSSProperties {
  return {
    width: wUnit === "auto" ? "auto" : w + wUnit,
    height: hUnit === "auto" ? "auto" : h + hUnit
  };
}

/**
 * Type guard: Check if layer is text layer
 */
export function isTextLayer(layer: ISliderLayer): boolean {
  return layer.type === "text";
}

/**
 * Type guard: Check if layer is image layer
 */
export function isImageLayer(layer: ISliderLayer): boolean {
  return layer.type === "image";
}

/**
 * Type guard: Check if layer is video layer
 */
export function isVideoLayer(layer: ISliderLayer): boolean {
  return layer.type === "video";
}

/**
 * Type guard: Check if layer is button layer
 */
export function isButtonLayer(layer: ISliderLayer): boolean {
  return layer.type === "button";
}

/**
 * Type guard: Check if layer is shape layer
 */
export function isShapeLayer(layer: ISliderLayer): boolean {
  return layer.type === "shape";
}

/**
 * Type guard: Check if layer is icon layer
 */
export function isIconLayer(layer: ISliderLayer): boolean {
  return layer.type === "icon";
}

/**
 * Type guard: Check if layer is lottie layer
 */
export function isLottieLayer(layer: ISliderLayer): boolean {
  return layer.type === "lottie";
}

/**
 * Type guard: Check if layer is group layer
 */
export function isGroupLayer(layer: ISliderLayer): boolean {
  return layer.type === "group";
}

/**
 * Get thumbnail URL from slide (background image or first image layer)
 */
export function getSlideThumbnailUrl(slide: ISliderSlide): string {
  // Check background image first
  if (slide.background && slide.background.imageUrl) {
    return slide.background.imageUrl;
  }

  // Look for first image layer
  if (slide.layers && Array.isArray(slide.layers)) {
    for (let i = 0; i < slide.layers.length; i++) {
      const layer = slide.layers[i];
      if (isImageLayer(layer) && layer.imageConfig && layer.imageConfig.url) {
        return layer.imageConfig.url;
      }
    }
  }

  return "";
}
