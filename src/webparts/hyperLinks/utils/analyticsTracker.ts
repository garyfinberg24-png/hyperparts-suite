import { hyperAnalytics } from "../../../common/services/HyperAnalytics";
import type { IHyperLink } from "../models";

/**
 * Track a link click event via HyperAnalytics.
 */
export function trackLinkClick(webPartId: string, link: IHyperLink): void {
  hyperAnalytics.trackEvent(webPartId, "linkClick", {
    linkId: link.id,
    linkTitle: link.title,
    linkUrl: link.url || "",
    openInNewTab: link.openInNewTab,
  });
}
