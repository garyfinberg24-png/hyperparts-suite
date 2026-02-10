import * as React from "react";
import { useMemo, useEffect } from "react";
import type { IHyperNewsWebPartProps, IHyperNewsArticle, LayoutType } from "../models";
import { DEFAULT_FILTER_CONFIG } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton } from "../../../common/components";
import { useNewsArticles, useReadingProgress, useNewsFilters, useInfiniteScroll } from "../hooks";
import { useHyperNewsStore } from "../store/useHyperNewsStore";
import { hyperAnalytics } from "../../../common/services/HyperAnalytics";
import { getSampleArticles } from "../utils/sampleNews";
import {
  CardGridLayout,
  ListLayout,
  MagazineLayout,
  NewspaperLayout,
  TimelineLayout,
  CarouselLayout,
  HeroGridLayout,
  CompactLayout,
  FilmstripLayout,
  MosaicLayout,
  SideBySideLayout,
  TilesLayout,
} from "./layouts";
import { HyperNewsQuickReadModal } from "./HyperNewsQuickReadModal";
import { HyperNewsFilterBar } from "./HyperNewsFilterBar";
import HyperNewsDemoBar from "./HyperNewsDemoBar";
import { HyperWizard } from "../../../common/components/wizard/HyperWizard";
import { NEWS_WIZARD_CONFIG, buildStateFromProps } from "./wizard/newsWizardConfig";
// Cross-web-part import: HyperImageBrowser from HyperHero shared components (pitfall #29)
import { HyperImageBrowser } from "../../hyperHero/components/shared/HyperImageBrowser";
import type { IHyperImageBrowserProps } from "../../hyperHero/components/shared/HyperImageBrowser";
import styles from "./HyperNews.module.scss";

export interface IHyperNewsComponentProps extends IHyperNewsWebPartProps {
  instanceId: string;
  /** Callback from web part class to persist wizard result */
  onWizardApply?: (result: Partial<IHyperNewsWebPartProps>) => void;
  /** Callback from web part class to trigger wizard open */
  onOpenWizard?: () => void;
  /** Callback when user selects an image from the browser */
  onImageSelect?: (imageUrl: string) => void;
}

/** Select the correct layout component for a given layoutType */
function _renderLayout(
  layoutType: LayoutType,
  articles: IHyperNewsArticle[],
  onCardClick: (article: IHyperNewsArticle) => void
): React.ReactElement {
  var layoutProps = { articles: articles, onCardClick: onCardClick };

  if (layoutType === "list") {
    return React.createElement(ListLayout, layoutProps);
  } else if (layoutType === "magazine") {
    return React.createElement(MagazineLayout, layoutProps);
  } else if (layoutType === "newspaper") {
    return React.createElement(NewspaperLayout, layoutProps);
  } else if (layoutType === "timeline") {
    return React.createElement(TimelineLayout, layoutProps);
  } else if (layoutType === "carousel") {
    return React.createElement(CarouselLayout, layoutProps);
  } else if (layoutType === "heroGrid") {
    return React.createElement(HeroGridLayout, layoutProps);
  } else if (layoutType === "compact") {
    return React.createElement(CompactLayout, layoutProps);
  } else if (layoutType === "filmstrip") {
    return React.createElement(FilmstripLayout, layoutProps);
  } else if (layoutType === "mosaic") {
    return React.createElement(MosaicLayout, layoutProps);
  } else if (layoutType === "sideBySide") {
    return React.createElement(SideBySideLayout, layoutProps);
  } else if (layoutType === "tiles") {
    return React.createElement(TilesLayout, layoutProps);
  }
  return React.createElement(CardGridLayout, layoutProps);
}

var HyperNewsInner: React.FC<IHyperNewsComponentProps> = function (props) {
  var title = props.title;
  var sourcesJson = props.sourcesJson;
  var externalArticlesJson = props.externalArticlesJson;
  var manualArticlesJson = props.manualArticlesJson;
  var pageSize = props.pageSize;
  var layoutType = props.layoutType;
  var enableReadTracking = props.enableReadTracking;
  var enableQuickRead = props.enableQuickRead;
  var enableReactions = props.enableReactions;
  var enableInfiniteScroll = props.enableInfiniteScroll;
  var filterConfig = props.filterConfig;
  var reactionListName = props.reactionListName;
  var instanceId = props.instanceId;
  var showWizardOnInit = props.showWizardOnInit;
  var onWizardApply = props.onWizardApply;

  // ── Demo mode overrides from store ──
  var demoLayout = useHyperNewsStore(function (s) { return s.demoLayout; });
  var demoPageSize = useHyperNewsStore(function (s) { return s.demoPageSize; });
  var demoDisplayToggles = useHyperNewsStore(function (s) { return s.demoDisplayToggles; });

  // Apply demo overrides when demoMode is on
  var effectiveLayout: LayoutType = props.demoMode && demoLayout !== undefined ? demoLayout : layoutType;
  var effectivePageSize: number = props.demoMode && demoPageSize !== undefined ? demoPageSize : pageSize;
  var effectiveShowImages: boolean = props.demoMode ? demoDisplayToggles.showImages !== false : props.showImages;
  var effectiveShowDescription: boolean = props.demoMode ? demoDisplayToggles.showDescription !== false : props.showDescription;
  var effectiveShowAuthor: boolean = props.demoMode ? demoDisplayToggles.showAuthor !== false : props.showAuthor;
  var effectiveShowDate: boolean = props.demoMode ? demoDisplayToggles.showDate !== false : props.showDate;
  var effectiveShowReadTime: boolean = props.demoMode ? demoDisplayToggles.showReadTime !== false : props.showReadTime;

  // Suppress unused var warnings for display overrides (used by layouts via props)
  void effectiveShowImages;
  void effectiveShowDescription;
  void effectiveShowAuthor;
  void effectiveShowDate;
  void effectiveShowReadTime;

  // ── Sample data ──
  var sampleArticles = useMemo(function () {
    if (props.useSampleData) {
      return getSampleArticles();
    }
    return [];
  }, [props.useSampleData]);

  var newsResult = useNewsArticles({
    sourcesJson: sourcesJson || "[]",
    externalArticlesJson: externalArticlesJson || "[]",
    manualArticlesJson: manualArticlesJson || "[]",
    pageSize: effectivePageSize,
  });
  var liveArticles = newsResult.articles;
  var loading = newsResult.loading;
  var error = newsResult.error;
  var hasMore = newsResult.hasMore;
  var loadMore = newsResult.loadMore;

  // Merge sample data in front of live articles (sample appears first)
  var articles = useMemo(function (): IHyperNewsArticle[] {
    if (sampleArticles.length > 0) {
      return sampleArticles.concat(liveArticles);
    }
    return liveArticles;
  }, [sampleArticles, liveArticles]);

  var readProgress = useReadingProgress();
  var isRead = readProgress.isRead;
  var markAsRead = readProgress.markAsRead;

  var storeState = useHyperNewsStore();
  var quickReadArticleId = storeState.quickReadArticleId;
  var isQuickReadOpen = storeState.isQuickReadOpen;
  var openQuickRead = storeState.openQuickRead;
  var closeQuickRead = storeState.closeQuickRead;
  var isWizardOpen = storeState.isWizardOpen;
  var openWizard = storeState.openWizard;
  var closeWizard = storeState.closeWizard;

  // Auto-open wizard on first load when showWizardOnInit is true and no sources configured
  useEffect(function () {
    if (showWizardOnInit && (!sourcesJson || sourcesJson === "[]") && !props.useSampleData) {
      openWizard();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Build wizard state override from current props (for re-editing)
  var wizardStateOverride = useMemo(function () {
    return buildStateFromProps(props);
  }, [props.sourcesJson, props.layoutType, props.pageSize, props.showFeatured,
      props.maxFeatured, props.showImages, props.showDescription, props.showAuthor,
      props.showDate, props.showReadTime, props.enableInfiniteScroll, props.enableQuickRead,
      props.enableReactions, props.enableBookmarks, props.enableReadTracking,
      props.enableScheduling, props.filterConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle wizard apply
  var handleWizardApply = React.useCallback(function (result: Partial<IHyperNewsWebPartProps>): void {
    if (onWizardApply) {
      onWizardApply(result);
    }
    closeWizard();
  }, [onWizardApply, closeWizard]);

  // Enrich articles with "isNew" flag based on reading progress
  var enrichedArticles = useMemo(function (): IHyperNewsArticle[] {
    if (!enableReadTracking) return articles;
    var result: IHyperNewsArticle[] = [];
    articles.forEach(function (article) {
      result.push({
        Id: article.Id,
        Title: article.Title,
        Created: article.Created,
        Modified: article.Modified,
        Author: article.Author,
        BannerImageUrl: article.BannerImageUrl,
        Description: article.Description,
        FirstPublishedDate: article.FirstPublishedDate,
        FileRef: article.FileRef,
        FileLeafRef: article.FileLeafRef,
        PromotedState: article.PromotedState,
        Categories: article.Categories,
        readTime: article.readTime,
        isPinned: article.isPinned,
        pinOrder: article.pinOrder,
        reactionCounts: article.reactionCounts,
        isNew: !isRead(article.Id),
      });
    });
    return result;
  }, [articles, enableReadTracking, isRead]);

  // Apply client-side filters
  var effectiveFilterConfig = filterConfig || DEFAULT_FILTER_CONFIG;
  var filterResult = useNewsFilters({
    articles: enrichedArticles,
    filterConfig: effectiveFilterConfig,
  });
  var filteredArticles = filterResult.filteredArticles;
  var activeFilterCount = filterResult.activeFilterCount;

  // Slice to effective page size
  var displayArticles = useMemo(function (): IHyperNewsArticle[] {
    if (effectivePageSize > 0 && filteredArticles.length > effectivePageSize) {
      return filteredArticles.slice(0, effectivePageSize);
    }
    return filteredArticles;
  }, [filteredArticles, effectivePageSize]);

  // Infinite scroll
  useInfiniteScroll({
    enabled: enableInfiniteScroll,
    hasMore: hasMore,
    loading: loading,
    loadMore: loadMore,
  });

  // Find the article for the quick read modal
  var quickReadArticle: IHyperNewsArticle | undefined;
  if (quickReadArticleId) {
    displayArticles.forEach(function (a) {
      if (a.Id === quickReadArticleId) {
        quickReadArticle = a;
      }
    });
  }

  // Clear filters handler
  var handleClearFilters = React.useCallback(function (): void {
    hyperAnalytics.trackInteraction(instanceId, "clearFilters", "");
  }, [instanceId]);

  // Card click handler
  var handleCardClick = React.useCallback(function (article: IHyperNewsArticle): void {
    markAsRead(article.Id);
    hyperAnalytics.trackInteraction(instanceId, "articleClick", article.Title);

    if (enableQuickRead) {
      openQuickRead(article.Id);
    } else if (article.FileRef) {
      window.open(article.FileRef, "_blank");
    }
  }, [instanceId, markAsRead, enableQuickRead, openQuickRead]);

  // Edit-mode toolbar "Configure" button handler
  var handleConfigureClick = React.useCallback(function (): void {
    openWizard();
  }, [openWizard]);

  // ── Wizard element (always rendered) ──
  var wizardElement = React.createElement(HyperWizard, {
    config: NEWS_WIZARD_CONFIG,
    isOpen: isWizardOpen,
    onClose: closeWizard,
    onApply: handleWizardApply,
    initialStateOverride: wizardStateOverride,
  });

  // ── Demo bar element ──
  var demoBarElement = props.demoMode
    ? React.createElement(HyperNewsDemoBar, { key: "demobar" })
    : undefined;

  // ── Sample data banner ──
  var sampleBannerElement = props.useSampleData && !props.demoMode
    ? React.createElement("div", {
        key: "banner",
        style: {
          background: "linear-gradient(90deg, #fff7ed, #fef3c7)",
          border: "1px solid #fbbf24",
          borderRadius: "6px",
          padding: "8px 16px",
          marginBottom: "12px",
          fontSize: "13px",
          color: "#92400e",
        },
      }, "Sample Data \u2014 Turn off \"Use Sample Data\" in the property pane and configure your news sources.") as React.ReactNode
    : undefined;

  // Loading state (only when no sample data)
  if (loading && displayArticles.length === 0) {
    return React.createElement(
      "div",
      { className: styles.newsContainer, role: "region", "aria-label": title || "News" },
      demoBarElement,
      title
        ? React.createElement("h2", { className: styles.newsTitle }, title)
        : undefined,
      React.createElement(HyperSkeleton, { count: 3, height: 200, variant: "rectangular" }),
      wizardElement
    );
  }

  // Error state
  if (error && displayArticles.length === 0) {
    return React.createElement(
      "div",
      { className: styles.newsContainer, role: "region", "aria-label": title || "News" },
      demoBarElement,
      title
        ? React.createElement("h2", { className: styles.newsTitle }, title)
        : undefined,
      React.createElement(HyperEmptyState, {
        title: "Failed to load news",
        description: error.message,
      }),
      wizardElement
    );
  }

  // Empty state
  if (displayArticles.length === 0) {
    return React.createElement(
      "div",
      { className: styles.newsContainer, role: "region", "aria-label": title || "News" },
      demoBarElement,
      title
        ? React.createElement("h2", { className: styles.newsTitle }, title)
        : undefined,
      activeFilterCount > 0
        ? React.createElement(HyperEmptyState, {
            title: "No matching articles",
            description: "Try adjusting your filters to see more results.",
          })
        : React.createElement(HyperEmptyState, {
            title: "No news articles found",
            description: "Use the Configure button or property pane to set up content sources.",
          }),
      wizardElement
    );
  }

  // ── Render layout ──
  var layoutElement = _renderLayout(effectiveLayout, displayArticles, handleCardClick);

  return React.createElement(
    "div",
    { className: styles.newsContainer, role: "region", "aria-label": title || "News" },
    // Demo bar (rendered above everything when demo mode is on)
    demoBarElement,
    // Sample data banner
    sampleBannerElement,
    // Title row with Configure button
    React.createElement("div", { className: styles.newsTitleRow },
      title
        ? React.createElement("h2", { className: styles.newsTitle }, title)
        : undefined,
      React.createElement("button", {
        className: styles.configureBtn,
        onClick: handleConfigureClick,
        type: "button",
        "aria-label": "Configure HyperNews",
      }, "\u2699\uFE0F Configure")
    ),
    // Filter bar
    React.createElement(HyperNewsFilterBar, {
      filterConfig: effectiveFilterConfig,
      activeFilterCount: activeFilterCount,
      onClearFilters: handleClearFilters,
    }),
    // Article layout wrapped in feed role for infinite scroll semantics
    React.createElement(
      "div",
      { role: enableInfiniteScroll ? "feed" : undefined, "aria-busy": loading },
      layoutElement
    ),
    // Loading indicator for infinite scroll
    loading
      ? React.createElement(
          "div",
          { className: styles.loadingMore, "aria-live": "polite" },
          "Loading more articles..."
        )
      : undefined,
    // Quick read modal
    React.createElement(HyperNewsQuickReadModal, {
      article: quickReadArticle,
      isOpen: isQuickReadOpen,
      onClose: closeQuickRead,
      reactionListName: reactionListName,
      enableReactions: enableReactions,
    }),
    // Setup wizard modal (always rendered, controlled by store)
    wizardElement
  );
};

// ── Wrapper with Image Browser modal ──
var HyperNewsWithBrowser: React.FC<IHyperNewsComponentProps> = function (props) {
  var isBrowserOpen = useHyperNewsStore(function (s) { return s.isBrowserOpen; });
  var closeBrowser = useHyperNewsStore(function (s) { return s.closeBrowser; });

  /** Called when user selects an image from the SP browser */
  function handleBrowserSelect(selectedUrl: string): void {
    closeBrowser();
    if (props.onImageSelect) {
      props.onImageSelect(selectedUrl);
    }
  }

  return React.createElement(
    React.Fragment,
    undefined,
    React.createElement(HyperNewsInner, props),
    // SharePoint Image Browser (right-docked panel)
    React.createElement(HyperImageBrowser, {
      isOpen: isBrowserOpen,
      onClose: function () { closeBrowser(); },
      onSelect: handleBrowserSelect,
      size: "panel",
    } as IHyperImageBrowserProps)
  );
};

var HyperNews: React.FC<IHyperNewsComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperNewsWithBrowser, props)
  );
};

export default HyperNews;
