import type {
  IHyperLink,
  HyperLinksIconSize,
  HyperLinksTileSize,
  HyperLinksHoverEffect,
  HyperLinksBorderRadius,
  HyperLinksAlignment,
} from "../../models";

/** Shared props interface for all layout components */
export interface ILinksLayoutProps {
  links: IHyperLink[];
  onLinkClick: (link: IHyperLink) => void;
  showIcons: boolean;
  showDescriptions: boolean;
  showThumbnails: boolean;
  iconSize: HyperLinksIconSize;
  tileSize: HyperLinksTileSize;
  gridColumns: number;
  hoverEffect: HyperLinksHoverEffect;
  borderRadius: HyperLinksBorderRadius;
  compactAlignment: HyperLinksAlignment;
  enableColorCustomization: boolean;
}

export { CompactLayout } from "./CompactLayout";
export { GridLayout } from "./GridLayout";
export { ListLayout } from "./ListLayout";
export { ButtonLayout } from "./ButtonLayout";
export { FilmstripLayout } from "./FilmstripLayout";
export { TilesLayout } from "./TilesLayout";
export { CardLayout } from "./CardLayout";
export { IconGridLayout } from "./IconGridLayout";
