import type { IAudienceTarget } from "../../../common/models";

/** Icon configuration for a link */
export interface IHyperLinkIcon {
  type: "fluent" | "emoji" | "custom";
  value: string;
  color?: string;
}

/** Available layout modes */
export type HyperLinksLayoutMode =
  | "compact"
  | "filmstrip"
  | "grid"
  | "button"
  | "list"
  | "tiles"
  | "card"
  | "iconGrid";

/** Tile size presets */
export type HyperLinksTileSize = "small" | "medium" | "large";

/** Icon size presets */
export type HyperLinksIconSize = "small" | "medium" | "large";

/** Hover effect options */
export type HyperLinksHoverEffect =
  | "none" | "lift" | "glow" | "zoom" | "darken"
  | "pulse" | "bounce" | "shake" | "rotate" | "shimmer";

/** Border radius presets */
export type HyperLinksBorderRadius = "none" | "small" | "medium" | "large" | "round";

/** Compact layout alignment */
export type HyperLinksAlignment = "left" | "center" | "right";

/** Background mode for links container */
export type HyperLinksBackgroundMode = "none" | "color" | "gradient" | "image";

/** Background configuration for the links container */
export interface IHyperLinksBackground {
  mode: HyperLinksBackgroundMode;
  color?: string;
  gradient?: string;
  imageUrl?: string;
  imageDarken?: boolean;
}

/** Preset style definition for the links gallery */
export interface IHyperLinkPresetStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
  background: IHyperLinksBackground;
  hoverEffect: HyperLinksHoverEffect;
  borderRadius: HyperLinksBorderRadius;
  textColor?: string;
  iconColor?: string;
}

/** Default background */
export var DEFAULT_BACKGROUND: IHyperLinksBackground = {
  mode: "none",
};

/** A single quick link */
export interface IHyperLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: IHyperLinkIcon;
  thumbnailUrl?: string;
  backgroundColor?: string;
  openInNewTab: boolean;
  audienceTarget: IAudienceTarget;
  groupName?: string;
  sortOrder: number;
  enabled: boolean;
}

/** A link group definition */
export interface IHyperLinkGroup {
  id: string;
  name: string;
  sortOrder: number;
  collapsed: boolean;
}

export const DEFAULT_AUDIENCE_TARGET: IAudienceTarget = {
  enabled: false,
  groups: [],
  matchAll: false,
};

export const DEFAULT_HYPER_LINK: IHyperLink = {
  id: "link-1",
  title: "New Link",
  url: "",
  openInNewTab: false,
  audienceTarget: DEFAULT_AUDIENCE_TARGET,
  sortOrder: 0,
  enabled: true,
};

export const SAMPLE_LINKS: IHyperLink[] = [
  {
    id: "link-1",
    title: "SharePoint Home",
    url: "https://www.office.com",
    icon: { type: "fluent", value: "Home" },
    openInNewTab: false,
    audienceTarget: DEFAULT_AUDIENCE_TARGET,
    sortOrder: 0,
    enabled: true,
  },
  {
    id: "link-2",
    title: "Microsoft Teams",
    url: "https://teams.microsoft.com",
    icon: { type: "fluent", value: "TeamsLogo" },
    openInNewTab: true,
    audienceTarget: DEFAULT_AUDIENCE_TARGET,
    sortOrder: 1,
    enabled: true,
  },
  {
    id: "link-3",
    title: "Outlook",
    url: "https://outlook.office.com",
    icon: { type: "fluent", value: "OutlookLogo" },
    openInNewTab: true,
    audienceTarget: DEFAULT_AUDIENCE_TARGET,
    sortOrder: 2,
    enabled: true,
  },
  {
    id: "link-4",
    title: "OneDrive",
    url: "https://onedrive.live.com",
    description: "Your personal cloud storage",
    icon: { type: "fluent", value: "OneDrive" },
    openInNewTab: true,
    audienceTarget: DEFAULT_AUDIENCE_TARGET,
    sortOrder: 3,
    enabled: true,
  },
];
