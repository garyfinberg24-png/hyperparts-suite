import * as React from "react";
import * as strings from "HyperFaqWebPartStrings";
import type { IHyperFaqWebPartProps, IFaqItem, FaqAccordionStyle, FaqLayout } from "../models";
import { groupFaqsByCategory } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton, HyperEditOverlay } from "../../../common/components";
import { useFaqItems, sortFaqItems } from "../hooks/useFaqItems";
import { useFaqSearch } from "../hooks/useFaqSearch";
import { useFaqVoting } from "../hooks/useFaqVoting";
import { useFaqDeepLink } from "../hooks/useFaqDeepLink";
import { useHyperFaqStore } from "../store/useHyperFaqStore";
import { incrementViewCount } from "../utils/faqUtils";
import { getSampleFaqItems } from "../utils/sampleData";
import { getSP } from "../../../common/services/HyperPnP";
import { getFaqTemplateById } from "../models/IHyperFaqTemplate";
import type { IFaqTemplate } from "../models/IHyperFaqTemplate";
import HyperFaqSearchBar from "./HyperFaqSearchBar";
import HyperFaqCategorySection from "./HyperFaqCategorySection";
import HyperFaqAccordionItem from "./HyperFaqAccordionItem";
import HyperFaqVoting from "./HyperFaqVoting";
import HyperFaqRelated from "./HyperFaqRelated";
import HyperFaqSubmitModal from "./HyperFaqSubmitModal";
import WelcomeStep from "./wizard/WelcomeStep";
import HyperFaqDemoBar from "./HyperFaqDemoBar";
import {
  CardGridLayout,
  MagazineLayout,
  TabsLayout,
  TimelineLayout,
  MasonryLayout,
  CompactLayout,
  KnowledgeBaseLayout,
} from "./layouts";
import type { IFaqLayoutProps } from "./layouts";
import styles from "./HyperFaq.module.scss";

export interface IHyperFaqComponentProps extends IHyperFaqWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  onConfigure?: () => void;
  onWizardApply?: (result: Partial<IHyperFaqWebPartProps>) => void;
}

// ── Inner component ──

var HyperFaqInner: React.FC<IHyperFaqComponentProps> = function (props) {
  // Store
  var searchQuery = useHyperFaqStore(function (s) { return s.searchQuery; });
  var setSearchQuery = useHyperFaqStore(function (s) { return s.setSearchQuery; });
  var expandedItemId = useHyperFaqStore(function (s) { return s.expandedItemId; });
  var toggleItem = useHyperFaqStore(function (s) { return s.toggleItem; });
  var expandItem = useHyperFaqStore(function (s) { return s.expandItem; });
  var expandedCategories = useHyperFaqStore(function (s) { return s.expandedCategories; });
  var toggleCategory = useHyperFaqStore(function (s) { return s.toggleCategory; });
  var expandAllCategories = useHyperFaqStore(function (s) { return s.expandAllCategories; });
  var isSubmitModalOpen = useHyperFaqStore(function (s) { return s.isSubmitModalOpen; });
  var openSubmitModal = useHyperFaqStore(function (s) { return s.openSubmitModal; });
  var closeSubmitModal = useHyperFaqStore(function (s) { return s.closeSubmitModal; });
  var runtimeLayout = useHyperFaqStore(function (s) { return s.runtimeLayout; });
  var setRuntimeLayout = useHyperFaqStore(function (s) { return s.setRuntimeLayout; });
  var runtimeAccordionStyle = useHyperFaqStore(function (s) { return s.runtimeAccordionStyle; });
  var setRuntimeAccordionStyle = useHyperFaqStore(function (s) { return s.setRuntimeAccordionStyle; });
  var runtimeTemplate = useHyperFaqStore(function (s) { return s.runtimeTemplate; });
  var setRuntimeTemplate = useHyperFaqStore(function (s) { return s.setRuntimeTemplate; });
  var isDemoMode = useHyperFaqStore(function (s) { return s.isDemoMode; });
  var setDemoMode = useHyperFaqStore(function (s) { return s.setDemoMode; });
  var wizardOpen = useHyperFaqStore(function (s) { return s.wizardOpen; });
  var setWizardOpen = useHyperFaqStore(function (s) { return s.setWizardOpen; });
  var activeCategory = useHyperFaqStore(function (s) { return s.activeCategory; });
  var setActiveCategory = useHyperFaqStore(function (s) { return s.setActiveCategory; });

  // Determine if we use sample data
  var usingSampleData = props.useSampleData || isDemoMode || !props.listName;

  // Fetch real data
  var faqData = useFaqItems({
    listName: usingSampleData ? "" : (props.listName || ""),
    maxItems: props.maxItems || 100,
    cacheDuration: props.cacheDuration || 300,
  });

  // Merge: sample data or real data
  var rawItems = React.useMemo(function (): IFaqItem[] {
    if (usingSampleData) {
      return getSampleFaqItems();
    }
    return faqData.items;
  }, [usingSampleData, faqData.items]);

  // Demo bar visible when: explicitly toggled, or published + sample data
  var demoBarActive = isDemoMode || (!!props.useSampleData && !props.isEditMode);

  // Active layout: runtime (demo bar) overrides props when demo bar is active
  var activeLayout: FaqLayout = demoBarActive ? runtimeLayout : (props.layout || "accordion");
  var activeAccordionStyle: FaqAccordionStyle = demoBarActive ? runtimeAccordionStyle : (props.accordionStyle || "clean");

  // Active template: runtime overrides props when demo bar is active
  var activeTemplateId = demoBarActive ? runtimeTemplate : (props.selectedTemplate || "corporate-clean");

  // Resolve template colors and build CSS custom properties
  var activeTemplate: IFaqTemplate | undefined = getFaqTemplateById(activeTemplateId);
  var templateStyle = React.useMemo(function (): Record<string, string> {
    if (!activeTemplate) return {};
    var c = activeTemplate.colors;
    var s: Record<string, string> = {};
    s["--faq-primary"] = c.primary;
    s["--faq-secondary"] = c.secondary;
    s["--faq-accent"] = c.accent;
    s["--faq-background"] = c.background;
    s["--faq-surface"] = c.surface;
    s["--faq-text"] = c.text;
    s["--faq-text-secondary"] = c.textSecondary;
    s["--faq-border"] = c.border;
    s["--faq-border-radius"] = String(activeTemplate.borderRadius) + "px";
    s["--faq-font-family"] = activeTemplate.fontFamily;
    s["--faq-card-shadow"] = activeTemplate.cardShadow;
    return s;
  }, [activeTemplate]);

  // Sync runtime state from props on mount
  React.useEffect(function () {
    if (props.layout) {
      setRuntimeLayout(props.layout);
    }
    if (props.accordionStyle) {
      setRuntimeAccordionStyle(props.accordionStyle);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Show wizard on init
  React.useEffect(function () {
    if (props.isEditMode && props.showWizardOnInit && !props.wizardCompleted) {
      setWizardOpen(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Voting
  var voting = useFaqVoting(props.listName || "");

  // Sort
  var sortedItems = React.useMemo(function () {
    return sortFaqItems(rawItems, props.sortMode || "alphabetical");
  }, [rawItems, props.sortMode]);

  // Search
  var searchResult = useFaqSearch(
    sortedItems,
    props.enableSearch ? searchQuery : "",
    300
  );

  // Deep linking
  useFaqDeepLink(props.enableDeepLink !== false);

  // Auto-expand all categories on first load
  var hasExpandedRef = React.useRef<boolean>(false);
  React.useEffect(function () {
    if (!hasExpandedRef.current && rawItems.length > 0 && props.enableCategories) {
      hasExpandedRef.current = true;
      var categoryNames: string[] = [];
      var groups = groupFaqsByCategory(rawItems);
      groups.forEach(function (g) { categoryNames.push(g.name); });
      expandAllCategories(categoryNames);
      // Set initial active category for tabs/KB
      if (categoryNames.length > 0 && activeCategory.length === 0) {
        setActiveCategory(categoryNames[0]);
      }
    }
  }, [rawItems.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Callbacks
  var handleFirstExpand = React.useCallback(function (item: IFaqItem): void {
    if (props.showViewCount && props.listName && !usingSampleData) {
      incrementViewCount(getSP(), props.listName, item.id, item.viewCount);
    }
  }, [props.showViewCount, props.listName, usingSampleData]);

  var handleRelatedNavigate = React.useCallback(function (itemId: number): void {
    expandItem(itemId);
    if (props.enableDeepLink !== false) {
      window.location.hash = "#faq=" + String(itemId);
    }
    window.setTimeout(function () {
      var el = document.getElementById("faq-item-" + String(itemId));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
  }, [expandItem, props.enableDeepLink]);

  var handleWizardApply = React.useCallback(function (result: Partial<IHyperFaqWebPartProps>): void {
    setWizardOpen(false);
    if (props.onWizardApply) {
      props.onWizardApply(result);
    }
  }, [props.onWizardApply, setWizardOpen]);

  var handleWizardClose = React.useCallback(function (): void {
    setWizardOpen(false);
  }, [setWizardOpen]);

  // ── Loading / Empty ──
  if (!usingSampleData && faqData.loading) {
    return React.createElement(
      "div",
      { className: styles.faqContainer },
      React.createElement(HyperSkeleton, { count: 5, height: 48 })
    );
  }

  if (rawItems.length === 0) {
    return React.createElement(HyperEmptyState, {
      iconName: "ChatBot",
      title: strings.NoResultsTitle,
      description: strings.NoResultsDescription,
    });
  }

  // ── Render helpers ──
  var displayItems = searchResult.filteredItems;

  function renderAccordionItem(item: IFaqItem): React.ReactNode {
    var isExpanded = expandedItemId === item.id;

    var votingElement = props.enableVoting && isExpanded
      ? React.createElement(HyperFaqVoting, {
          item: item,
          hasVoted: voting.hasVoted(item.id),
          voteDirection: voting.getVoteDirection(item.id),
          onVote: voting.vote,
          helpfulLabel: strings.HelpfulLabel,
          yesLabel: strings.YesLabel,
          noLabel: strings.NoLabel,
        })
      : undefined;

    var relatedElement = props.enableRelated && isExpanded
      ? React.createElement(HyperFaqRelated, {
          item: item,
          allItems: sortedItems,
          onNavigate: handleRelatedNavigate,
          relatedLabel: strings.RelatedLabel,
        })
      : undefined;

    return React.createElement(
      HyperFaqAccordionItem,
      {
        key: item.id,
        item: item,
        isExpanded: isExpanded,
        onToggle: function (): void { toggleItem(item.id); },
        accordionStyle: activeAccordionStyle,
        showViewCount: props.showViewCount,
        onFirstExpand: handleFirstExpand,
      },
      votingElement,
      relatedElement
    );
  }

  // ── Build FAQ list content based on active layout ──
  var faqListContent: React.ReactNode;

  if (activeLayout === "accordion") {
    // Original accordion mode (default)
    if (props.enableCategories) {
      var groups = groupFaqsByCategory(displayItems);
      var groupElements: React.ReactNode[] = [];

      groups.forEach(function (group) {
        var isCatExpanded = expandedCategories[group.name] !== false;
        var catItemElements: React.ReactNode[] = [];
        group.items.forEach(function (item) {
          catItemElements.push(renderAccordionItem(item));
        });

        groupElements.push(
          React.createElement(
            HyperFaqCategorySection,
            {
              key: group.name,
              name: group.name,
              itemCount: group.items.length,
              isExpanded: isCatExpanded,
              onToggle: function (): void { toggleCategory(group.name); },
            },
            catItemElements
          )
        );
      });

      faqListContent = groupElements;
    } else {
      var flatElements: React.ReactNode[] = [];
      displayItems.forEach(function (item) {
        flatElements.push(renderAccordionItem(item));
      });
      faqListContent = flatElements;
    }
  } else {
    // ── Delegate to standalone layout components ──
    var layoutProps: IFaqLayoutProps = {
      items: displayItems,
      allItems: sortedItems,
      expandedItemId: expandedItemId,
      onToggleItem: toggleItem,
      accordionStyle: activeAccordionStyle,
      enableVoting: props.enableVoting,
      enableRelated: props.enableRelated,
      showViewCount: props.showViewCount,
      enableCopyLink: props.enableCopyLink !== false,
      enableContactExpert: props.enableContactExpert,
      enableFeedbackOnDownvote: props.enableFeedbackOnDownvote,
      enableCategories: props.enableCategories,
      expandedCategories: expandedCategories,
      onToggleCategory: toggleCategory,
      votingHook: {
        vote: voting.vote,
        hasVoted: voting.hasVoted,
        getVoteDirection: voting.getVoteDirection,
      },
      onRelatedNavigate: handleRelatedNavigate,
      onFirstExpand: handleFirstExpand,
    };

    if (activeLayout === "tabs") {
      faqListContent = React.createElement(TabsLayout, layoutProps);
    } else if (activeLayout === "cardGrid") {
      faqListContent = React.createElement(CardGridLayout, layoutProps);
    } else if (activeLayout === "compact") {
      faqListContent = React.createElement(CompactLayout, layoutProps);
    } else if (activeLayout === "timeline") {
      faqListContent = React.createElement(TimelineLayout, layoutProps);
    } else if (activeLayout === "masonry") {
      faqListContent = React.createElement(MasonryLayout, layoutProps);
    } else if (activeLayout === "magazine") {
      faqListContent = React.createElement(MagazineLayout, layoutProps);
    } else if (activeLayout === "knowledgeBase") {
      faqListContent = React.createElement(KnowledgeBaseLayout, layoutProps);
    } else {
      // Fallback to accordion
      var fallbackItems: React.ReactNode[] = [];
      displayItems.forEach(function (item) {
        fallbackItems.push(renderAccordionItem(item));
      });
      faqListContent = fallbackItems;
    }
  }

  // ── Search bar ──
  var searchBar = props.enableSearch
    ? React.createElement(
        "div",
        { className: styles.toolbarLeft },
        React.createElement(HyperFaqSearchBar, {
          query: searchQuery,
          onQueryChange: setSearchQuery,
          resultCount: searchResult.resultCount,
          totalCount: sortedItems.length,
          placeholder: strings.SearchPlaceholder,
        })
      )
    : undefined;

  // ── Ask Guru button ──
  var askGuruButton = props.enableSubmission
    ? React.createElement(
        "button",
        {
          className: styles.askGuruButton,
          onClick: openSubmitModal,
          type: "button",
        },
        React.createElement("i", {
          className: "ms-Icon ms-Icon--ChatBot",
          "aria-hidden": "true",
        }),
        strings.AskGuruButton
      )
    : undefined;

  // ── Expand All button ──
  var expandAllButton = props.enableExpandAll && activeLayout === "accordion"
    ? React.createElement("button", {
        className: styles.expandAllBtn,
        onClick: function () {
          var allCats: string[] = [];
          groupFaqsByCategory(rawItems).forEach(function (g) { allCats.push(g.name); });
          expandAllCategories(allCats);
        },
        type: "button",
      }, "Expand All")
    : undefined;

  // ── Demo mode: auto-show when published with sample data ──
  var showDemoBar = demoBarActive;

  // ── Demo mode toggle (only show when sample data but NOT already in auto-demo) ──
  var demoToggle = props.useSampleData && props.isEditMode
    ? React.createElement("button", {
        className: isDemoMode ? styles.demoToggleActive : styles.demoToggle,
        onClick: function () { setDemoMode(!isDemoMode); },
        type: "button",
      }, isDemoMode ? "Exit Demo" : "Demo Mode")
    : undefined;

  // ── Demo bar (rendered ABOVE web part content when active) ──
  var demoBar = showDemoBar
    ? React.createElement(HyperFaqDemoBar, {
        currentLayout: runtimeLayout,
        currentTemplate: runtimeTemplate,
        currentAccordionStyle: runtimeAccordionStyle,
        itemCount: displayItems.length,
        onLayoutChange: setRuntimeLayout,
        onTemplateChange: setRuntimeTemplate,
        onAccordionStyleChange: setRuntimeAccordionStyle,
        onExitDemo: function (): void { setDemoMode(false); },
      })
    : undefined;

  // ── Submit modal ──
  var submitModal = props.enableSubmission
    ? React.createElement(HyperFaqSubmitModal, {
        isOpen: isSubmitModalOpen,
        onClose: closeSubmitModal,
        reviewQueueListName: props.reviewQueueListName || "",
        modalTitle: strings.SubmitModalTitle,
        submitPlaceholder: strings.SubmitPlaceholder,
        submitButtonLabel: strings.SubmitButton,
        cancelButtonLabel: strings.CancelButton,
        successMessage: strings.SubmitSuccess,
        errorMessage: strings.SubmitError,
      })
    : undefined;

  // ── Edit bar ──
  var editBar = props.isEditMode
    ? React.createElement("div", { className: styles.editBar },
        React.createElement("div", { className: styles.editBarLeft },
          React.createElement("span", { className: styles.editBarIcon }, "\uD83D\uDCDA"),
          React.createElement("div", undefined,
            React.createElement("div", { className: styles.editBarTitle }, "HyperFAQ"),
            React.createElement("div", { className: styles.editBarSub },
              props.wizardCompleted
                ? "Knowledge Hub active \u2022 " + (props.layout || "accordion") + " layout"
                : "Run the setup wizard to get started"
            )
          )
        ),
        React.createElement("div", { className: styles.editBarActions },
          props.wizardCompleted
            ? React.createElement("div", { className: styles.activeIndicator },
                React.createElement("span", { className: styles.statusDot }),
                "Active"
              )
            : undefined,
          React.createElement("button", {
            className: props.wizardCompleted ? styles.editBarBtnSecondary : styles.editBarBtn,
            onClick: function () { setWizardOpen(true); },
            type: "button",
          }, props.wizardCompleted ? "\u2728 Re-run Wizard" : "\u2728 Run Setup Wizard")
        )
      )
    : undefined;

  // ── Wizard modal ──
  var wizardModal = wizardOpen
    ? React.createElement(WelcomeStep, {
        key: "wizard",
        isOpen: wizardOpen,
        onClose: handleWizardClose,
        onApply: handleWizardApply,
        currentProps: props.wizardCompleted ? props : undefined,
      })
    : undefined;

  // ── Sample data banner (hide when demo bar is active) ──
  var sampleBanner = usingSampleData && !demoBarActive
    ? React.createElement("div", { className: styles.sampleBanner },
        React.createElement("i", { className: "ms-Icon ms-Icon--TestBeaker", "aria-hidden": "true" }),
        " Using sample data. Connect a SharePoint list in the property pane for live data."
      )
    : undefined;

  // Build themed class — add themed class when template is active
  var containerClass = styles.faqContainer + (activeTemplate ? " " + styles.faqThemed : "");

  var mainContent = React.createElement(
    "div",
    { className: containerClass, style: templateStyle as unknown as React.CSSProperties },
    demoBar,
    editBar,
    wizardModal,
    sampleBanner,
    React.createElement("h2", { className: styles.faqTitle }, props.title || "FAQ"),
    (searchBar || askGuruButton || expandAllButton || demoToggle)
      ? React.createElement(
          "div",
          { className: styles.toolbar },
          searchBar,
          React.createElement("div", { className: styles.toolbarRight },
            expandAllButton,
            demoToggle,
            askGuruButton
          )
        )
      : undefined,
    React.createElement(
      "div",
      { className: styles.faqList, role: "list" },
      faqListContent
    ),
    submitModal
  );

  return React.createElement(HyperEditOverlay, {
    wpName: "HyperFaq",
    isVisible: !!props.isEditMode,
    onWizardClick: function () { setWizardOpen(true); },
    onEditClick: function () { if (props.onConfigure) props.onConfigure(); },
  }, mainContent);
};

// ── Wrapper with error boundary ──

var HyperFaq: React.FC<IHyperFaqComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperFaqInner, props)
  );
};

export default HyperFaq;
