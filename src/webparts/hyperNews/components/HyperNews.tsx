import * as React from "react";
import { useMemo } from "react";
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
import styles from "./HyperNews.module.scss";

export interface IHyperNewsComponentProps extends IHyperNewsWebPartProps {
  instanceId: string;
}

const HyperNewsInner: React.FC<IHyperNewsComponentProps> = (props) => {
  const {
    title,
    sources,
    pageSize,
    layoutType,
    enableReadTracking,
    enableQuickRead,
    enableReactions,
    enableInfiniteScroll,
    filterConfig,
    reactionListName,
    instanceId,
  } = props;

  const { articles, loading, error, hasMore, loadMore } = useNewsArticles({ sources, pageSize });
  const { isRead, markAsRead } = useReadingProgress();
  const { quickReadArticleId, isQuickReadOpen, openQuickRead, closeQuickRead } =
    useHyperNewsStore();

  // Enrich articles with "isNew" flag based on reading progress
  const enrichedArticles = useMemo((): IHyperNewsArticle[] => {
    if (!enableReadTracking) return articles;
    return articles.map((article) => ({
      ...article,
      isNew: !isRead(article.Id),
    }));
  }, [articles, enableReadTracking, isRead]);

  // Apply client-side filters
  const effectiveFilterConfig = filterConfig || DEFAULT_FILTER_CONFIG;
  const { filteredArticles, activeFilterCount } = useNewsFilters({
    articles: enrichedArticles,
    filterConfig: effectiveFilterConfig,
  });

  // Infinite scroll
  useInfiniteScroll({
    enabled: enableInfiniteScroll,
    hasMore: hasMore,
    loading: loading,
    loadMore: loadMore,
  });

  // Find the article for the quick read modal
  let quickReadArticle: IHyperNewsArticle | undefined;
  if (quickReadArticleId) {
    filteredArticles.forEach((a) => {
      if (a.Id === quickReadArticleId) {
        quickReadArticle = a;
      }
    });
  }

  // Clear filters handler (resets to "all" with no categories/authors)
  const handleClearFilters = React.useCallback((): void => {
    // Filter config is managed by property pane — this is a no-op for now.
    // Future: interactive filter bar will update local state.
    hyperAnalytics.trackInteraction(instanceId, "clearFilters", "");
  }, [instanceId]);

  // Card click handler
  const handleCardClick = React.useCallback(
    (article: IHyperNewsArticle): void => {
      markAsRead(article.Id);
      hyperAnalytics.trackInteraction(instanceId, "articleClick", article.Title);

      if (enableQuickRead) {
        openQuickRead(article.Id);
      } else if (article.FileRef) {
        window.open(article.FileRef, "_blank");
      }
    },
    [instanceId, markAsRead, enableQuickRead, openQuickRead]
  );

  // Loading state
  if (loading && filteredArticles.length === 0) {
    return React.createElement(
      "div",
      { className: styles.newsContainer, role: "region", "aria-label": title || "News" },
      title
        ? React.createElement("h2", { className: styles.newsTitle }, title)
        : undefined,
      React.createElement(HyperSkeleton, { count: 3, height: 200, variant: "rectangular" })
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
            description: "Check your news sources configuration in the property pane.",
          })
    );
  }

  // Select layout component based on layoutType
  const layoutProps = { articles: filteredArticles, onCardClick: handleCardClick };
  let layoutElement: React.ReactElement;

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
    // Default: cardGrid
    layoutElement = React.createElement(CardGridLayout, layoutProps);
  }

  return React.createElement(
    "div",
    { className: styles.newsContainer, role: "region", "aria-label": title || "News" },
    title
      ? React.createElement("h2", { className: styles.newsTitle }, title)
      : undefined,
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
    // Quick read modal (renders nothing when closed)
    React.createElement(HyperNewsQuickReadModal, {
      article: quickReadArticle,
      isOpen: isQuickReadOpen,
      onClose: closeQuickRead,
      reactionListName: reactionListName,
      enableReactions: enableReactions,
    })
  );
};

const HyperNews: React.FC<IHyperNewsComponentProps> = (props) => {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperNewsInner, props)
  );
};

export default HyperNews;
