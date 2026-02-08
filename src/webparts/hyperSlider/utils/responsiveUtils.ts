import {
  ILayerPosition,
  ILayerSize,
  ISliderLayer,
  ILayerBreakpointOverride,
  BreakpointKey,
  BREAKPOINT_WIDTHS,
  BREAKPOINT_ORDER
} from "../models";

/**
 * Resolve layer position for current breakpoint
 */
export function resolveLayerPosition(
  base: ILayerPosition,
  overrides: Partial<Record<BreakpointKey, ILayerBreakpointOverride>> | undefined,
  breakpoint: BreakpointKey
): ILayerPosition {
  if (!overrides || !overrides[breakpoint]) {
    return base;
  }

  const override = overrides[breakpoint];
  const resolved: ILayerPosition = {
    x: override !== undefined && override.x !== undefined ? override.x : base.x,
    y: override !== undefined && override.y !== undefined ? override.y : base.y,
    xUnit: base.xUnit,
    yUnit: base.yUnit
  };

  return resolved;
}

/**
 * Resolve layer size for current breakpoint
 */
export function resolveLayerSize(
  base: ILayerSize,
  overrides: Partial<Record<BreakpointKey, ILayerBreakpointOverride>> | undefined,
  breakpoint: BreakpointKey
): ILayerSize {
  if (!overrides || !overrides[breakpoint]) {
    return base;
  }

  const override = overrides[breakpoint];
  const resolved: ILayerSize = {
    width: override !== undefined && override.width !== undefined ? override.width : base.width,
    height: override !== undefined && override.height !== undefined ? override.height : base.height,
    widthUnit: base.widthUnit,
    heightUnit: base.heightUnit
  };

  return resolved;
}

/**
 * Check if layer is visible at current breakpoint
 */
export function isLayerVisibleAtBreakpoint(
  layer: ISliderLayer,
  breakpoint: BreakpointKey
): boolean {
  if (!layer.responsive || !layer.responsive.visibleOn) {
    return true;
  }

  return layer.responsive.visibleOn[breakpoint] !== false;
}

/**
 * Get breakpoint key from window width
 */
export function getBreakpointFromWidth(width: number): BreakpointKey {
  // Iterate in reverse order (largest to smallest)
  for (let i = BREAKPOINT_ORDER.length - 1; i >= 0; i--) {
    const key = BREAKPOINT_ORDER[i];
    if (width >= BREAKPOINT_WIDTHS[key]) {
      return key;
    }
  }

  // Default to mobile if width is smaller than all breakpoints
  return "mobile";
}
