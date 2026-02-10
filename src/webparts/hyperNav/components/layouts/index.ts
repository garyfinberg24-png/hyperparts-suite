import type { IHyperNavLink, IHyperNavGroup } from "../../models";
import type { LinkHealthStatus } from "../../store/useHyperNavStore";

/** Shared props interface for all layout components */
export interface INavLayoutProps {
  links: IHyperNavLink[];
  groups: IHyperNavGroup[];
  onLinkClick: (link: IHyperNavLink) => void;
  showIcons: boolean;
  showDescriptions: boolean;
  showExternalBadge: boolean;
  externalBadgeIcon: string;
  showPinButton: boolean;
  pinnedLinkIds: string[];
  onTogglePin?: (linkId: string) => void;
  isPinned: (linkId: string) => boolean;
  searchQuery: string;
  gridColumns: number;
  healthMap?: Record<string, LinkHealthStatus>;
  isEditMode?: boolean;
  showDeepLinkIcon?: boolean;
}

export { CompactLayout } from "./CompactLayout";
export { TilesLayout } from "./TilesLayout";
export { GridLayout } from "./GridLayout";
export { ListLayout } from "./ListLayout";
export { IconOnlyLayout } from "./IconOnlyLayout";
export { CardLayout } from "./CardLayout";
export { MegaMenuLayout } from "./MegaMenuLayout";
export { SidebarLayout } from "./SidebarLayout";
export { TopBarLayout } from "./TopBarLayout";
export { DropdownLayout } from "./DropdownLayout";
export { TabBarLayout } from "./TabBarLayout";
export { HamburgerLayout } from "./HamburgerLayout";
export { BreadcrumbLayout } from "./BreadcrumbLayout";
export { CmdPaletteLayout } from "./CmdPaletteLayout";
export { FabLayout } from "./FabLayout";
