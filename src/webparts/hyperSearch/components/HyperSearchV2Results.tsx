import * as React from "react";
import { HyperSkeleton, HyperEmptyState } from "../../../common/components";
import type { IHyperSearchResult, IPromotedResult, ResultLayoutMode } from "../models";
import { useHyperSearchStore } from "../store/useHyperSearchStore";
import { trackResultClick, trackPreviewOpen } from "../utils/analyticsTracker";

import HyperSearchPromotedResults from "./HyperSearchPromotedResults";
import HyperSearchZeroResults from "./HyperSearchZeroResults";
import styles from "./HyperSearchV2Results.module.scss";

export interface IHyperSearchV2ResultsProps {
  showResultIcon: boolean;
  showResultPath: boolean;
  resultsPerPage: number;
  promotedResults: IPromotedResult[];
  enablePreviews: boolean;
  enableAnalytics: boolean;
  resultLayout: ResultLayoutMode;
  enableQuickActions: boolean;
  enableHitHighlight: boolean;
  enableThumbnailPreviews: boolean;
  accentColor: string;
}

/** File type icon lookup */
var FILE_TYPE_ICONS: Record<string, string> = {
  docx: "\uD83D\uDCC4",
  doc: "\uD83D\uDCC4",
  xlsx: "\uD83D\uDCCA",
  xls: "\uD83D\uDCCA",
  pptx: "\uD83D\uDCCA",
  ppt: "\uD83D\uDCCA",
  pdf: "\uD83D\uDCC4",
  aspx: "\uD83C\uDF10",
  html: "\uD83C\uDF10",
  pbix: "\uD83D\uDCCA",
};

/** Time ago helper */
function timeAgo(dateStr: string | undefined): string {
  if (!dateStr) return "";
  var now = Date.now();
  var then = new Date(dateStr).getTime();
  var diff = now - then;
  var days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return String(days) + " days ago";
  if (days < 30) return String(Math.floor(days / 7)) + " weeks ago";
  if (days < 365) return String(Math.floor(days / 30)) + " months ago";
  return String(Math.floor(days / 365)) + " years ago";
}

/**
 * Renders quick action buttons for a result.
 */
function renderQuickActions(result: IHyperSearchResult): React.ReactElement {
  var actions: React.ReactElement[] = [];

  // Copy link
  actions.push(
    React.createElement("button", {
      key: "copy",
      className: styles.quickActionBtn,
      type: "button",
      title: "Copy link",
      "aria-label": "Copy link to " + result.title,
      onClick: function (e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(result.url).catch(function () { /* noop */ });
        }
      },
    }, "\uD83D\uDD17")
  );

  // Email (for docs and pages)
  if (result.resultType === "document" || result.resultType === "page") {
    actions.push(
      React.createElement("a", {
        key: "email",
        className: styles.quickActionBtn,
        href: "mailto:?subject=" + encodeURIComponent(result.title) + "&body=" + encodeURIComponent(result.url),
        title: "Email",
        "aria-label": "Email " + result.title,
        onClick: function (e: React.MouseEvent) { e.stopPropagation(); },
      }, "\uD83D\uDCE7")
    );
  }

  // Chat (for people)
  if (result.resultType === "person" && result.authorEmail) {
    actions.push(
      React.createElement("a", {
        key: "chat",
        className: styles.quickActionBtn,
        href: "https://teams.microsoft.com/l/chat/0/0?users=" + encodeURIComponent(result.authorEmail),
        target: "_blank",
        rel: "noopener noreferrer",
        title: "Chat in Teams",
        "aria-label": "Chat with " + result.title,
        onClick: function (e: React.MouseEvent) { e.stopPropagation(); },
      }, "\uD83D\uDCAC")
    );
  }

  return React.createElement("div", { className: styles.quickActions }, actions);
}

/**
 * Renders a result in Rich List layout.
 */
function renderRichListItem(
  result: IHyperSearchResult,
  props: IHyperSearchV2ResultsProps,
  index: number,
  handleClick: (r: IHyperSearchResult, rank: number) => void,
  handlePreview: (r: IHyperSearchResult) => void
): React.ReactElement {
  var icon = FILE_TYPE_ICONS[result.fileType || ""] || "\uD83D\uDCC4";
  if (result.resultType === "person") icon = "\uD83D\uDC64";
  if (result.resultType === "site") icon = "\uD83C\uDF10";
  if (result.resultType === "message") icon = "\uD83D\uDCE8";

  var children: React.ReactElement[] = [];

  // Icon / thumbnail
  children.push(
    React.createElement("div", { key: "icon", className: styles.richIcon }, icon)
  );

  // Content
  var contentChildren: React.ReactElement[] = [];

  // Title
  contentChildren.push(
    React.createElement("div", { key: "title", className: styles.richTitle }, result.title)
  );

  // Description with optional hit highlighting
  if (result.hitHighlightedSummary && props.enableHitHighlight) {
    contentChildren.push(
      React.createElement("div", {
        key: "desc",
        className: styles.richDesc,
        dangerouslySetInnerHTML: { __html: result.hitHighlightedSummary },
      })
    );
  } else if (result.description) {
    contentChildren.push(
      React.createElement("div", { key: "desc", className: styles.richDesc }, result.description)
    );
  }

  // Metadata line
  var metaParts: string[] = [];
  if (result.author) metaParts.push(result.author);
  if (result.siteName) metaParts.push(result.siteName);
  if (result.modified) metaParts.push(timeAgo(result.modified));
  if (result.fields && result.fields.size) metaParts.push(String(result.fields.size));

  if (metaParts.length > 0) {
    contentChildren.push(
      React.createElement("div", { key: "meta", className: styles.richMeta }, metaParts.join(" \u00B7 "))
    );
  }

  // Path breadcrumb
  if (props.showResultPath && result.path) {
    contentChildren.push(
      React.createElement("div", { key: "path", className: styles.richPath }, result.path)
    );
  }

  children.push(
    React.createElement("div", { key: "content", className: styles.richContent }, contentChildren)
  );

  // Right side: quick actions + preview
  var rightChildren: React.ReactElement[] = [];
  if (props.enableQuickActions) {
    rightChildren.push(React.createElement("div", { key: "actions" }, renderQuickActions(result)));
  }
  if (props.enablePreviews && result.fileType) {
    rightChildren.push(
      React.createElement("button", {
        key: "preview",
        className: styles.previewBtn,
        type: "button",
        title: "Preview",
        "aria-label": "Preview " + result.title,
        onClick: function (e: React.MouseEvent) {
          e.preventDefault();
          e.stopPropagation();
          handlePreview(result);
        },
      }, "\uD83D\uDC41\uFE0F")
    );
  }
  if (rightChildren.length > 0) {
    children.push(React.createElement("div", { key: "right", className: styles.richRight }, rightChildren));
  }

  return React.createElement("li", {
    key: result.id + "-" + String(index),
    className: styles.richItem,
    role: "listitem",
  },
    React.createElement("a", {
      href: result.url,
      className: styles.richLink,
      target: "_blank",
      rel: "noopener noreferrer",
      onClick: function () { handleClick(result, index + 1); },
    }, children)
  );
}

/**
 * Renders a result in Card Grid layout.
 */
function renderCardGridItem(
  result: IHyperSearchResult,
  props: IHyperSearchV2ResultsProps,
  index: number,
  handleClick: (r: IHyperSearchResult, rank: number) => void
): React.ReactElement {
  var icon = FILE_TYPE_ICONS[result.fileType || ""] || "\uD83D\uDCC4";
  if (result.resultType === "person") icon = "\uD83D\uDC64";
  if (result.resultType === "site") icon = "\uD83C\uDF10";

  return React.createElement("a", {
    key: result.id + "-" + String(index),
    className: styles.cardGridItem,
    href: result.url,
    target: "_blank",
    rel: "noopener noreferrer",
    onClick: function () { handleClick(result, index + 1); },
  },
    React.createElement("div", { className: styles.cardGridHeader },
      React.createElement("span", { className: styles.cardGridIcon }, icon),
      result.fileType
        ? React.createElement("span", { className: styles.cardGridBadge }, result.fileType.toUpperCase())
        : undefined
    ),
    React.createElement("div", { className: styles.cardGridTitle }, result.title),
    result.description
      ? React.createElement("div", { className: styles.cardGridDesc },
          result.description.length > 100 ? result.description.substring(0, 100) + "..." : result.description
        )
      : undefined,
    React.createElement("div", { className: styles.cardGridMeta },
      result.author ? React.createElement("span", undefined, result.author) : undefined,
      result.modified ? React.createElement("span", undefined, timeAgo(result.modified)) : undefined
    )
  );
}

/**
 * Renders a result in Compact List layout.
 */
function renderCompactListItem(
  result: IHyperSearchResult,
  index: number,
  handleClick: (r: IHyperSearchResult, rank: number) => void
): React.ReactElement {
  var icon = FILE_TYPE_ICONS[result.fileType || ""] || "\uD83D\uDCC4";
  if (result.resultType === "person") icon = "\uD83D\uDC64";

  return React.createElement("li", {
    key: result.id + "-" + String(index),
    className: styles.compactItem,
    role: "listitem",
  },
    React.createElement("a", {
      href: result.url,
      className: styles.compactLink,
      target: "_blank",
      rel: "noopener noreferrer",
      onClick: function () { handleClick(result, index + 1); },
    },
      React.createElement("span", { className: styles.compactIcon }, icon),
      React.createElement("span", { className: styles.compactTitle }, result.title),
      result.author ? React.createElement("span", { className: styles.compactAuthor }, result.author) : undefined,
      result.modified ? React.createElement("span", { className: styles.compactDate }, timeAgo(result.modified)) : undefined
    )
  );
}

/**
 * Renders a result in People Grid layout.
 */
function renderPeopleGridItem(
  result: IHyperSearchResult,
  index: number,
  handleClick: (r: IHyperSearchResult, rank: number) => void
): React.ReactElement {
  var dept = result.fields && result.fields.department ? String(result.fields.department) : "";
  var jobTitle = result.fields && result.fields.jobTitle ? String(result.fields.jobTitle) : result.description || "";
  var location = result.fields && result.fields.officeLocation ? String(result.fields.officeLocation) : "";

  return React.createElement("a", {
    key: result.id + "-" + String(index),
    className: styles.peopleGridItem,
    href: result.url,
    target: "_blank",
    rel: "noopener noreferrer",
    onClick: function () { handleClick(result, index + 1); },
  },
    React.createElement("div", { className: styles.peopleAvatar }, "\uD83D\uDC64"),
    React.createElement("div", { className: styles.peopleName }, result.title),
    React.createElement("div", { className: styles.peopleJobTitle }, jobTitle),
    dept ? React.createElement("div", { className: styles.peopleDept }, dept) : undefined,
    location ? React.createElement("div", { className: styles.peopleLocation }, "\uD83D\uDCCD " + location) : undefined
  );
}

var HyperSearchV2Results: React.FC<IHyperSearchV2ResultsProps> = function (props) {
  var store = useHyperSearchStore();

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

  // No results
  if (store.results.length === 0) {
    return React.createElement(HyperSearchZeroResults, {
      spellingSuggestion: store.spellingSuggestion,
      onSpellingSuggestionClick: function (suggestion: string) {
        store.setQueryText(suggestion);
      },
    });
  }

  // Click handlers
  var handleResultClick = function (result: IHyperSearchResult, rank: number): void {
    if (props.enableAnalytics) {
      trackResultClick(store.query.queryText, result.url, rank);
    }
  };

  var handlePreviewOpen = function (result: IHyperSearchResult): void {
    store.setPreviewResultId(result.id);
    if (props.enableAnalytics) {
      trackPreviewOpen(store.query.queryText, result.url);
    }
  };

  // Build result count text
  var countText = String(store.totalResults) + " " + (store.totalResults === 1 ? "result" : "results");

  // Render results based on layout mode
  var resultElements: React.ReactElement[] = [];
  var layout = props.resultLayout;

  store.results.forEach(function (result, index) {
    if (layout === "cardGrid" || layout === "mediaGallery") {
      resultElements.push(renderCardGridItem(result, props, index, handleResultClick));
    } else if (layout === "listCompact") {
      resultElements.push(renderCompactListItem(result, index, handleResultClick));
    } else if (layout === "peopleGrid") {
      resultElements.push(renderPeopleGridItem(result, index, handleResultClick));
    } else {
      // Default: listRich (also used for magazine, table, conversation, timeline, previewPanel)
      resultElements.push(renderRichListItem(result, props, index, handleResultClick, handlePreviewOpen));
    }
  });

  // Determine container class based on layout
  var listClass = styles.resultList;
  if (layout === "cardGrid" || layout === "mediaGallery") {
    listClass = styles.resultGrid;
  } else if (layout === "peopleGrid") {
    listClass = styles.resultPeopleGrid;
  } else if (layout === "listCompact") {
    listClass = styles.resultListCompact;
  }

  return React.createElement("div", { className: styles.resultsContainer },
    // Promoted results
    React.createElement(HyperSearchPromotedResults, {
      promotedResults: props.promotedResults,
    }),
    // Results header
    React.createElement("div", { className: styles.resultsHeader },
      React.createElement("span", { className: styles.resultCount, "aria-live": "polite" }, countText),
      React.createElement("span", { className: styles.layoutLabel },
        layout === "listRich" ? "Rich List" :
        layout === "listCompact" ? "Compact List" :
        layout === "cardGrid" ? "Card Grid" :
        layout === "magazine" ? "Magazine" :
        layout === "table" ? "Table" :
        layout === "peopleGrid" ? "People Grid" :
        layout === "mediaGallery" ? "Media Gallery" :
        layout === "conversation" ? "Conversation" :
        layout === "timeline" ? "Timeline" :
        layout === "previewPanel" ? "Preview Panel" : "List"
      )
    ),
    // Results
    (layout === "cardGrid" || layout === "mediaGallery" || layout === "peopleGrid")
      ? React.createElement("div", { className: listClass }, resultElements)
      : React.createElement("ul", { className: listClass, role: "list" }, resultElements)
  );
};

export default HyperSearchV2Results;
