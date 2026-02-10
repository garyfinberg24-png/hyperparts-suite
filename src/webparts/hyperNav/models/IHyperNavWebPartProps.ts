import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type {
  HyperNavLayoutMode,
  HyperNavHoverEffect,
  HyperNavBorderRadius,
  HyperNavTheme,
  HyperNavSeparator,
} from "./IHyperNavLink";

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
  // V2: Styling
  hoverEffect: HyperNavHoverEffect;
  borderRadius: HyperNavBorderRadius;
  navTheme: HyperNavTheme;
  separator: HyperNavSeparator;
  // V2: Colors (serialized JSON)
  colorConfig: string;
  // V2: Dropdown / flyout panel (serialized JSON)
  panelConfig: string;
  // V2: Wizard / Demo / Sample
  wizardCompleted: boolean;
  useSampleData: boolean;
  enableDemoMode: boolean;
  // V2: Sticky nav
  enableStickyNav: boolean;
  // V2: Notifications badge
  enableNotifications: boolean;
  // V2: Active link auto-detection
  enableActiveDetection: boolean;
  // V2: Tooltips on hover
  enableTooltips: boolean;
  // V2: Command palette (Ctrl+K)
  enableCommandPalette: boolean;
  // V2: Dark mode toggle
  enableDarkModeToggle: boolean;
}
