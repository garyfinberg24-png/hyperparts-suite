import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type {
  HyperLinksLayoutMode,
  HyperLinksTileSize,
  HyperLinksIconSize,
  HyperLinksHoverEffect,
  HyperLinksBorderRadius,
  HyperLinksAlignment,
} from "./IHyperLink";

export interface IHyperLinksWebPartProps extends IBaseHyperWebPartProps {
  title: string;
  layoutMode: HyperLinksLayoutMode;
  links: string;
  gridColumns: number;
  tileSize: HyperLinksTileSize;
  showIcons: boolean;
  showDescriptions: boolean;
  showThumbnails: boolean;
  iconSize: HyperLinksIconSize;
  enableGrouping: boolean;
  groups: string;
  enableAudienceTargeting: boolean;
  enableAnalytics: boolean;
  enableColorCustomization: boolean;
  hoverEffect: HyperLinksHoverEffect;
  borderRadius: HyperLinksBorderRadius;
  compactAlignment: HyperLinksAlignment;
}
