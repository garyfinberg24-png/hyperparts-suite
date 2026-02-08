import * as React from "react";
import { hyperAnalytics } from "../../../common/services/HyperAnalytics";

export interface INavAnalyticsResult {
  /** Track a link click event */
  trackLinkClick: (linkId: string, linkTitle: string, linkUrl: string) => void;
}

/**
 * Analytics tracking for navigation link clicks.
 * Uses hyperAnalytics.trackEvent under the hood.
 */
export function useNavAnalytics(
  enabled: boolean
): INavAnalyticsResult {
  const trackLinkClick = React.useCallback(function (
    linkId: string,
    linkTitle: string,
    linkUrl: string
  ): void {
    if (!enabled) return;
    hyperAnalytics.trackEvent("hyperNav", "linkClick", {
      linkId: linkId,
      linkTitle: linkTitle,
      linkUrl: linkUrl,
    });
  }, [enabled]);

  return { trackLinkClick: trackLinkClick };
}
