import * as React from "react";
import { useMemo, useEffect } from "react";
import type { IHyperNewsWebPartProps, IHyperNewsArticle } from "../models";
import { DEFAULT_FILTER_CONFIG } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton } from "../../../common/components";
import { useNewsArticles, useReadingProgress, useNewsFilters, useInfiniteScroll } from "../hooks";
import { useHyperNewsStore } from "../store/useHyperNewsStore";
import { hyperAnalytics } from "../../../common/services/HyperAnalytics";
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
import { HyperWizard } from "../../../common/components/wizard/HyperWizard";
import { NEWS_WIZARD_CONFIG, buildStateFromProps } from "./wizard/newsWizardConfig";
import styles from "./HyperNews.module.scss";

export interface IHyperNewsComponentProps extends IHyperNewsWebPartProps {
  instanceId: string;
  /** Callback from web part class to persist wizard result */
  onWizardApply?: (result: Partial<IHyperNewsWebPartProps>) => void;
  /** Callback from web part class to trigger wizard open */
  onOpenWizard?: () => void;
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

  var newsResult = useNewsArticles({
    sourcesJson: sourcesJson || "[]",
    externalArticlesJson: externalArticlesJson || "[]",
    manualArticlesJson: manualArticlesJson || "[]",
    pageSize: pageSize,
  });
  var articles = newsResult.articles;
  var loading = newsResult.loading;
  var error = newsResult.error;
  var hasMore = newsResult.hasMore;
  var loadMore = newsResult.loadMore;

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
    if (showWizardOnInit && (!sourcesJson || sourcesJson === "[]")) {
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
    filteredArticles.forEach(function (a) {
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

  // Loading state
  if (loading && filteredArticles.length === 0) {
    return React.createElement(
      "div",
      { className: styles.newsContainer, role: "region", "aria-label": title || "News" },
      title
        ? React.createElement("h2", { className: styles.newsTitle }, title)
        : undefined,
      React.createElement(HyperSkeleton, { count: 3, height: 200, variant: "rectangular" }),
      // Always render wizard modal
      React.createElement(HyperWizard, {
        config: NEWS_WIZARD_CONFIG,
        isOpen: isWizardOpen,
        onClose: closeWizard,
        onApply: handleWizardApply,
        initialStateOverride: wizardStateOverride,
      })
    );
  }

  // Error state
  if (error) {
    return React.createElement(
      "div",
      { className: styles.newsContainer, role: "region", "aria-label": title || "News" },
      title
        ? React.createElement("h2", { className: styles.newsTitle }, title)
        : undefined,
      React.createElement(HyperEmptyState, {
        title: "Failed to load news",
        description: error.message,
      }),
      React.createElement(HyperWizard, {
        config: NEWS_WIZARD_CONFIG,
        isOpen: isWizardOpen,
        onClose: closeWizard,
        onApply: handleWizardApply,
        initialStateOverride: wizardStateOverride,
      })
    );
  }

  // Empty state
  if (filteredArticles.length === 0) {
    return React.createElement(
      "div",
      { className: styles.newsContainer, role: "region", "aria-label": title || "News" },
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
      React.createElement(HyperWizard, {
        config: NEWS_WIZARD_CONFIG,
        isOpen: isWizardOpen,
        onClose: closeWizard,
        onApply: handleWizardApply,
        initialStateOverride: wizardStateOverride,
      })
    );
  }

  // Select layout component based on layoutType
  var layoutProps = { articles: filteredArticles, onCardClick: handleCardClick };
  var layoutElement: React.ReactElement;

  if (layoutType === "list") {
    layoutElement = React.createElement(ListLayout, layoutProps);
  } else if (layoutType === "magazine") {
    layoutElement = React.createElement(MagazineLayout, layoutProps);
  } else if (layoutType === "newspaper") {
    layoutElement = React.createElement(NewspaperLayout, layoutProps);
  } else if (layoutType === "timeline") {
    layoutElement = React.createElement(TimelineLayout, layoutProps);
  } else if (layoutType === "carousel") {
    layoutElement = React.createElement(CarouselLayout, layoutProps);
  } else if (layoutType === "heroGrid") {
    layoutElement = React.createElement(HeroGridLayout, layoutProps);
  } else if (layoutType === "compact") {
    layoutElement = React.createElement(CompactLayout, layoutProps);
  } else if (layoutType === "filmstrip") {
    layoutElement = React.createElement(FilmstripLayout, layoutProps);
  } else if (layoutType === "mosaic") {
    layoutElement = React.createElement(MosaicLayout, layoutProps);
  } else if (layoutType === "sideBySide") {
    layoutElement = React.createElement(SideBySideLayout, layoutProps);
  } else if (layoutType === "tiles") {
    layoutElement = React.createElement(TilesLayout, layoutProps);
  } else {
    layoutElement = React.createElement(CardGridLayout, layoutProps);
  }

  return React.createElement(
    "div",
    { className: styles.newsContainer, role: "region", "aria-label": title || "News" },
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
    React.createElement(HyperWizard, {
      config: NEWS_WIZARD_CONFIG,
      isOpen: isWizardOpen,
      onClose: closeWizard,
      onApply: handleWizardApply,
    })
  );
};

var HyperNews: React.FC<IHyperNewsComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperNewsInner, props)
  );
};

export default HyperNews;
