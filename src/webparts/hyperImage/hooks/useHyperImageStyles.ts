import * as React from "react";
import type { IFilterConfig } from "../models/IHyperImageFilter";
import type { IBorderConfig } from "../models/IHyperImageBorder";
import type { ShapeMask } from "../models/IHyperImageShape";
import type { ShadowPreset } from "../models/IHyperImageBorder";
import { getShapeClipPath } from "../models/IHyperImageShape";
import { buildFilterString } from "../models/IHyperImageFilter";
import { SHADOW_PRESETS } from "../models/IHyperImageBorder";

export interface IUseHyperImageStylesOptions {
  shape: ShapeMask;
  customClipPath?: string;
  filterConfig: IFilterConfig;
  borderConfig: IBorderConfig;
  shadowPreset: ShadowPreset;
  objectFit: string;
  maxWidth: number;
  maxHeight: number;
  aspectRatio: string;
}

export interface IHyperImageStyles {
  containerStyle: React.CSSProperties;
  imageStyle: React.CSSProperties;
  figureStyle: React.CSSProperties;
}

/**
 * Builds computed CSS styles for the image container, figure, and img element.
 * Uses React.useMemo to avoid recalculating on every render.
 */
export function useHyperImageStyles(options: IUseHyperImageStylesOptions): IHyperImageStyles {
  return React.useMemo(function (): IHyperImageStyles {
    var clipPath = getShapeClipPath(options.shape, options.customClipPath);
    var filterStr = buildFilterString(options.filterConfig);
    var shadow = SHADOW_PRESETS[options.shadowPreset] || "none";
    var b = options.borderConfig;

    var containerStyle: React.CSSProperties = {
      maxWidth: options.maxWidth > 0 ? options.maxWidth + "px" : undefined,
      maxHeight: options.maxHeight > 0 ? options.maxHeight + "px" : undefined,
    };

    var figureStyle: React.CSSProperties = {
      margin: 0,
      lineHeight: 0,
      borderWidth: b.width > 0 ? b.width + "px" : undefined,
      borderColor: b.width > 0 ? b.color : undefined,
      borderStyle: b.width > 0 ? b.style : undefined,
      borderRadius: b.radius > 0 ? b.radius + "px" : undefined,
      padding: b.padding > 0 ? b.padding + "px" : undefined,
      boxShadow: shadow !== "none" ? shadow : undefined,
      overflow: "hidden",
    };

    var imageStyle: React.CSSProperties = {
      display: "block",
      width: "100%",
      objectFit: options.objectFit as React.CSSProperties["objectFit"],
      clipPath: clipPath !== "none" ? clipPath : undefined,
      WebkitClipPath: clipPath !== "none" ? clipPath : undefined,
      filter: filterStr !== "none" ? filterStr : undefined,
      aspectRatio: options.aspectRatio !== "auto" ? options.aspectRatio : undefined,
    };

    return { containerStyle: containerStyle, imageStyle: imageStyle, figureStyle: figureStyle };
  }, [
    options.shape, options.customClipPath,
    options.filterConfig, options.borderConfig,
    options.shadowPreset, options.objectFit,
    options.maxWidth, options.maxHeight, options.aspectRatio,
  ]);
}
