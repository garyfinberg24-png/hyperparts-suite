import * as React from "react";
import { useMemo } from "react";
import type { IHyperNewsWebPartProps, IHyperNewsArticle, LayoutType } from "../models";
import { DEFAULT_FILTER_CONFIG } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton, HyperEditOverlay } from "../../../common/components";
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
import WelcomeStep from "./wizard/WelcomeStep";
import { HyperWizard } from "../../../common/components/wizard/HyperWizard";
import { NEWS_WIZARD_CONFIG, buildStateFromProps } from "./wizard/newsWizardConfig";
import { HyperImageBrowser } from "../../../common/components/imageBrowser/HyperImageBrowser";
import type { IHyperImageBrowserProps } from "../../../common/components/imageBrowser/HyperImageBrowser";
import styles from "./HyperNews.module.scss";

export interface IHyperNewsComponentProps extends IHyperNewsWebPartProps {
  instanceId: string;
  /** Whether the web part is in edit mode (displayMode === 2) */
  isEditMode?: boolean;
  /** Callback when the WelcomeStep splash is completed */
  onWizardComplete?: () => void;
  /** Callback from web part class to persist wizard result */
  onWizardApply?: (result: Partial<IHyperNewsWebPartProps>) => void;
  /** Callback from web part class to trigger wizard open */
  onOpenWizard?: () => void;
  /** Callback when user selects an image from the browser */
  onImageSelect?: (imageUrl: string) => void;
  /** Callback to open the property pane */
  onConfigure?: () => void;
}

/** Select the correct layout component for a given layoutType */
function _renderLayout(
  layoutType: LayoutType,
  articles: IHyperNewsArticle[],
  onCardClick: (article: IHyperNewsArticle) => void
): React.ReactElement {
  const layoutProps = { articles: articles, onCardClick: onCardClick };

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

const HyperNewsInner: React.FC<IHyperNewsComponentProps> = function (props) {
  // ── WelcomeStep splash state ──
  var wizardOpenState = React.useState(false);
  var wizardOpen = wizardOpenState[0];
  var setWizardOpen = wizardOpenState[1];

  var handleWelcomeApply = function (result: Partial<IHyperNewsWebPartProps>): void {
    if (props.onWizardComplete) {
      props.onWizardComplete();
    }
    setWizardOpen(false);
  };

  var handleWelcomeClose = function (): void {
    setWizardOpen(false);
  };

  const title = props.title;
  const sourcesJson = props.sourcesJson;
  const externalArticlesJson = props.externalArticlesJson;
  const manualArticlesJson = props.manualArticlesJson;
  const pageSize = props.pageSize;
  const layoutType = props.layoutType;
  const enableReadTracking = props.enableReadTracking;
  const enableQuickRead = props.enableQuickRead;
  const enableReactions = props.enableReactions;
  const enableInfiniteScroll = props.enableInfiniteScroll;
  const filterConfig = props.filterConfig;
  const reactionListName = props.reactionListName;
  const instanceId = props.instanceId;
  const onWizardApply = props.onWizardApply;

  // ── Demo mode overrides from store ──
  const demoLayout = useHyperNewsStore(function (s) { return s.demoLayout; });
  const demoPageSize = useHyperNewsStore(function (s) { return s.demoPageSize; });
  const demoDisplayToggles = useHyperNewsStore(function (s) { return s.demoDisplayToggles; });

  // Apply demo overrides when enableDemoMode is on
  const effectiveLayout: LayoutType = props.enableDemoMode && demoLayout !== undefined ? demoLayout : layoutType;
  const effectivePageSize: number = props.enableDemoMode && demoPageSize !== undefined ? demoPageSize : pageSize;
  // Display overrides — consumed below as a record for future layout prop forwarding
  const _effectiveDisplay: Record<string, boolean> = {
    showImages: props.enableDemoMode ? demoDisplayToggles.showImages !== false : props.showImages,
    showDescription: props.enableDemoMode ? demoDisplayToggles.showDescription !== false : props.showDescription,
    showAuthor: props.enableDemoMode ? demoDisplayToggles.showAuthor !== false : props.showAuthor,
    showDate: props.enableDemoMode ? demoDisplayToggles.showDate !== false : props.showDate,
    showReadTime: props.enableDemoMode ? demoDisplayToggles.showReadTime !== false : props.showReadTime,
  };
  // Keep reference alive so it's not tree-shaken (will be forwarded to layouts in future)
  const _hasDisplayOverrides = Object.keys(_effectiveDisplay).length > 0;
  void _hasDisplayOverrides;

  // ── Sample data ──
  const sampleArticles = useMemo(function () {
    if (props.useSampleData) {
      return getSampleArticles();
    }
    return [];
  }, [props.useSampleData]);

  const newsResult = useNewsArticles({
    sourcesJson: sourcesJson || "[]",
    externalArticlesJson: externalArticlesJson || "[]",
    manualArticlesJson: manualArticlesJson || "[]",
    pageSize: effectivePageSize,
  });
  const liveArticles = newsResult.articles;
  const loading = newsResult.loading;
  const error = newsResult.error;
  const hasMore = newsResult.hasMore;
  const loadMore = newsResult.loadMore;

  // Merge sample data in front of live articles (sample appears first)
  const articles = useMemo(function (): IHyperNewsArticle[] {
    if (sampleArticles.length > 0) {
      return sampleArticles.concat(liveArticles);
    }
    return liveArticles;
  }, [sampleArticles, liveArticles]);

  const readProgress = useReadingProgress();
  const isRead = readProgress.isRead;
  const markAsRead = readProgress.markAsRead;

  const storeState = useHyperNewsStore();
  const quickReadArticleId = storeState.quickReadArticleId;
  const isQuickReadOpen = storeState.isQuickReadOpen;
  const openQuickRead = storeState.openQuickRead;
  const closeQuickRead = storeState.closeQuickRead;
  const isWizardOpen = storeState.isWizardOpen;
  const openWizard = storeState.openWizard;
  const closeWizard = storeState.closeWizard;

  // Build wizard state override from current props (for re-editing)
  const wizardStateOverride = useMemo(function () {
    return buildStateFromProps(props);
  }, [props.sourcesJson, props.layoutType, props.pageSize, props.showFeatured,
      props.maxFeatured, props.showImages, props.showDescription, props.showAuthor,
      props.showDate, props.showReadTime, props.enableInfiniteScroll, props.enableQuickRead,
      props.enableReactions, props.enableBookmarks, props.enableReadTracking,
      props.enableScheduling, props.filterConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle wizard apply
  const handleWizardApply = React.useCallback(function (result: Partial<IHyperNewsWebPartProps>): void {
    if (onWizardApply) {
      onWizardApply(result);
    }
    closeWizard();
  }, [onWizardApply, closeWizard]);

  // Show setup prompt when wizard not yet completed
  if (!props.wizardCompleted) {
    return React.createElement("div", undefined,
      React.createElement(WelcomeStep, {
        key: "welcome",
        isOpen: wizardOpen,
        onClose: handleWelcomeClose,
        onApply: handleWelcomeApply,
        currentProps: undefined,
      }),
      React.createElement(HyperWizard, {
        key: "wizard",
        config: NEWS_WIZARD_CONFIG,
        isOpen: isWizardOpen,
        onClose: closeWizard,
        onApply: handleWizardApply,
        initialStateOverride: wizardStateOverride,
      }),
      React.createElement(HyperEmptyState, {
        title: "HyperNews",
        description: "Complete the setup wizard to configure this web part.",
        actionLabel: "Complete Setup",
        onAction: function () { setWizardOpen(true); },
      })
    );
  }

  // Enrich articles with "isNew" flag based on reading progress
  const enrichedArticles = useMemo(function (): IHyperNewsArticle[] {
    if (!enableReadTracking) return articles;
    const result: IHyperNewsArticle[] = [];
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

  // Apply client-side filters — ensure filterConfig has required sub-properties
  const effectiveFilterConfig = filterConfig && filterConfig.categories && filterConfig.authors
    ? filterConfig
    : DEFAULT_FILTER_CONFIG;
  const filterResult = useNewsFilters({
    articles: enrichedArticles,
    filterConfig: effectiveFilterConfig,
  });
  const filteredArticles = filterResult.filteredArticles;
  const activeFilterCount = filterResult.activeFilterCount;

  // Slice to effective page size
  const displayArticles = useMemo(function (): IHyperNewsArticle[] {
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
  let quickReadArticle: IHyperNewsArticle | undefined;
  if (quickReadArticleId) {
    displayArticles.forEach(function (a) {
      if (a.Id === quickReadArticleId) {
        quickReadArticle = a;
      }
    });
  }

  // Clear filters handler
  const handleClearFilters = React.useCallback(function (): void {
    hyperAnalytics.trackInteraction(instanceId, "clearFilters", "");
  }, [instanceId]);

  // Card click handler
  const handleCardClick = React.useCallback(function (article: IHyperNewsArticle): void {
    markAsRead(article.Id);
    hyperAnalytics.trackInteraction(instanceId, "articleClick", article.Title);

    if (enableQuickRead) {
      openQuickRead(article.Id);
    } else if (article.FileRef) {
      window.open(article.FileRef, "_blank");
    }
  }, [instanceId, markAsRead, enableQuickRead, openQuickRead]);

  // Edit-mode toolbar "Configure" button handler
  const handleConfigureClick = React.useCallback(function (): void {
    openWizard();
  }, [openWizard]);

  // ── WelcomeStep splash element (always rendered, controlled by wizardOpen) ──
  var welcomeElement = React.createElement(WelcomeStep, {
    isOpen: wizardOpen,
    onClose: handleWelcomeClose,
    onApply: handleWelcomeApply,
    currentProps: props.wizardCompleted ? props as any : undefined,
  });

  // ── Wizard element (always rendered) ──
  const wizardElement = React.createElement(HyperWizard, {
    config: NEWS_WIZARD_CONFIG,
    isOpen: isWizardOpen,
    onClose: closeWizard,
    onApply: handleWizardApply,
    initialStateOverride: wizardStateOverride,
  });

  // ── Demo bar element ──
  const demoBarElement = props.enableDemoMode
    ? React.createElement(HyperNewsDemoBar, { key: "demobar" })
    : undefined;

  // ── Sample data banner ──
  const sampleBannerElement = props.useSampleData && !props.enableDemoMode
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
      wizardElement,
      welcomeElement
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
      wizardElement,
      welcomeElement
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
      wizardElement,
      welcomeElement
    );
  }

  // ── Render layout ──
  const layoutElement = _renderLayout(effectiveLayout, displayArticles, handleCardClick);

  var mainContent = React.createElement(
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
    wizardElement,
    // WelcomeStep splash modal (always rendered, controlled by wizardOpen)
    welcomeElement
  );

  return React.createElement(HyperEditOverlay, {
    wpName: "HyperNews",
    isVisible: !!props.isEditMode,
    onWizardClick: function () { setWizardOpen(true); },
    onEditClick: function () { if (props.onConfigure) props.onConfigure(); },
  }, mainContent);
};

// ── Wrapper with Image Browser modal ──
const HyperNewsWithBrowser: React.FC<IHyperNewsComponentProps> = function (props) {
  const isBrowserOpen = useHyperNewsStore(function (s) { return s.isBrowserOpen; });
  const closeBrowser = useHyperNewsStore(function (s) { return s.closeBrowser; });

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

const HyperNews: React.FC<IHyperNewsComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperNewsWithBrowser, props)
  );
};

export default HyperNews;
