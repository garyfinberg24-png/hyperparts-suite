// ============================================================
// HyperNews — Template Definitions for Quick-Start Configuration
// ============================================================

import type { INewsWizardState } from "./IHyperNewsWizardState";
import { DEFAULT_WIZARD_STATE } from "./IHyperNewsWizardState";
import { generateSourceId } from "./IHyperNewsSource";
import type { LayoutType } from "./IHyperNewsLayout";

/** A pre-built template that pre-fills the entire wizard state */
export interface INewsTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Layout name shown in badge */
  previewLayout: LayoutType;
  /** Factory that returns a complete wizard state */
  createState: () => INewsWizardState;
}

// ── Template Definitions ──

var corporateNewsHub: INewsTemplate = {
  id: "corporate-news-hub",
  name: "Corporate News Hub",
  description: "Multi-source feed combining SP News Posts with AI-recommended trending content from Microsoft Graph",
  icon: "\uD83D\uDCF0",
  previewLayout: "magazine",
  createState: function (): INewsWizardState {
    return {
      sources: [
        {
          id: generateSourceId(),
          type: "spNews",
          mode: "currentSite",
          siteUrls: [],
          hubSiteId: "",
          libraryName: "Site Pages",
          enabled: true,
        },
        {
          id: generateSourceId(),
          type: "graphRecommended",
          insightType: "trending",
          maxItems: 10,
          enabled: true,
        },
      ],
      layoutType: "magazine",
      displayOptions: {
        pageSize: 20,
        showFeatured: true,
        maxFeatured: 3,
        showImages: true,
        showDescription: true,
        showAuthor: true,
        showDate: true,
        showReadTime: true,
      },
      features: {
        enableInfiniteScroll: true,
        enableQuickRead: true,
        enableReactions: true,
        enableBookmarks: true,
        enableReadTracking: true,
        enableScheduling: false,
      },
      filterPresets: {
        enableFilters: true,
        defaultDateRange: "all",
        categoryPresets: "",
        authorPresets: "",
      },
    };
  },
};

var multiSiteAggregator: INewsTemplate = {
  id: "multi-site-aggregator",
  name: "Multi-Site Aggregator",
  description: "Roll up news from multiple SharePoint sites into a single filterable feed with category grouping",
  icon: "\uD83C\uDF10",
  previewLayout: "cardGrid",
  createState: function (): INewsWizardState {
    return {
      sources: [
        {
          id: generateSourceId(),
          type: "spNews",
          mode: "selectedSites",
          siteUrls: [],
          hubSiteId: "",
          libraryName: "Site Pages",
          enabled: true,
        },
      ],
      layoutType: "cardGrid",
      displayOptions: {
        pageSize: 24,
        showFeatured: true,
        maxFeatured: 4,
        showImages: true,
        showDescription: true,
        showAuthor: true,
        showDate: true,
        showReadTime: false,
      },
      features: {
        enableInfiniteScroll: true,
        enableQuickRead: false,
        enableReactions: false,
        enableBookmarks: true,
        enableReadTracking: false,
        enableScheduling: false,
      },
      filterPresets: {
        enableFilters: true,
        defaultDateRange: "all",
        categoryPresets: "",
        authorPresets: "",
      },
    };
  },
};

var blogAndArticles: INewsTemplate = {
  id: "blog-articles",
  name: "Blog & Articles",
  description: "Combine internal SP News with external blog RSS feeds, optimized for long-form reading with read tracking",
  icon: "\u270D\uFE0F",
  previewLayout: "list",
  createState: function (): INewsWizardState {
    return {
      sources: [
        {
          id: generateSourceId(),
          type: "spNews",
          mode: "currentSite",
          siteUrls: [],
          hubSiteId: "",
          libraryName: "Site Pages",
          enabled: true,
        },
        {
          id: generateSourceId(),
          type: "rssFeed",
          feedUrl: "",
          maxItems: 20,
          pollingIntervalMinutes: 60,
          enabled: true,
        },
      ],
      layoutType: "list",
      displayOptions: {
        pageSize: 15,
        showFeatured: false,
        maxFeatured: 0,
        showImages: true,
        showDescription: true,
        showAuthor: true,
        showDate: true,
        showReadTime: true,
      },
      features: {
        enableInfiniteScroll: true,
        enableQuickRead: true,
        enableReactions: true,
        enableBookmarks: true,
        enableReadTracking: true,
        enableScheduling: false,
      },
      filterPresets: {
        enableFilters: true,
        defaultDateRange: "all",
        categoryPresets: "",
        authorPresets: "",
      },
    };
  },
};

var newsletter: INewsTemplate = {
  id: "newsletter",
  name: "Newsletter",
  description: "Curated manual content in a newspaper-style layout, perfect for internal newsletters and announcements",
  icon: "\uD83D\uDCE7",
  previewLayout: "newspaper",
  createState: function (): INewsWizardState {
    return {
      sources: [
        {
          id: generateSourceId(),
          type: "manual",
          articlesJson: "[]",
          enabled: true,
        },
      ],
      layoutType: "newspaper",
      displayOptions: {
        pageSize: 10,
        showFeatured: true,
        maxFeatured: 1,
        showImages: true,
        showDescription: true,
        showAuthor: true,
        showDate: true,
        showReadTime: false,
      },
      features: {
        enableInfiniteScroll: false,
        enableQuickRead: false,
        enableReactions: false,
        enableBookmarks: false,
        enableReadTracking: false,
        enableScheduling: true,
      },
      filterPresets: {
        enableFilters: false,
        defaultDateRange: "all",
        categoryPresets: "",
        authorPresets: "",
      },
    };
  },
};

var externalNewsFeed: INewsTemplate = {
  id: "external-news-feed",
  name: "External News Feed",
  description: "Aggregate external articles and RSS feeds into a visual filmstrip, great for industry news and press coverage",
  icon: "\uD83D\uDD17",
  previewLayout: "filmstrip",
  createState: function (): INewsWizardState {
    return {
      sources: [
        {
          id: generateSourceId(),
          type: "externalLink",
          articlesJson: "[]",
          enabled: true,
        },
        {
          id: generateSourceId(),
          type: "rssFeed",
          feedUrl: "",
          maxItems: 15,
          pollingIntervalMinutes: 30,
          enabled: true,
        },
      ],
      layoutType: "filmstrip",
      displayOptions: {
        pageSize: 12,
        showFeatured: false,
        maxFeatured: 0,
        showImages: true,
        showDescription: true,
        showAuthor: false,
        showDate: true,
        showReadTime: false,
      },
      features: {
        enableInfiniteScroll: false,
        enableQuickRead: true,
        enableReactions: false,
        enableBookmarks: true,
        enableReadTracking: false,
        enableScheduling: false,
      },
      filterPresets: {
        enableFilters: false,
        defaultDateRange: "all",
        categoryPresets: "",
        authorPresets: "",
      },
    };
  },
};

var customBlank: INewsTemplate = {
  id: "custom",
  name: "Custom",
  description: "Start with a blank slate and configure everything from scratch",
  icon: "\u2699\uFE0F",
  previewLayout: "cardGrid",
  createState: function (): INewsWizardState {
    return {
      sources: DEFAULT_WIZARD_STATE.sources.slice(),
      layoutType: DEFAULT_WIZARD_STATE.layoutType,
      displayOptions: {
        pageSize: DEFAULT_WIZARD_STATE.displayOptions.pageSize,
        showFeatured: DEFAULT_WIZARD_STATE.displayOptions.showFeatured,
        maxFeatured: DEFAULT_WIZARD_STATE.displayOptions.maxFeatured,
        showImages: DEFAULT_WIZARD_STATE.displayOptions.showImages,
        showDescription: DEFAULT_WIZARD_STATE.displayOptions.showDescription,
        showAuthor: DEFAULT_WIZARD_STATE.displayOptions.showAuthor,
        showDate: DEFAULT_WIZARD_STATE.displayOptions.showDate,
        showReadTime: DEFAULT_WIZARD_STATE.displayOptions.showReadTime,
      },
      features: {
        enableInfiniteScroll: DEFAULT_WIZARD_STATE.features.enableInfiniteScroll,
        enableQuickRead: DEFAULT_WIZARD_STATE.features.enableQuickRead,
        enableReactions: DEFAULT_WIZARD_STATE.features.enableReactions,
        enableBookmarks: DEFAULT_WIZARD_STATE.features.enableBookmarks,
        enableReadTracking: DEFAULT_WIZARD_STATE.features.enableReadTracking,
        enableScheduling: DEFAULT_WIZARD_STATE.features.enableScheduling,
      },
      filterPresets: {
        enableFilters: DEFAULT_WIZARD_STATE.filterPresets.enableFilters,
        defaultDateRange: DEFAULT_WIZARD_STATE.filterPresets.defaultDateRange,
        categoryPresets: DEFAULT_WIZARD_STATE.filterPresets.categoryPresets,
        authorPresets: DEFAULT_WIZARD_STATE.filterPresets.authorPresets,
      },
    };
  },
};

/** All available templates */
export var NEWS_TEMPLATES: INewsTemplate[] = [
  corporateNewsHub,
  multiSiteAggregator,
  blogAndArticles,
  newsletter,
  externalNewsFeed,
  customBlank,
];
