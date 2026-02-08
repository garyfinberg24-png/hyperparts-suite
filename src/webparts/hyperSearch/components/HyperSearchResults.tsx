import * as React from "react";
import { HyperSkeleton, HyperEmptyState } from "../../../common/components";
import type { IHyperSearchResult, IPromotedResult } from "../models";
import { useHyperSearchStore } from "../store/useHyperSearchStore";
import { trackResultClick, trackPreviewOpen } from "../utils/analyticsTracker";
import { DocumentResult, PageResult, PersonResult, MessageResult, SiteResult } from "./resultTypes";
import HyperSearchPromotedResults from "./HyperSearchPromotedResults";
import HyperSearchZeroResults from "./HyperSearchZeroResults";
import styles from "./HyperSearchResults.module.scss";

export interface IHyperSearchResultsProps {
  showResultIcon: boolean;
  showResultPath: boolean;
  resultsPerPage: number;
  promotedResults: IPromotedResult[];
  enablePreviews: boolean;
  enableAnalytics: boolean;
}

/**
 * Renders a single result using the appropriate result type renderer.
 */
function renderResultByType(
  result: IHyperSearchResult,
  showPath: boolean
): React.ReactElement {
  switch (result.resultType) {
    case "document":
      return React.createElement(DocumentResult, { result: result, showPath: showPath });
    case "page":
      return React.createElement(PageResult, { result: result, showPath: showPath });
    case "person":
      return React.createElement(PersonResult, { result: result });
    case "message":
      return React.createElement(MessageResult, { result: result });
    case "site":
      return React.createElement(SiteResult, { result: result });
    default:
      // Fallback: use DocumentResult for unknown types
      return React.createElement(DocumentResult, { result: result, showPath: showPath });
  }
}

const HyperSearchResults: React.FC<IHyperSearchResultsProps> = function (props) {
  const store = useHyperSearchStore();

  // Not yet searched
  if (!store.hasSearched && !store.loading) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  // Loading
  if (store.loading) {
    return React.createElement(
      "div",
      { className: styles.loadingContainer, "aria-busy": "true", "aria-label": "Loading search results" },
      React.createElement(HyperSkeleton, { count: 3, variant: "rectangular", width: "100%", height: 72 })
    );
  }

  // Error
  if (store.error) {
    return React.createElement(HyperEmptyState, {
      title: "Search Error",
      description: store.error,
      iconName: "ErrorBadge",
    });
  }

  // No results — use HyperSearchZeroResults component
  if (store.results.length === 0) {
    return React.createElement(HyperSearchZeroResults, {
      spellingSuggestion: store.spellingSuggestion,
      onSpellingSuggestionClick: function (suggestion: string) {
        store.setQueryText(suggestion);
      },
    });
  }

  // Build result count text
  const countText = String(store.totalResults) + " " +
    (store.totalResults === 1 ? "result" : "results");

  // Handle result click with analytics
  const handleResultClick = function (result: IHyperSearchResult, rank: number): void {
    if (props.enableAnalytics) {
      trackResultClick(store.query.queryText, result.url, rank);
    }
  };

  // Handle preview open with analytics
  const handlePreviewOpen = function (result: IHyperSearchResult): void {
    store.setPreviewResultId(result.id);
    if (props.enableAnalytics) {
      trackPreviewOpen(store.query.queryText, result.url);
    }
  };

  // Build result items using type-specific renderers
  const resultItems: React.ReactElement[] = [];
  store.results.forEach(function (result: IHyperSearchResult, index: number) {
    const itemChildren: React.ReactElement[] = [
      React.createElement(
        "div",
        { key: "content", className: styles.resultItemContent },
        renderResultByType(result, props.showResultPath)
      ),
    ];

    // Preview button for documents
    if (props.enablePreviews && result.fileType) {
      itemChildren.push(
        React.createElement(
          "button",
          {
            key: "preview",
            type: "button",
            className: styles.previewButton,
            "aria-label": "Preview " + result.title,
            onClick: function () { handlePreviewOpen(result); },
          },
          "\uD83D\uDC41"
        )
      );
    }

    resultItems.push(
      React.createElement(
        "li",
        {
          key: result.id + "-" + index,
          role: "listitem",
          className: styles.resultItem,
        },
        React.createElement(
          "a",
          {
            href: result.url,
            className: styles.resultLink,
            target: "_blank",
            rel: "noopener noreferrer",
            onClick: function () { handleResultClick(result, index + 1); },
          },
          itemChildren
        )
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.resultsContainer },
    // Promoted results (above regular results)
    React.createElement(HyperSearchPromotedResults, {
      promotedResults: props.promotedResults,
    }),
    // Results header with count
    React.createElement(
      "div",
      { className: styles.resultsHeader },
      React.createElement(
        "span",
        { className: styles.resultCount, "aria-live": "polite" },
        countText
      )
    ),
    // Result list
    React.createElement(
      "ul",
      { className: styles.resultList, role: "list" },
      resultItems
    )
  );
};

export default HyperSearchResults;
