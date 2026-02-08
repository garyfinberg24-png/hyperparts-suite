// ─── Responsive Breakpoint Configuration ──────────────────────────────────────
import type { BreakpointKey } from "./IHyperSliderEnums";

/** Breakpoint width thresholds (matches useResponsive in common/) */
export const BREAKPOINT_WIDTHS: Record<BreakpointKey, number> = {
  mobile: 0,
  tablet: 480,
  desktop: 768,
  widescreen: 1280,
};

/** Breakpoint order for fallback resolution (smallest to largest) */
export const BREAKPOINT_ORDER: BreakpointKey[] = ["mobile", "tablet", "desktop", "widescreen"];

/** Per-breakpoint visibility flags for a layer */
export interface ILayerVisibility {
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
  widescreen: boolean;
}

/** Partial position/size override for a single breakpoint */
export interface ILayerBreakpointOverride {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/** Full responsive configuration for a layer */
export interface ILayerResponsive {
  visibleOn: ILayerVisibility;
  overrides?: Partial<Record<BreakpointKey, ILayerBreakpointOverride>>;
}

export const DEFAULT_VISIBILITY: ILayerVisibility = {
  mobile: true,
  tablet: true,
  desktop: true,
  widescreen: true,
};

export const DEFAULT_RESPONSIVE: ILayerResponsive = {
  visibleOn: DEFAULT_VISIBILITY,
};
