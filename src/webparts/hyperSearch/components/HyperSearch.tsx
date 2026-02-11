import * as React from "react";
import { HyperErrorBoundary } from "../../../common/components";
import type {
  IHyperSearchWebPartProps,
  ISearchV2Features,
  ISearchV2Filters,
  SearchScopeType,
  ResultLayoutMode,
} from "../models";
import { DEFAULT_V2_FEATURES, DEFAULT_V2_FILTERS, parsePromotedResults } from "../models";
import { useHyperSearchStore } from "../store/useHyperSearchStore";
import { useSearchQuery } from "../hooks/useSearchQuery";
import { useSearchSuggestions } from "../hooks/useSearchSuggestions";
import { useSearchHistory } from "../hooks/useSearchHistory";
import { matchPromotedResults } from "../utils/promotedResultsMatcher";
import { trackSearch, trackZeroResults } from "../utils/analyticsTracker";
import { DEMO_RESULTS, DEMO_REFINERS } from "../constants/demoData";

// V1 components (still used in V2)
import HyperSearchBar from "./HyperSearchBar";
import HyperSearchSortBar from "./HyperSearchSortBar";
import HyperSearchPagination from "./HyperSearchPagination";
import HyperSearchPreviewPanel from "./HyperSearchPreviewPanel";

// V2 components
import HyperSearchScopeTabs from "./HyperSearchScopeTabs";
import HyperSearchZeroQuery from "./HyperSearchZeroQuery";
import HyperSearchV2Results from "./HyperSearchV2Results";
import HyperSearchV2FilterPanel from "./HyperSearchV2FilterPanel";

// Demo bar
import HyperSearchDemoBar from "./HyperSearchDemoBar";

import styles from "./HyperSearch.module.scss";

// ── Lazy-load wizard ──
var HyperWizardPromise: Promise<{ default: React.ComponentType<unknown> }> | undefined;
function getHyperWizard(): Promise<{ default: React.ComponentType<unknown> }> {
  if (!HyperWizardPromise) {
    HyperWizardPromise = import(
      /* webpackChunkName: "hyper-wizard" */
      "../../../common/components/wizard/HyperWizard"
    ) as Promise<{ default: React.ComponentType<unknown> }>;
  }
  return HyperWizardPromise;
}
var LazyHyperWizard = React.lazy(getHyperWizard);

export interface IHyperSearchComponentProps extends IHyperSearchWebPartProps {
  instanceId: string;
  isEditMode: boolean;
  onWizardComplete?: (result: Record<string, unknown>) => void;
}

/** Parse JSON-stored V2 features */
function parseFeatures(json: string): ISearchV2Features {
  if (!json) return DEFAULT_V2_FEATURES;
  try {
    return JSON.parse(json) as ISearchV2Features;
  } catch {
    return DEFAULT_V2_FEATURES;
  }
}

/** Parse JSON-stored V2 filters */
function parseFilters(json: string): ISearchV2Filters {
  if (!json) return DEFAULT_V2_FILTERS;
  try {
    return JSON.parse(json) as ISearchV2Filters;
  } catch {
    return DEFAULT_V2_FILTERS;
  }
}

/** Parse JSON-stored scope array */
function parseScopes(json: string): SearchScopeType[] {
  if (!json) return ["sharepoint", "onedrive"];
  try {
    var parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed as SearchScopeType[] : ["sharepoint", "onedrive"];
  } catch {
    return ["sharepoint", "onedrive"];
  }
}

var HyperSearchInner: React.FC<IHyperSearchComponentProps> = function (props) {
  var store = useHyperSearchStore();

  // ── Demo mode local state ──
  var demoScopeState = React.useState<SearchScopeType>(props.defaultScope || "everything");
  var demoScope = demoScopeState[0];
  var setDemoScope = demoScopeState[1];

  var demoLayoutState = React.useState<ResultLayoutMode>((props.resultLayout || "listRich") as ResultLayoutMode);
  var demoLayout = demoLayoutState[0];
  var setDemoLayout = demoLayoutState[1];

  var demoShowRefinersState = React.useState<boolean>(props.enableRefiners !== false);
  var demoShowRefiners = demoShowRefinersState[0];
  var setDemoShowRefiners = demoShowRefinersState[1];

  var demoShowPromotedState = React.useState<boolean>(true);
  var demoShowPromoted = demoShowPromotedState[0];
  var setDemoShowPromoted = demoShowPromotedState[1];

  var demoShowPreviewState = React.useState<boolean>(props.enableResultPreviews !== false);
  var demoShowPreview = demoShowPreviewState[0];
  var setDemoShowPreview = demoShowPreviewState[1];

  // Parse V2 config from props
  var features = React.useMemo(function () { return parseFeatures(props.v2Features); }, [props.v2Features]);
  var filters = React.useMemo(function () { return parseFilters(props.v2Filters); }, [props.v2Filters]);
  var activeScopes = React.useMemo(function () { return parseScopes(props.activeScopes); }, [props.activeScopes]);
  var resultLayout = (props.resultLayout || "listRich") as ResultLayoutMode;

  // ── Effective values: demo overrides when demo mode is on ──
  var effectiveLayout = props.enableDemoMode ? demoLayout : resultLayout;

  // Initialize store defaults from props
  React.useEffect(function () {
    store.setScope(props.defaultScope);
    store.setSortBy(props.defaultSortBy);
    store.setResultLayout(resultLayout);
    store.setDemoMode(props.enableDemoMode !== false);
    store.setSearchBarStyle(props.searchBarStyle || "rounded");
    store.setAccentColor(props.accentColor || "#0078d4");
    store.setBorderRadius(props.borderRadius !== undefined ? props.borderRadius : 8);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Set page size from props
  React.useEffect(function () {
    var currentQuery = useHyperSearchStore.getState().query;
    if (currentQuery.pageSize !== props.resultsPerPage) {
      useHyperSearchStore.setState({
        query: {
          queryText: currentQuery.queryText,
          scope: currentQuery.scope,
          sortBy: currentQuery.sortBy,
          refiners: currentQuery.refiners,
          startRow: currentQuery.startRow,
          pageSize: props.resultsPerPage,
        },
      });
    }
  }, [props.resultsPerPage]);

  // Load demo data if demo mode is on and no search has happened
  React.useEffect(function () {
    if (props.enableDemoMode && !store.hasSearched && !store.loading) {
      store.setResults(DEMO_RESULTS, DEMO_RESULTS.length);
      store.setRefiners(DEMO_REFINERS);
    }
  }, [props.enableDemoMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Wire up hooks
  var searchQueryHook = useSearchQuery({
    enabled: true,
    refinerFields: props.refinerFields,
    enableRefiners: props.enableRefiners,
  });
  var executeSearch = searchQueryHook.executeSearch;

  useSearchSuggestions({
    enabled: props.enableTypeAhead || features.smartAutocomplete,
    debounceMs: props.typeAheadDebounce,
    minChars: 3,
  });

  var historyHook = useSearchHistory({
    enabled: props.enableSearchHistory || features.savedSearches,
  });
  var saveEntry = historyHook.saveEntry;
  var clearHistory = historyHook.clearHistory;

  // Parse promoted results from JSON prop
  var promotedResultsConfig = React.useMemo(function () {
    return parsePromotedResults(props.promotedResults);
  }, [props.promotedResults]);

  // Match promoted results against current query
  var matchedPromoted = React.useMemo(function () {
    if (promotedResultsConfig.length === 0 || !store.query.queryText.trim()) return [];
    return matchPromotedResults(promotedResultsConfig, store.query.queryText);
  }, [promotedResultsConfig, store.query.queryText]);

  // Save to history + track analytics when results arrive
  var prevQueryRef = React.useRef("");
  React.useEffect(function () {
    if (!store.hasSearched || store.loading) return;
    var qt = store.query.queryText.trim();
    if (!qt || qt === prevQueryRef.current) return;
    prevQueryRef.current = qt;

    saveEntry(qt, store.totalResults);

    if (props.enableAnalytics) {
      trackSearch(qt, store.query.scope, store.totalResults);
      if (store.totalResults === 0) {
        trackZeroResults(qt, store.query.scope);
      }
    }
  }, [store.hasSearched, store.loading, store.totalResults, store.query.queryText, store.query.scope, saveEntry, props.enableAnalytics]);

  // Preview: find the selected result by ID
  var previewResult = React.useMemo(function () {
    if (!store.previewResultId) return undefined;
    var found: typeof store.results[0] | undefined;
    store.results.forEach(function (r) {
      if (r.id === store.previewResultId) found = r;
    });
    return found;
  }, [store.previewResultId, store.results]);

  // Search handler
  var handleSearch = function (queryText: string): void {
    // If demo mode was active, turn it off on real search
    if (store.demoMode && queryText.trim()) {
      store.setDemoMode(false);
    }
    store.setQueryText(queryText);
    setTimeout(function () { executeSearch(); }, 0);
  };

  var handleClosePreview = function (): void {
    store.setPreviewResultId("");
  };

  // Zero-query search click
  var handleZeroQuerySearch = function (query: string): void {
    handleSearch(query);
  };

  // Toggle filter panel
  var handleToggleFilters = function (): void {
    store.setFilterPanelOpen(!store.filterPanelOpen);
  };

  // Wizard
  var showWizard = store.wizardOpen || (props.showWizardOnInit && !props.wizardCompleted && props.isEditMode);

  var handleOpenWizard = function (): void {
    store.setWizardOpen(true);
  };

  var handleCloseWizard = function (): void {
    store.setWizardOpen(false);
  };

  // Check if we need to show zero-query experience
  var showZeroQuery = features.zeroQuery && !store.hasSearched && !store.loading && !store.demoMode;

  // Determine accent color
  var accentColor = props.accentColor || "#0078d4";

  return React.createElement("div", {
    className: styles.hyperSearch,
    style: { "--search-accent": accentColor, "--search-radius": String(props.borderRadius || 8) + "px" } as React.CSSProperties,
  },
    // Demo bar (when demo mode is enabled)
    props.enableDemoMode
      ? React.createElement(HyperSearchDemoBar, {
          currentScope: demoScope,
          currentLayout: demoLayout,
          showRefiners: demoShowRefiners,
          showPromoted: demoShowPromoted,
          showPreview: demoShowPreview,
          resultCount: store.results.length,
          onScopeChange: function (scope: SearchScopeType): void { setDemoScope(scope); },
          onLayoutChange: function (layout: ResultLayoutMode): void { setDemoLayout(layout); },
          onToggleRefiners: function (): void { setDemoShowRefiners(!demoShowRefiners); },
          onTogglePromoted: function (): void { setDemoShowPromoted(!demoShowPromoted); },
          onTogglePreview: function (): void { setDemoShowPreview(!demoShowPreview); },
          onExitDemo: function (): void {
            if (props.onWizardComplete) {
              props.onWizardComplete({ enableDemoMode: false });
            }
          },
        })
      : undefined,

    // Title + Configure button (in edit mode)
    props.title || props.isEditMode
      ? React.createElement("div", { className: styles.titleRow },
          props.title
            ? React.createElement("h2", { className: styles.title }, props.title)
            : undefined,
          props.isEditMode
            ? React.createElement("button", {
                className: styles.configureButton,
                onClick: handleOpenWizard,
                type: "button",
                title: "Open Setup Wizard",
              }, "\u2699\uFE0F Configure")
            : undefined
        )
      : undefined,

    // Search bar
    React.createElement(HyperSearchBar, {
      placeholderText: props.placeholderText,
      showScopeSelector: props.showScopeSelector,
      enableHistory: props.enableSearchHistory || features.savedSearches,
      history: store.history,
      onClearHistory: clearHistory,
      onSearch: handleSearch,
    }),

    // Scope tabs
    props.showScopeTabs && features.searchVerticals
      ? React.createElement(HyperSearchScopeTabs, {
          activeScopes: activeScopes,
          showCounts: true,
          accentColor: accentColor,
        })
      : undefined,

    // Zero-query experience (before any search)
    showZeroQuery
      ? React.createElement(HyperSearchZeroQuery, {
          history: store.history,
          savedSearches: store.savedSearches,
          accentColor: accentColor,
          onSearchClick: handleZeroQuerySearch,
          enableSavedSearches: features.savedSearches,
        })
      : undefined,

    // Sort bar (only show after a search)
    store.hasSearched && !store.loading
      ? React.createElement("div", { className: styles.sortAndFilterRow },
          React.createElement(HyperSearchSortBar),
          React.createElement("button", {
            className: styles.filterToggleButton,
            onClick: handleToggleFilters,
            type: "button",
          }, store.filterPanelOpen ? "Hide Filters" : "Show Filters")
        )
      : undefined,

    // Content area (filters + results)
    React.createElement("div", { className: styles.contentGrid },
      // Filter panel (left side)
      store.hasSearched
        ? React.createElement(HyperSearchV2FilterPanel, {
            filters: filters,
            accentColor: accentColor,
          })
        : undefined,
      // Main results
      React.createElement("div", { className: styles.mainContent },
        React.createElement(HyperSearchV2Results, {
          showResultIcon: props.showResultIcon,
          showResultPath: props.showResultPath,
          resultsPerPage: props.resultsPerPage,
          promotedResults: matchedPromoted,
          enablePreviews: props.enableResultPreviews || features.inlinePreview,
          enableAnalytics: props.enableAnalytics,
          resultLayout: effectiveLayout,
          enableQuickActions: features.quickActions,
          enableHitHighlight: features.hitHighlight,
          enableThumbnailPreviews: features.thumbnailPreviews,
          accentColor: accentColor,
        }),
        React.createElement(HyperSearchPagination, {
          resultsPerPage: props.resultsPerPage,
        })
      )
    ),

    // Preview panel
    props.enableResultPreviews || features.inlinePreview
      ? React.createElement(HyperSearchPreviewPanel, {
          result: previewResult,
          isOpen: !!store.previewResultId,
          onClose: handleClosePreview,
        })
      : undefined,

    // Wizard (lazy loaded)
    showWizard
      ? React.createElement(React.Suspense, { fallback: React.createElement("div", undefined) },
          React.createElement(LazyHyperWizard as React.ComponentType<Record<string, unknown>>, {
            config: require("./wizard/searchWizardConfig").SEARCH_WIZARD_CONFIG,
            isOpen: true,
            onClose: handleCloseWizard,
            onApply: function (result: Record<string, unknown>) {
              if (props.onWizardComplete) {
                props.onWizardComplete(result);
              }
              handleCloseWizard();
            },
          })
        )
      : undefined
  );
};

var HyperSearch: React.FC<IHyperSearchComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperSearchInner, props)
  );
};

export default HyperSearch;
