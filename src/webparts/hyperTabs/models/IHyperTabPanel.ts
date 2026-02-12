import type { IAudienceTarget } from "../../../common/models";

/** Icon configuration for a tab/panel header */
export interface IHyperTabIcon {
  /** Icon source type */
  type: "fluent" | "emoji";
  /** Icon name (Fluent) or emoji character */
  value: string;
  /** Optional icon color override */
  color?: string;
}

/** Custom styling overrides for a panel's tab/header */
export interface IHyperTabPanelStyles {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  activeBackgroundColor?: string;
  activeTextColor?: string;
  activeBorderColor?: string;
}

/** Nested tabs configuration (max 2 levels deep) */
export interface IHyperTabNestedConfig {
  displayMode: "tabs" | "accordion";
  tabStyle?: "horizontal" | "vertical" | "pill" | "underline";
  panels: IHyperTabPanel[];
}

/** Embed/iframe configuration */
export interface IHyperTabEmbedConfig {
  /** URL to embed */
  url: string;
  /** Iframe height in px (0 = auto) */
  height: number;
  /** Whether to sandbox the iframe */
  sandbox: boolean;
}

/** SharePoint list view configuration */
export interface IHyperTabListViewConfig {
  /** Site URL (empty = current site) */
  siteUrl: string;
  /** List ID */
  listId: string;
  /** View ID (empty = default view) */
  viewId: string;
  /** Max items to show */
  maxItems: number;
}

/** Media (video/audio) configuration */
export interface IHyperTabMediaConfig {
  /** Media URL (MP4, YouTube, Stream, Vimeo, or audio) */
  url: string;
  /** Media type */
  mediaType: "video" | "audio";
  /** Whether to auto-play (muted for video) */
  autoplay: boolean;
  /** Whether to show controls */
  showControls: boolean;
  /** Poster image URL (for video) */
  posterUrl: string;
}

/** Badge configuration for a tab header */
export interface IHyperTabBadge {
  /** Badge display type */
  type: "count" | "dot" | "text";
  /** Badge value (number for count, text for text, ignored for dot) */
  value: string;
  /** Badge color (CSS color) */
  color: string;
}

/** Content type for a panel */
export type HyperTabContentType =
  | "simple"
  | "image"
  | "nested-tabs"
  | "embed"
  | "list-view"
  | "media"
  | "markdown";

/** A single tab/accordion/wizard panel */
export interface IHyperTabPanel {
  /** Unique panel identifier */
  id: string;
  /** Display title */
  title: string;
  /** Optional icon */
  icon?: IHyperTabIcon;
  /** Optional badge/notification indicator */
  badge?: IHyperTabBadge;
  /** Content type */
  contentType: HyperTabContentType;
  /** Rich HTML content (for simple and image types) */
  content: string;
  /** Header image URL (for image content type) */
  headerImageUrl?: string;
  /** Header image alt text */
  headerImageAlt?: string;
  /** Nested tabs configuration (for nested-tabs content type) */
  nestedConfig?: IHyperTabNestedConfig;
  /** Embed/iframe configuration (for embed content type) */
  embedConfig?: IHyperTabEmbedConfig;
  /** SP list view configuration (for list-view content type) */
  listViewConfig?: IHyperTabListViewConfig;
  /** Media configuration (for media content type) */
  mediaConfig?: IHyperTabMediaConfig;
  /** Markdown content (for markdown content type) */
  markdownContent?: string;
  /** Audience targeting per panel */
  audienceTarget: IAudienceTarget;
  /** Custom styling overrides */
  customStyles?: IHyperTabPanelStyles;
  /** Sort order index */
  sortOrder: number;
  /** Whether the panel is enabled */
  enabled: boolean;
}

/** Default panel for new web part instances */
export const DEFAULT_PANEL: IHyperTabPanel = {
  id: "panel-1",
  title: "Tab 1",
  contentType: "simple",
  content: "<p>Enter your content here.</p>",
  audienceTarget: { enabled: false, groups: [], matchAll: false },
  sortOrder: 0,
  enabled: true,
};

/** Second default panel so web part starts with 2 tabs */
export const DEFAULT_PANEL_2: IHyperTabPanel = {
  id: "panel-2",
  title: "Tab 2",
  contentType: "simple",
  content: "<p>Second tab content.</p>",
  audienceTarget: { enabled: false, groups: [], matchAll: false },
  sortOrder: 1,
  enabled: true,
};
