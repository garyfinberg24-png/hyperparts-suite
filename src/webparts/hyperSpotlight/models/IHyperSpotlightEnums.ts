/** Employee selection mode */
export enum SelectionMode {
  Automatic = "automatic",
  Manual = "manual",
  SpList = "spList",
}

/** Celebration categories */
export enum SpotlightCategory {
  Birthday = "birthday",
  WorkAnniversary = "workAnniversary",
  Anniversary = "anniversary",
  Graduation = "graduation",
  Wedding = "wedding",
  Engagement = "engagement",
  Achievement = "achievement",
}

/** Date range options for automatic filtering */
export enum DateRange {
  ThisWeek = "thisWeek",
  ThisMonth = "thisMonth",
  ThisQuarter = "thisQuarter",
  Custom = "custom",
}

/** Layout modes */
export enum LayoutMode {
  Carousel = "carousel",
  Grid = "grid",
  Tiled = "tiled",
  Masonry = "masonry",
  List = "list",
  FeaturedHero = "featuredHero",
  Banner = "banner",
  Timeline = "timeline",
  WallOfFame = "wallOfFame",
}

/** Card visual styles */
export enum CardStyle {
  Standard = "standard",
  Overlay = "overlay",
  Split = "split",
  Compact = "compact",
  Celebration = "celebration",
}

/** Sort order options */
export enum SortOrder {
  NameAsc = "nameAsc",
  NameDesc = "nameDesc",
  DateAsc = "dateAsc",
  DateDesc = "dateDesc",
  Department = "department",
  Random = "random",
}

/** Card entrance animations */
export enum AnimationEntrance {
  None = "none",
  Fade = "fade",
  Slide = "slide",
  Zoom = "zoom",
  Bounce = "bounce",
}

/** Custom message position */
export enum MessagePosition {
  Above = "above",
  Below = "below",
  OverlayCenter = "overlayCenter",
  OverlayBottom = "overlayBottom",
  Hidden = "hidden",
}

/** Profile photo quality/size */
export enum ImageQuality {
  Low = "low",
  Medium = "medium",
  High = "high",
}

/* ── Property pane dropdown option arrays ── */

import type { IPropertyPaneDropdownOption } from "@microsoft/sp-property-pane";

export const SELECTION_MODE_OPTIONS: IPropertyPaneDropdownOption[] = [
  { key: SelectionMode.Automatic, text: "Automatic" },
  { key: SelectionMode.Manual, text: "Manual" },
  { key: SelectionMode.SpList, text: "SharePoint List" },
];

export const CATEGORY_OPTIONS: IPropertyPaneDropdownOption[] = [
  { key: SpotlightCategory.Birthday, text: "Birthday" },
  { key: SpotlightCategory.WorkAnniversary, text: "Work Anniversary" },
  { key: SpotlightCategory.Anniversary, text: "Personal Anniversary" },
  { key: SpotlightCategory.Graduation, text: "Graduation" },
  { key: SpotlightCategory.Wedding, text: "Wedding" },
  { key: SpotlightCategory.Engagement, text: "Engagement" },
  { key: SpotlightCategory.Achievement, text: "Achievement" },
];

export const DATE_RANGE_OPTIONS: IPropertyPaneDropdownOption[] = [
  { key: DateRange.ThisWeek, text: "This Week" },
  { key: DateRange.ThisMonth, text: "This Month" },
  { key: DateRange.ThisQuarter, text: "This Quarter" },
  { key: DateRange.Custom, text: "Custom Range" },
];

export const LAYOUT_MODE_OPTIONS: IPropertyPaneDropdownOption[] = [
  { key: LayoutMode.Grid, text: "Grid" },
  { key: LayoutMode.Carousel, text: "Carousel" },
  { key: LayoutMode.Tiled, text: "Tiled / Mosaic" },
  { key: LayoutMode.Masonry, text: "Masonry" },
  { key: LayoutMode.List, text: "List View" },
  { key: LayoutMode.FeaturedHero, text: "Featured Hero" },
  { key: LayoutMode.Banner, text: "Banner" },
  { key: LayoutMode.Timeline, text: "Timeline" },
  { key: LayoutMode.WallOfFame, text: "Wall of Fame" },
];

export const CARD_STYLE_OPTIONS: IPropertyPaneDropdownOption[] = [
  { key: CardStyle.Standard, text: "Standard" },
  { key: CardStyle.Overlay, text: "Overlay" },
  { key: CardStyle.Split, text: "Split" },
  { key: CardStyle.Compact, text: "Compact" },
  { key: CardStyle.Celebration, text: "Celebration" },
];

export const SORT_ORDER_OPTIONS: IPropertyPaneDropdownOption[] = [
  { key: SortOrder.NameAsc, text: "Name (A-Z)" },
  { key: SortOrder.NameDesc, text: "Name (Z-A)" },
  { key: SortOrder.DateAsc, text: "Date (Oldest First)" },
  { key: SortOrder.DateDesc, text: "Date (Newest First)" },
  { key: SortOrder.Department, text: "Department" },
  { key: SortOrder.Random, text: "Random" },
];

export const ANIMATION_OPTIONS: IPropertyPaneDropdownOption[] = [
  { key: AnimationEntrance.None, text: "None" },
  { key: AnimationEntrance.Fade, text: "Fade" },
  { key: AnimationEntrance.Slide, text: "Slide" },
  { key: AnimationEntrance.Zoom, text: "Zoom" },
  { key: AnimationEntrance.Bounce, text: "Bounce" },
];

export const MESSAGE_POSITION_OPTIONS: IPropertyPaneDropdownOption[] = [
  { key: MessagePosition.Above, text: "Above Content" },
  { key: MessagePosition.Below, text: "Below Content" },
  { key: MessagePosition.OverlayCenter, text: "Overlay (Center)" },
  { key: MessagePosition.OverlayBottom, text: "Overlay (Bottom)" },
  { key: MessagePosition.Hidden, text: "Hidden" },
];

export const IMAGE_QUALITY_OPTIONS: IPropertyPaneDropdownOption[] = [
  { key: ImageQuality.Low, text: "Low (48x48)" },
  { key: ImageQuality.Medium, text: "Medium (96x96)" },
  { key: ImageQuality.High, text: "High (240x240)" },
];
