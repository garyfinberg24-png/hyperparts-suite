import type { IAudienceTarget } from "../../../common/models";

/** Fluent UI icon or custom SVG */
export interface IHyperNavIcon {
  type: "fluent" | "custom";
  value: string;
  color?: string;
}

/** Deep link target type */
export type HyperNavDeepLinkType = "standard" | "teams" | "powerapp" | "viva";

/** Layout mode for the navigation web part */
export type HyperNavLayoutMode =
  | "compact"
  | "tiles"
  | "grid"
  | "list"
  | "iconOnly"
  | "card"
  | "megaMenu"
  | "sidebar";

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
