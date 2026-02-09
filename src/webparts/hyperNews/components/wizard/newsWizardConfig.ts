import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { INewsWizardState } from "../../models/IHyperNewsWizardState";
import { DEFAULT_WIZARD_STATE } from "../../models/IHyperNewsWizardState";
import type { IHyperNewsWebPartProps } from "../../models/IHyperNewsWebPartProps";
import {
  SOURCE_TYPE_LABELS,
  stringifySources,
  parseSources,
} from "../../models/IHyperNewsSource";
import type {
  INewsSource,
  IExternalLinkSource,
  IManualSource,
} from "../../models/IHyperNewsSource";
import { parseArticles, stringifyArticles } from "../../models/IExternalArticle";
import type { IExternalArticle } from "../../models/IExternalArticle";
import { LAYOUT_OPTIONS } from "../../models/IHyperNewsLayout";
import TemplatesStep from "./TemplatesStep";
import SourcesStep from "./SourcesStep";
import LayoutStep from "./LayoutStep";
import DisplayStep from "./DisplayStep";
import FeaturesStep from "./FeaturesStep";
import FiltersStep from "./FiltersStep";

// ============================================================
// HyperNews Wizard Config — Wires steps + state + result
// ============================================================

/** Step definitions */
var steps: Array<IWizardStepDef<INewsWizardState>> = [
  {
    id: "templates",
    label: "Choose a Template",
    shortLabel: "Template",
    helpText: "Pick a pre-built template to get started quickly, or choose Custom to configure everything yourself.",
    component: TemplatesStep,
  },
  {
    id: "sources",
    label: "Content Sources",
    shortLabel: "Sources",
    helpText: "Configure where your news content comes from. Add multiple sources for a rich, aggregated feed.",
    component: SourcesStep,
    validate: function (state: INewsWizardState): boolean {
      return state.sources.length > 0;
    },
  },
  {
    id: "layout",
    label: "Layout",
    shortLabel: "Layout",
    helpText: "Choose how articles are displayed to your users.",
    component: LayoutStep,
  },
  {
    id: "display",
    label: "Display Options",
    shortLabel: "Display",
    helpText: "Configure page size, featured articles, and which metadata to show on cards.",
    component: DisplayStep,
  },
  {
    id: "features",
    label: "Features",
    shortLabel: "Features",
    helpText: "Enable or disable interactive features for your news experience.",
    component: FeaturesStep,
  },
  {
    id: "filters",
    label: "Filters",
    shortLabel: "Filters",
    helpText: function (state: INewsWizardState): string {
      return state.filterPresets.enableFilters
        ? "Configure the filter bar that appears above your articles."
        : "Enable filters to let users search by category, author, and date.";
    },
    component: FiltersStep,
  },
];

/** Build the result object that gets applied to web part properties */
function buildResult(state: INewsWizardState): Partial<IHyperNewsWebPartProps> {
  // Separate external and manual articles from source objects
  var externalArticles: IExternalArticle[] = [];
  var manualArticles: IExternalArticle[] = [];

  state.sources.forEach(function (source: INewsSource) {
    if (source.type === "externalLink") {
      var extSource = source as IExternalLinkSource;
      var extArts = parseArticles(extSource.articlesJson);
      extArts.forEach(function (a) { externalArticles.push(a); });
    } else if (source.type === "manual") {
      var manSource = source as IManualSource;
      var manArts = parseArticles(manSource.articlesJson);
      manArts.forEach(function (a) { manualArticles.push(a); });
    }
  });

  return {
    sourcesJson: stringifySources(state.sources),
    externalArticlesJson: stringifyArticles(externalArticles),
    manualArticlesJson: stringifyArticles(manualArticles),
    layoutType: state.layoutType,
    pageSize: state.displayOptions.pageSize,
    showFeatured: state.displayOptions.showFeatured,
    maxFeatured: state.displayOptions.maxFeatured,
    showImages: state.displayOptions.showImages,
    showDescription: state.displayOptions.showDescription,
    showAuthor: state.displayOptions.showAuthor,
    showDate: state.displayOptions.showDate,
    showReadTime: state.displayOptions.showReadTime,
    enableInfiniteScroll: state.features.enableInfiniteScroll,
    enableQuickRead: state.features.enableQuickRead,
    enableReactions: state.features.enableReactions,
    showWizardOnInit: false,
  };
}

/** Build summary rows for the review step */
function buildSummary(state: INewsWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];

  // Source count by type
  var sourceCounts: Record<string, number> = {};
  state.sources.forEach(function (s: INewsSource) {
    var label = SOURCE_TYPE_LABELS[s.type];
    sourceCounts[label] = (sourceCounts[label] || 0) + 1;
  });

  var sourceText = "";
  var sKeys = Object.keys(sourceCounts);
  sKeys.forEach(function (label, idx) {
    if (idx > 0) sourceText += ", ";
    sourceText += String(sourceCounts[label]) + " " + label;
  });
  rows.push({ label: "Content Sources", value: sourceText || "None", type: "badge" });

  // Layout
  var layoutLabel: string = state.layoutType;
  LAYOUT_OPTIONS.forEach(function (opt) {
    if (opt.key === state.layoutType) layoutLabel = opt.text;
  });
  rows.push({ label: "Layout", value: layoutLabel, type: "badge" });

  // Page size
  rows.push({ label: "Page Size", value: String(state.displayOptions.pageSize), type: "text" });

  // Featured
  rows.push({
    label: "Featured Articles",
    value: state.displayOptions.showFeatured
      ? "Yes (max " + String(state.displayOptions.maxFeatured) + ")"
      : "No",
    type: state.displayOptions.showFeatured ? "badgeGreen" : "text",
  });

  // Features enabled
  var enabledFeatures: string[] = [];
  if (state.features.enableInfiniteScroll) enabledFeatures.push("Infinite Scroll");
  if (state.features.enableQuickRead) enabledFeatures.push("Quick Read");
  if (state.features.enableReactions) enabledFeatures.push("Reactions");
  if (state.features.enableBookmarks) enabledFeatures.push("Bookmarks");
  if (state.features.enableReadTracking) enabledFeatures.push("Read Tracking");
  if (state.features.enableScheduling) enabledFeatures.push("Scheduling");
  rows.push({
    label: "Features",
    value: enabledFeatures.length > 0 ? enabledFeatures.join(", ") : "None",
    type: "badge",
  });

  // Filters
  rows.push({
    label: "Filter Bar",
    value: state.filterPresets.enableFilters ? "Enabled" : "Disabled",
    type: state.filterPresets.enableFilters ? "badgeGreen" : "text",
  });

  if (state.filterPresets.enableFilters && state.filterPresets.defaultDateRange !== "all") {
    rows.push({
      label: "Default Date Range",
      value: state.filterPresets.defaultDateRange,
      type: "mono",
    });
  }

  return rows;
}

/**
 * Hydrate wizard state from existing web part properties (for re-editing).
 * Returns undefined if no sources are configured (first-time setup).
 */
export function buildStateFromProps(props: IHyperNewsWebPartProps): INewsWizardState | undefined {
  var sources = parseSources(props.sourcesJson || "[]");
  if (sources.length === 0) {
    return undefined;
  }

  return {
    sources: sources,
    layoutType: props.layoutType || "cardGrid",
    displayOptions: {
      pageSize: props.pageSize || 12,
      showFeatured: props.showFeatured !== false,
      maxFeatured: props.maxFeatured || 3,
      showImages: props.showImages !== false,
      showDescription: props.showDescription !== false,
      showAuthor: props.showAuthor !== false,
      showDate: props.showDate !== false,
      showReadTime: props.showReadTime !== false,
    },
    features: {
      enableInfiniteScroll: props.enableInfiniteScroll !== false,
      enableQuickRead: props.enableQuickRead !== false,
      enableReactions: props.enableReactions !== false,
      enableBookmarks: props.enableBookmarks !== false,
      enableReadTracking: props.enableReadTracking !== false,
      enableScheduling: props.enableScheduling !== false,
    },
    filterPresets: {
      enableFilters: props.filterConfig ? props.filterConfig.enabled !== false : true,
      defaultDateRange: props.filterConfig ? props.filterConfig.dateRange || "all" : "all",
      categoryPresets: props.filterConfig ? props.filterConfig.categories.join(", ") : "",
      authorPresets: props.filterConfig ? props.filterConfig.authors.join(", ") : "",
    },
  };
}

/** The full wizard configuration */
export var NEWS_WIZARD_CONFIG: IHyperWizardConfig<INewsWizardState, Partial<IHyperNewsWebPartProps>> = {
  title: "HyperNews Setup Wizard",
  welcome: {
    productName: "News",
    tagline: "A powerful, multi-source news aggregator that far exceeds SharePoint's built-in News web part",
    features: [
      {
        icon: "\uD83D\uDCF0",
        title: "6 Content Sources",
        description: "Aggregate from SP News, custom lists, external URLs, RSS feeds, manual content, and Microsoft Graph recommendations",
      },
      {
        icon: "\uD83C\uDFA8",
        title: "12 Layouts",
        description: "Card Grid, Magazine, Newspaper, Timeline, Carousel, Hero Grid, Mosaic, and more",
      },
      {
        icon: "\u2728",
        title: "Rich Interactions",
        description: "Emoji reactions, bookmarks, read tracking, quick-read modal, and infinite scroll",
      },
      {
        icon: "\uD83D\uDD0D",
        title: "Smart Filtering",
        description: "Filter by category, author, date range with preset and custom options",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can reconfigure at any time via the toolbar Configure button or the property pane.",
};
