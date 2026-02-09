import type {
  HyperLinksLayoutMode,
  HyperLinksTileSize,
  HyperLinksIconSize,
  HyperLinksHoverEffect,
  HyperLinksBorderRadius,
  HyperLinksAlignment,
  HyperLinksBackgroundMode,
} from "./IHyperLink";

// ============================================================
// HyperLinks Wizard State — Configuration wizard data model
// ============================================================

/** Layout & style settings (Step 1) */
export interface IWizardLayoutStyle {
  layoutMode: HyperLinksLayoutMode;
  hoverEffect: HyperLinksHoverEffect;
  borderRadius: HyperLinksBorderRadius;
  tileSize: HyperLinksTileSize;
  gridColumns: number;
  compactAlignment: HyperLinksAlignment;
  backgroundMode: HyperLinksBackgroundMode;
  backgroundColor: string;
  backgroundGradient: string;
  backgroundImageUrl: string;
  backgroundImageDarken: boolean;
  textColor: string;
  iconColor: string;
  activePresetId: string;
}

/** Icons & display settings (Step 2) */
export interface IWizardIconsDisplay {
  showIcons: boolean;
  iconSize: HyperLinksIconSize;
  showDescriptions: boolean;
  showThumbnails: boolean;
  enableColorCustomization: boolean;
}

/** Grouping & targeting settings (Step 3) */
export interface IWizardGroupingTargeting {
  enableGrouping: boolean;
  enableAudienceTargeting: boolean;
  enableSearch: boolean;
}

/** Features settings (Step 4) */
export interface IWizardFeatures {
  enableAnalytics: boolean;
  enableHealthCheck: boolean;
  enablePopularBadges: boolean;
}

/** Complete wizard state */
export interface ILinksWizardState {
  layoutStyle: IWizardLayoutStyle;
  iconsDisplay: IWizardIconsDisplay;
  groupingTargeting: IWizardGroupingTargeting;
  features: IWizardFeatures;
}

/** Default wizard state for fresh configuration */
export var DEFAULT_LINKS_WIZARD_STATE: ILinksWizardState = {
  layoutStyle: {
    layoutMode: "grid",
    hoverEffect: "lift",
    borderRadius: "medium",
    tileSize: "medium",
    gridColumns: 4,
    compactAlignment: "left",
    backgroundMode: "none",
    backgroundColor: "",
    backgroundGradient: "",
    backgroundImageUrl: "",
    backgroundImageDarken: false,
    textColor: "",
    iconColor: "",
    activePresetId: "",
  },
  iconsDisplay: {
    showIcons: true,
    iconSize: "medium",
    showDescriptions: false,
    showThumbnails: false,
    enableColorCustomization: false,
  },
  groupingTargeting: {
    enableGrouping: false,
    enableAudienceTargeting: false,
    enableSearch: false,
  },
  features: {
    enableAnalytics: false,
    enableHealthCheck: false,
    enablePopularBadges: false,
  },
};

/** Layout mode display names */
export function getLayoutDisplayName(mode: HyperLinksLayoutMode): string {
  switch (mode) {
    case "compact": return "Compact";
    case "filmstrip": return "Filmstrip";
    case "grid": return "Grid";
    case "button": return "Button";
    case "list": return "List";
    case "tiles": return "Tiles";
    case "card": return "Card";
    case "iconGrid": return "Icon Grid";
    default: return mode;
  }
}

/** Hover effect display names */
export function getHoverEffectDisplayName(effect: HyperLinksHoverEffect): string {
  switch (effect) {
    case "none": return "None";
    case "lift": return "Lift";
    case "glow": return "Glow";
    case "zoom": return "Zoom";
    case "darken": return "Darken";
    case "pulse": return "Pulse";
    case "bounce": return "Bounce";
    case "shake": return "Shake";
    case "rotate": return "Rotate";
    case "shimmer": return "Shimmer";
    default: return effect;
  }
}

/** Background mode display names */
export function getBackgroundModeDisplayName(mode: HyperLinksBackgroundMode): string {
  switch (mode) {
    case "none": return "None";
    case "color": return "Solid Color";
    case "gradient": return "Gradient";
    case "image": return "Image";
    default: return mode;
  }
}

/** Border radius display names */
export function getBorderRadiusDisplayName(radius: HyperLinksBorderRadius): string {
  switch (radius) {
    case "none": return "None";
    case "small": return "Small";
    case "medium": return "Medium";
    case "large": return "Large";
    case "round": return "Round";
    default: return radius;
  }
}

/** Icon size display names */
export function getIconSizeDisplayName(size: HyperLinksIconSize): string {
  switch (size) {
    case "small": return "Small";
    case "medium": return "Medium";
    case "large": return "Large";
    default: return size;
  }
}

/** Count enabled features */
export function countEnabledFeatures(features: IWizardFeatures): number {
  var count = 0;
  if (features.enableAnalytics) { count++; }
  if (features.enableHealthCheck) { count++; }
  if (features.enablePopularBadges) { count++; }
  return count;
}
