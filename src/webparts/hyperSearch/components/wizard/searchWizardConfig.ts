import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { ISearchWizardState } from "../../models/IHyperSearchWizardState";
import { DEFAULT_SEARCH_WIZARD_STATE } from "../../models/IHyperSearchWizardState";
import type { IHyperSearchWebPartProps } from "../../models/IHyperSearchWebPartProps";
import type { ISearchV2Features, ISearchV2Filters } from "../../models/IHyperSearchV2";
import { DEFAULT_V2_FEATURES, DEFAULT_V2_FILTERS } from "../../models/IHyperSearchV2";
import { parsePromotedResults, stringifyPromotedResults } from "../../models/IPromotedResult";
import { getSearchTemplateById } from "../../constants/searchTemplates";
import TemplatesStep from "./TemplatesStep";
import ScopesStep from "./ScopesStep";
import ResultStylesStep from "./ResultStylesStep";
import FeaturesStep from "./FeaturesStep";
import FiltersStep from "./FiltersStep";
import PromotedResultsStep from "./PromotedResultsStep";
import AppearanceStep from "./AppearanceStep";

// ============================================================
// HyperSearch V2 Wizard Config — Wires steps + state + result
// ============================================================

/** Scope label lookup */
var SCOPE_LABELS: Record<string, string> = {
  everything: "Everything",
  sharepoint: "SharePoint",
  onedrive: "OneDrive",
  teams: "Teams",
  exchange: "Exchange",
  currentSite: "Current Site",
};

/** Layout label lookup */
var LAYOUT_LABELS: Record<string, string> = {
  listRich: "Rich List",
  listCompact: "Compact List",
  cardGrid: "Card Grid",
  magazine: "Magazine",
  table: "Table",
  peopleGrid: "People Grid",
  mediaGallery: "Media Gallery",
  conversation: "Conversation",
  timeline: "Timeline",
  previewPanel: "Preview Panel",
};

/** Bar style label lookup */
var BAR_STYLE_LABELS: Record<string, string> = {
  rounded: "Rounded",
  square: "Square",
  pill: "Pill",
  underline: "Underline",
};

/** Step definitions */
var steps: Array<IWizardStepDef<ISearchWizardState>> = [
  {
    id: "templates",
    label: "Choose a Template",
    shortLabel: "Template",
    helpText: "Pick a pre-built search template to get started quickly, or choose to build from scratch.",
    component: TemplatesStep,
  },
  {
    id: "scopes",
    label: "Search Scopes",
    shortLabel: "Scopes",
    helpText: "Choose which content sources users can search across. Enable scope tabs to let users switch between them.",
    component: ScopesStep,
  },
  {
    id: "resultStyles",
    label: "Result Layout",
    shortLabel: "Layout",
    helpText: "Choose how search results are displayed. Each layout is optimized for different content types.",
    component: ResultStylesStep,
  },
  {
    id: "features",
    label: "Features",
    shortLabel: "Features",
    helpText: function (state: ISearchWizardState): string {
      var count = 0;
      var keys = Object.keys(state.features);
      keys.forEach(function (k) {
        if ((state.features as unknown as Record<string, boolean>)[k]) count++;
      });
      return "Enable or disable search features. " + String(count) + " of " + String(keys.length) + " features enabled.";
    },
    component: FeaturesStep,
  },
  {
    id: "filters",
    label: "Filters",
    shortLabel: "Filters",
    helpText: function (state: ISearchWizardState): string {
      var count = 0;
      var keys = Object.keys(state.filters);
      keys.forEach(function (k) {
        if ((state.filters as unknown as Record<string, boolean>)[k]) count++;
      });
      return "Configure the filter panel. " + String(count) + " of " + String(keys.length) + " filter types enabled.";
    },
    component: FiltersStep,
  },
  {
    id: "promotedResults",
    label: "Promoted Results",
    shortLabel: "Promoted",
    helpText: "Configure best-bet results that appear when users search for specific keywords.",
    component: PromotedResultsStep,
  },
  {
    id: "appearance",
    label: "Appearance",
    shortLabel: "Look",
    helpText: "Customize the visual appearance of your search experience.",
    component: AppearanceStep,
  },
];

/** Build the result object that gets applied to web part properties */
function buildResult(state: ISearchWizardState): Partial<IHyperSearchWebPartProps> {
  var scopeArray: string[] = [];
  state.activeScopes.forEach(function (s) { scopeArray.push(s); });

  return {
    selectedTemplate: state.selectedTemplate,
    resultLayout: state.resultLayout,
    searchBarStyle: state.searchBarStyle,
    accentColor: state.accentColor,
    borderRadius: state.borderRadius,
    activeScopes: JSON.stringify(scopeArray),
    showScopeTabs: state.showScopeTabs,
    enableDemoMode: state.enableDemoMode,
    resultsPerPage: state.resultsPerPage,
    promotedResults: stringifyPromotedResults(state.promotedResults),
    v2Features: JSON.stringify(state.features),
    v2Filters: JSON.stringify(state.filters),
    wizardCompleted: true,
    showWizardOnInit: false,

    // Individual feature toggles for property pane
    enableInstantSearch: state.features.instantSearch,
    enableSearchVerticals: state.features.searchVerticals,
    enableZeroQuery: state.features.zeroQuery,
    enableQuickActions: state.features.quickActions,
    enableHitHighlight: state.features.hitHighlight,
    enableResultGrouping: state.features.resultGrouping,
    enableThumbnailPreviews: state.features.thumbnailPreviews,
    enableSavedSearches: state.features.savedSearches,
    enablePeopleCards: state.features.peopleCards,
    enableSpellingCorrection: state.features.spellingCorrection,

    // Also update V1 properties for backwards compat
    enableTypeAhead: state.features.smartAutocomplete,
    enableRefiners: state.filters.facetedFilters,
    enableResultPreviews: state.features.inlinePreview,
    enableSearchHistory: state.features.savedSearches,
    enableAnalytics: true,
    showResultIcon: true,
    showResultPath: true,
  };
}

/** Build summary rows for the review step */
function buildSummary(state: ISearchWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];

  // Template
  var template = getSearchTemplateById(state.selectedTemplate);
  rows.push({
    label: "Template",
    value: template ? template.name : state.selectedTemplate,
    type: "badge",
  });

  // Scopes
  var scopeLabels: string[] = [];
  state.activeScopes.forEach(function (s) {
    scopeLabels.push(SCOPE_LABELS[s] || s);
  });
  rows.push({
    label: "Search Scopes",
    value: scopeLabels.join(", ") || "None",
    type: "badge",
  });

  // Scope tabs
  rows.push({
    label: "Scope Tabs",
    value: state.showScopeTabs ? "Visible" : "Hidden",
    type: state.showScopeTabs ? "badgeGreen" : "text",
  });

  // Result layout
  rows.push({
    label: "Result Layout",
    value: LAYOUT_LABELS[state.resultLayout] || state.resultLayout,
    type: "badge",
  });

  // Features count
  var enabledFeatures: string[] = [];
  if (state.features.instantSearch) enabledFeatures.push("Instant Search");
  if (state.features.smartAutocomplete) enabledFeatures.push("Smart Autocomplete");
  if (state.features.searchVerticals) enabledFeatures.push("Search Verticals");
  if (state.features.zeroQuery) enabledFeatures.push("Zero Query");
  if (state.features.spellingCorrection) enabledFeatures.push("Spell Check");
  if (state.features.nlpParsing) enabledFeatures.push("NLP");
  if (state.features.savedSearches) enabledFeatures.push("Saved Searches");
  if (state.features.commandPalette) enabledFeatures.push("Cmd+K");
  if (state.features.inlinePreview) enabledFeatures.push("Preview");
  if (state.features.peopleCards) enabledFeatures.push("People Cards");
  if (state.features.quickActions) enabledFeatures.push("Quick Actions");
  if (state.features.hitHighlight) enabledFeatures.push("Hit Highlight");
  if (state.features.resultGrouping) enabledFeatures.push("Grouping");
  if (state.features.thumbnailPreviews) enabledFeatures.push("Thumbnails");
  rows.push({
    label: "Features",
    value: String(enabledFeatures.length) + " enabled",
    type: "badge",
  });

  // Filters count
  var enabledFilters: string[] = [];
  if (state.filters.facetedFilters) enabledFilters.push("Facets");
  if (state.filters.dateRange) enabledFilters.push("Date");
  if (state.filters.fileType) enabledFilters.push("File Type");
  if (state.filters.authorFilter) enabledFilters.push("Author");
  if (state.filters.siteFilter) enabledFilters.push("Site");
  if (state.filters.sizeFilter) enabledFilters.push("Size");
  if (state.filters.contentType) enabledFilters.push("Content Type");
  if (state.filters.managedMetadata) enabledFilters.push("Metadata");
  rows.push({
    label: "Filters",
    value: enabledFilters.length > 0 ? enabledFilters.join(", ") : "None",
    type: "badge",
  });

  // Promoted results
  rows.push({
    label: "Promoted Results",
    value: String(state.promotedResults.length) + " configured",
    type: state.promotedResults.length > 0 ? "badgeGreen" : "text",
  });

  // Appearance
  rows.push({
    label: "Search Bar",
    value: BAR_STYLE_LABELS[state.searchBarStyle] || state.searchBarStyle,
    type: "badge",
  });

  rows.push({
    label: "Accent Color",
    value: state.accentColor,
    type: "mono",
  });

  // Results per page
  rows.push({
    label: "Results Per Page",
    value: String(state.resultsPerPage),
    type: "text",
  });

  // Demo mode
  rows.push({
    label: "Demo Mode",
    value: state.enableDemoMode ? "Enabled" : "Disabled",
    type: state.enableDemoMode ? "badgeGreen" : "text",
  });

  return rows;
}

/**
 * Hydrate wizard state from existing web part properties (for re-editing).
 * Returns undefined if wizard hasn't been completed (first-time setup).
 */
export function buildStateFromProps(props: IHyperSearchWebPartProps): ISearchWizardState | undefined {
  if (!props.wizardCompleted) {
    return undefined;
  }

  // Parse JSON properties
  var features: ISearchV2Features;
  try {
    features = props.v2Features ? JSON.parse(props.v2Features) as ISearchV2Features : DEFAULT_V2_FEATURES;
  } catch {
    features = DEFAULT_V2_FEATURES;
  }

  var filters: ISearchV2Filters;
  try {
    filters = props.v2Filters ? JSON.parse(props.v2Filters) as ISearchV2Filters : DEFAULT_V2_FILTERS;
  } catch {
    filters = DEFAULT_V2_FILTERS;
  }

  var scopes: string[];
  try {
    scopes = props.activeScopes ? JSON.parse(props.activeScopes) as string[] : ["sharepoint", "onedrive", "people"];
  } catch {
    scopes = ["sharepoint", "onedrive", "people"];
  }

  return {
    path: "template",
    selectedTemplate: props.selectedTemplate || "modern-clean",
    activeScopes: scopes as import("../../models/ISearchQuery").SearchScopeType[],
    showScopeTabs: props.showScopeTabs !== false,
    defaultToEverything: true,
    rememberLastScope: true,
    showScopeCounts: true,
    resultLayout: props.resultLayout || "listRich",
    features: features,
    filters: filters,
    promotedResults: parsePromotedResults(props.promotedResults),
    accentColor: props.accentColor || "#0078d4",
    borderRadius: props.borderRadius !== undefined ? props.borderRadius : 8,
    searchBarStyle: props.searchBarStyle || "rounded",
    enableDemoMode: props.enableDemoMode !== false,
    resultsPerPage: props.resultsPerPage || 10,
  };
}

/** The full wizard configuration */
export var SEARCH_WIZARD_CONFIG: IHyperWizardConfig<ISearchWizardState, Partial<IHyperSearchWebPartProps>> = {
  title: "HyperSearch Setup Wizard",
  welcome: {
    productName: "Search",
    tagline: "The most powerful search experience ever built for SharePoint Online",
    features: [
      {
        icon: "\uD83D\uDD0D",
        title: "10 Result Layouts",
        description: "Rich List, Card Grid, Magazine, Table, People Grid, Media Gallery, Timeline, and more",
      },
      {
        icon: "\u26A1",
        title: "14 Power Features",
        description: "Instant search, autocomplete, zero-query, Cmd+K palette, spelling correction, and saved searches",
      },
      {
        icon: "\uD83C\uDFA8",
        title: "12 Templates",
        description: "Modern Clean, Google-Style, Command Palette, Magazine, Dark Mode, AI Assistant, and more",
      },
      {
        icon: "\uD83D\uDCCA",
        title: "Smart Filters",
        description: "Faceted filters, date range, file type, author, site, content type, and managed metadata",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_SEARCH_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can reconfigure at any time via the toolbar Configure button or the property pane.",
};
