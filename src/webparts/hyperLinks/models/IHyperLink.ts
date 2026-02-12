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

/** Text label position relative to icon */
export type HyperLinksTextPosition = "right" | "below" | "above" | "left" | "hidden";

/** Button shape options */
export type HyperLinksButtonShape = "default" | "square" | "rounded" | "pill" | "circle";

/** Background mode for links container */
export type HyperLinksBackgroundMode = "none" | "color" | "gradient" | "image";

/** Style preset with background + colors */
export interface IHyperLinksStylePreset {
  id: string;
  name: string;
  backgroundMode: HyperLinksBackgroundMode;
  backgroundColor: string;
  backgroundGradient: string;
  textColor: string;
  iconColor: string;
  hoverEffect: HyperLinksHoverEffect;
  borderRadius: HyperLinksBorderRadius;
  buttonShape: HyperLinksButtonShape;
}

/** World-class style presets */
export var STYLE_PRESETS: IHyperLinksStylePreset[] = [
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    backgroundMode: "gradient",
    backgroundColor: "",
    backgroundGradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    textColor: "#ffffff",
    iconColor: "#64b5f6",
    hoverEffect: "lift",
    borderRadius: "medium",
    buttonShape: "rounded",
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    backgroundMode: "gradient",
    backgroundColor: "",
    backgroundGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ff9a76 100%)",
    textColor: "#ffffff",
    iconColor: "#ffffff",
    hoverEffect: "glow",
    borderRadius: "large",
    buttonShape: "pill",
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    backgroundMode: "gradient",
    backgroundColor: "",
    backgroundGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textColor: "#ffffff",
    iconColor: "#e0e7ff",
    hoverEffect: "lift",
    borderRadius: "medium",
    buttonShape: "rounded",
  },
  {
    id: "corporate-navy",
    name: "Corporate Navy",
    backgroundMode: "color",
    backgroundColor: "#0a1628",
    backgroundGradient: "",
    textColor: "#ffffff",
    iconColor: "#4fc3f7",
    hoverEffect: "lift",
    borderRadius: "small",
    buttonShape: "square",
  },
  {
    id: "fresh-mint",
    name: "Fresh Mint",
    backgroundMode: "gradient",
    backgroundColor: "",
    backgroundGradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    textColor: "#ffffff",
    iconColor: "#e0fff4",
    hoverEffect: "zoom",
    borderRadius: "large",
    buttonShape: "rounded",
  },
  {
    id: "warm-earth",
    name: "Warm Earth",
    backgroundMode: "color",
    backgroundColor: "#faf3e0",
    backgroundGradient: "",
    textColor: "#3e2723",
    iconColor: "#8d6e63",
    hoverEffect: "lift",
    borderRadius: "medium",
    buttonShape: "rounded",
  },
  {
    id: "glass-frost",
    name: "Glass Frost",
    backgroundMode: "color",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    backgroundGradient: "",
    textColor: "#1a1a2e",
    iconColor: "#0078d4",
    hoverEffect: "glow",
    borderRadius: "large",
    buttonShape: "pill",
  },
  {
    id: "neon-dark",
    name: "Neon Dark",
    backgroundMode: "color",
    backgroundColor: "#1a1a2e",
    backgroundGradient: "",
    textColor: "#e0e0e0",
    iconColor: "#00d4ff",
    hoverEffect: "glow",
    borderRadius: "medium",
    buttonShape: "rounded",
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    backgroundMode: "gradient",
    backgroundColor: "",
    backgroundGradient: "linear-gradient(135deg, #f4c4c4 0%, #e8b4b8 50%, #dba6a6 100%)",
    textColor: "#4a2020",
    iconColor: "#8b3a3a",
    hoverEffect: "lift",
    borderRadius: "large",
    buttonShape: "pill",
  },
  {
    id: "arctic-white",
    name: "Arctic White",
    backgroundMode: "color",
    backgroundColor: "#f8f9fa",
    backgroundGradient: "",
    textColor: "#212529",
    iconColor: "#0d6efd",
    hoverEffect: "lift",
    borderRadius: "small",
    buttonShape: "default",
  },
  {
    id: "aurora-borealis",
    name: "Aurora Borealis",
    backgroundMode: "gradient",
    backgroundColor: "",
    backgroundGradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    textColor: "#e8e8e8",
    iconColor: "#bb86fc",
    hoverEffect: "shimmer",
    borderRadius: "medium",
    buttonShape: "rounded",
  },
  {
    id: "sunshine-pop",
    name: "Sunshine Pop",
    backgroundMode: "gradient",
    backgroundColor: "",
    backgroundGradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    textColor: "#4a2c1a",
    iconColor: "#e65100",
    hoverEffect: "bounce",
    borderRadius: "large",
    buttonShape: "pill",
  },
];

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
