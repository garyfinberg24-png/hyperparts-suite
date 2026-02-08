import * as React from "react";
import { HyperErrorBoundary } from "../../../common/components";
import type { IHyperSearchWebPartProps } from "../models";
import { parsePromotedResults } from "../models";
import { useHyperSearchStore } from "../store/useHyperSearchStore";
import { useSearchQuery } from "../hooks/useSearchQuery";
import { useSearchSuggestions } from "../hooks/useSearchSuggestions";
import { useSearchHistory } from "../hooks/useSearchHistory";
import { matchPromotedResults } from "../utils/promotedResultsMatcher";
import { trackSearch, trackZeroResults } from "../utils/analyticsTracker";
import HyperSearchBar from "./HyperSearchBar";
import HyperSearchSortBar from "./HyperSearchSortBar";
import HyperSearchRefiners from "./HyperSearchRefiners";
import HyperSearchResults from "./HyperSearchResults";
import HyperSearchPagination from "./HyperSearchPagination";
import HyperSearchPreviewPanel from "./HyperSearchPreviewPanel";
import styles from "./HyperSearch.module.scss";

export interface IHyperSearchComponentProps extends IHyperSearchWebPartProps {
  instanceId: string;
  isEditMode: boolean;
}

const HyperSearchInner: React.FC<IHyperSearchComponentProps> = function (props) {
  const store = useHyperSearchStore();

  // Initialize default scope and sort from props
  React.useEffect(function () {
    store.setScope(props.defaultScope);
    store.setSortBy(props.defaultSortBy);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Set page size from props
  React.useEffect(function () {
    const currentQuery = useHyperSearchStore.getState().query;
    if (currentQuery.pageSize !== props.resultsPerPage) {
      useHyperSearchStore.setState({
        query: { ...currentQuery, pageSize: props.resultsPerPage },
      });
    }
  }, [props.resultsPerPage]);

  // Wire up hooks
  const { executeSearch } = useSearchQuery({
    enabled: true,
    refinerFields: props.refinerFields,
    enableRefiners: props.enableRefiners,
  });

  useSearchSuggestions({
    enabled: props.enableTypeAhead,
    debounceMs: props.typeAheadDebounce,
    minChars: 3,
  });

  const { saveEntry, clearHistory } = useSearchHistory({
    enabled: props.enableSearchHistory,
  });

  // Parse promoted results from JSON prop
  const promotedResultsConfig = React.useMemo(function () {
    return parsePromotedResults(props.promotedResults);
  }, [props.promotedResults]);

  // Match promoted results against current query
  const matchedPromoted = React.useMemo(function () {
    if (promotedResultsConfig.length === 0 || !store.query.queryText.trim()) return [];
    return matchPromotedResults(promotedResultsConfig, store.query.queryText);
  }, [promotedResultsConfig, store.query.queryText]);

  // Save to history + track analytics when results arrive
  const prevQueryRef = React.useRef("");
  React.useEffect(function () {
    if (!store.hasSearched || store.loading) return;
    const qt = store.query.queryText.trim();
    if (!qt || qt === prevQueryRef.current) return;
    prevQueryRef.current = qt;

    saveEntry(qt, store.totalResults);

    // Analytics
    if (props.enableAnalytics) {
      trackSearch(qt, store.query.scope, store.totalResults);
      if (store.totalResults === 0) {
        trackZeroResults(qt, store.query.scope);
      }
    }
  }, [store.hasSearched, store.loading, store.totalResults, store.query.queryText, store.query.scope, saveEntry, props.enableAnalytics]);

  // Preview: find the selected result by ID
  const previewResult = React.useMemo(function () {
    if (!store.previewResultId) return undefined;
    let found: typeof store.results[0] | undefined;
    store.results.forEach(function (r) {
      if (r.id === store.previewResultId) found = r;
    });
    return found;
  }, [store.previewResultId, store.results]);

  const handleSearch = function (queryText: string): void {
    store.setQueryText(queryText);
    // Trigger search on next tick after state updates
    setTimeout(function () { executeSearch(); }, 0);
  };

  const handleClosePreview = function (): void {
    store.setPreviewResultId("");
  };

  return React.createElement(
    "div",
    { className: styles.hyperSearch },
    // Title
    props.title
      ? React.createElement("h2", { className: styles.title }, props.title)
      : undefined,
    // Search bar
    React.createElement(HyperSearchBar, {
      placeholderText: props.placeholderText,
      showScopeSelector: props.showScopeSelector,
      enableHistory: props.enableSearchHistory,
      history: store.history,
      onClearHistory: clearHistory,
      onSearch: handleSearch,
    }),
    // Sort bar (only show after a search)
    store.hasSearched && !store.loading
      ? React.createElement(HyperSearchSortBar)
      : undefined,
    // Content area
    React.createElement(
      "div",
      { className: styles.contentGrid },
      // Refiners panel (left side)
      props.enableRefiners && store.hasSearched
        ? React.createElement(HyperSearchRefiners)
        : undefined,
      // Main results
      React.createElement(
        "div",
        { className: styles.mainContent },
        React.createElement(HyperSearchResults, {
          showResultIcon: props.showResultIcon,
          showResultPath: props.showResultPath,
          resultsPerPage: props.resultsPerPage,
          promotedResults: matchedPromoted,
          enablePreviews: props.enableResultPreviews,
          enableAnalytics: props.enableAnalytics,
        }),
        React.createElement(HyperSearchPagination, {
          resultsPerPage: props.resultsPerPage,
        })
      )
    ),
    // Preview panel
    props.enableResultPreviews
      ? React.createElement(HyperSearchPreviewPanel, {
          result: previewResult,
          isOpen: !!store.previewResultId,
          onClose: handleClosePreview,
        })
      : undefined
  );
};

const HyperSearch: React.FC<IHyperSearchComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperSearchInner, props)
  );
};

export default HyperSearch;
