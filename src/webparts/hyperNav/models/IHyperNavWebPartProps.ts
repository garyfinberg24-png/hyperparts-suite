import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { HyperNavLayoutMode } from "./IHyperNavLink";

export interface IHyperNavWebPartProps extends IBaseHyperWebPartProps {
  title: string;
  layoutMode: HyperNavLayoutMode;
  links: string;
  groups: string;
  gridColumns: number;
  showIcons: boolean;
  showDescriptions: boolean;
  showSearch: boolean;
  showExternalBadge: boolean;
  externalBadgeIcon: string;
  enableAudienceTargeting: boolean;
  enablePersonalization: boolean;
  enableAnalytics: boolean;
  enableLinkHealthCheck: boolean;
  enableGrouping: boolean;
  enableDeepLinks: boolean;
}
