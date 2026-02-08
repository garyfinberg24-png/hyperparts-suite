import { useMemo } from "react";
import type { Breakpoint } from "../../../common/models";
import type { HyperTabsDisplayMode } from "../models";

/**
 * Determines the effective display mode based on responsive breakpoint.
 * When responsive collapse is enabled, tabs mode auto-switches to accordion
 * on mobile/tablet breakpoints.
 */
export function useResponsiveMode(
  configuredMode: HyperTabsDisplayMode,
  breakpoint: Breakpoint,
  enableResponsiveCollapse: boolean
): HyperTabsDisplayMode {
  return useMemo(function (): HyperTabsDisplayMode {
    if (!enableResponsiveCollapse) return configuredMode;
    if (configuredMode !== "tabs") return configuredMode;
    if (breakpoint === "mobile" || breakpoint === "tablet") return "accordion";
    return "tabs";
  }, [configuredMode, breakpoint, enableResponsiveCollapse]);
}
