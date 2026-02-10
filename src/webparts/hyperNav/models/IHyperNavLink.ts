import type { IAudienceTarget } from "../../../common/models";

/** Fluent UI icon or custom SVG */
export interface IHyperNavIcon {
  type: "fluent" | "custom";
  value: string;
  color?: string;
}

/** Deep link target type */
export type HyperNavDeepLinkType = "standard" | "teams" | "powerapp" | "viva";

/** Layout mode for the navigation web part (V2: 15 layouts) */
export type HyperNavLayoutMode =
  | "compact"
  | "tiles"
  | "grid"
  | "list"
  | "iconOnly"
  | "card"
  | "megaMenu"
  | "sidebar"
  | "topbar"
  | "dropdown"
  | "tabbar"
  | "hamburger"
  | "breadcrumb"
  | "cmdPalette"
  | "fab";

/** Hover effect for links */
export type HyperNavHoverEffect =
  | "lift"
  | "glow"
  | "zoom"
  | "darken"
  | "underline"
  | "bgfill"
  | "none";

/** Color configuration for link states */
export interface IHyperNavColorConfig {
  linkDefault: string;
  linkHover: string;
  linkActive: string;
  linkVisited: string;
  btnDefaultBg: string;
  btnDefaultText: string;
  btnHoverBg: string;
  btnHoverText: string;
  btnPressedBg: string;
  btnPressedText: string;
}

/** Dropdown / flyout panel animation type */
export type HyperNavPanelAnimation = "fade" | "slide" | "scale" | "none";

/** Dropdown / flyout panel shadow size */
export type HyperNavPanelShadow = "none" | "small" | "medium" | "large";

/** Dropdown / flyout panel configuration */
export interface IHyperNavPanelConfig {
  background: string;
  borderColor: string;
  shadow: HyperNavPanelShadow;
  animation: HyperNavPanelAnimation;
  columns: string;
  padding: number;
  maxHeight: number;
  borderRadius: number;
}

/** Border radius preset */
export type HyperNavBorderRadius = "none" | "slight" | "rounded" | "pill";

/** Theme mode */
export type HyperNavTheme = "light" | "dark" | "auto";

/** Separator style between inline links */
export type HyperNavSeparator = "line" | "dot" | "slash" | "pipe" | "none";

/** Default color config */
export var DEFAULT_COLOR_CONFIG: IHyperNavColorConfig = {
  linkDefault: "#323130",
  linkHover: "#0078d4",
  linkActive: "#004578",
  linkVisited: "#8764b8",
  btnDefaultBg: "#0078d4",
  btnDefaultText: "#ffffff",
  btnHoverBg: "#106ebe",
  btnHoverText: "#ffffff",
  btnPressedBg: "#004578",
  btnPressedText: "#ffffff",
};

/** Default panel config */
export var DEFAULT_PANEL_CONFIG: IHyperNavPanelConfig = {
  background: "#ffffff",
  borderColor: "#edebe9",
  shadow: "large",
  animation: "fade",
  columns: "1",
  padding: 12,
  maxHeight: 400,
  borderRadius: 8,
};

/** A single navigation link (recursive for nesting, max 4 levels) */
export interface IHyperNavLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: IHyperNavIcon;
  openInNewTab: boolean;
  audienceTarget: IAudienceTarget;
  groupName?: string;
  children: IHyperNavLink[];
  sortOrder: number;
  enabled: boolean;
  isExternal?: boolean;
  deepLinkType?: HyperNavDeepLinkType;
}

/** A named group for organizing links */
export interface IHyperNavGroup {
  id: string;
  name: string;
  sortOrder: number;
  collapsed: boolean;
}

/** Default audience target (disabled) */
export const DEFAULT_AUDIENCE_TARGET: IAudienceTarget = {
  enabled: false,
  groups: [],
  matchAll: false,
};

/** Default link for new entries */
export const DEFAULT_NAV_LINK: IHyperNavLink = {
  id: "link-1",
  title: "New Link",
  url: "",
  openInNewTab: false,
  audienceTarget: DEFAULT_AUDIENCE_TARGET,
  children: [],
  sortOrder: 0,
  enabled: true,
};

/** Preconfigured sample links for manifest */
export const SAMPLE_LINKS: IHyperNavLink[] = [
  {
    id: "link-1",
    title: "SharePoint Home",
    url: "https://www.office.com",
    openInNewTab: false,
    audienceTarget: DEFAULT_AUDIENCE_TARGET,
    children: [],
    sortOrder: 0,
    enabled: true,
  },
  {
    id: "link-2",
    title: "Microsoft Teams",
    url: "https://teams.microsoft.com",
    openInNewTab: true,
    audienceTarget: DEFAULT_AUDIENCE_TARGET,
    children: [],
    sortOrder: 1,
    enabled: true,
  },
];
