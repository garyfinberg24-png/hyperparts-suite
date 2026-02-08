import * as React from "react";
import * as strings from "HyperFaqWebPartStrings";
import type { IHyperFaqWebPartProps, IFaqItem, FaqAccordionStyle } from "../models";
import { groupFaqsByCategory } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton } from "../../../common/components";
import { useFaqItems, sortFaqItems } from "../hooks/useFaqItems";
import { useFaqSearch } from "../hooks/useFaqSearch";
import { useFaqVoting } from "../hooks/useFaqVoting";
import { useFaqDeepLink } from "../hooks/useFaqDeepLink";
import { useHyperFaqStore } from "../store/useHyperFaqStore";
import { incrementViewCount } from "../utils/faqUtils";
import { getSP } from "../../../common/services/HyperPnP";
import HyperFaqSearchBar from "./HyperFaqSearchBar";
import HyperFaqCategorySection from "./HyperFaqCategorySection";
import HyperFaqAccordionItem from "./HyperFaqAccordionItem";
import HyperFaqVoting from "./HyperFaqVoting";
import HyperFaqRelated from "./HyperFaqRelated";
import HyperFaqSubmitModal from "./HyperFaqSubmitModal";
import styles from "./HyperFaq.module.scss";

export interface IHyperFaqComponentProps extends IHyperFaqWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
}

// ── Inner component ──

const HyperFaqInner: React.FC<IHyperFaqComponentProps> = function (props) {
  const faqData = useFaqItems({
    listName: props.listName || "",
    maxItems: props.maxItems || 100,
    cacheDuration: props.cacheDuration || 300,
  });

  // Store
  const searchQuery = useHyperFaqStore(function (s) { return s.searchQuery; });
  const setSearchQuery = useHyperFaqStore(function (s) { return s.setSearchQuery; });
  const expandedItemId = useHyperFaqStore(function (s) { return s.expandedItemId; });
  const toggleItem = useHyperFaqStore(function (s) { return s.toggleItem; });
  const expandItem = useHyperFaqStore(function (s) { return s.expandItem; });
  const expandedCategories = useHyperFaqStore(function (s) { return s.expandedCategories; });
  const toggleCategory = useHyperFaqStore(function (s) { return s.toggleCategory; });
  const expandAllCategories = useHyperFaqStore(function (s) { return s.expandAllCategories; });
  const isSubmitModalOpen = useHyperFaqStore(function (s) { return s.isSubmitModalOpen; });
  const openSubmitModal = useHyperFaqStore(function (s) { return s.openSubmitModal; });
  const closeSubmitModal = useHyperFaqStore(function (s) { return s.closeSubmitModal; });

  // Voting
  const voting = useFaqVoting(props.listName || "");

  // Sort
  const sortedItems = React.useMemo(function () {
    return sortFaqItems(faqData.items, props.sortMode || "alphabetical");
  }, [faqData.items, props.sortMode]);

  // Search
  const searchResult = useFaqSearch(
    sortedItems,
    props.enableSearch ? searchQuery : "",
    300
  );

  // Deep linking
  useFaqDeepLink(props.enableDeepLink !== false);

  // Auto-expand all categories on first load
  const hasExpandedRef = React.useRef<boolean>(false);
  React.useEffect(function () {
    if (!hasExpandedRef.current && faqData.items.length > 0 && props.enableCategories) {
      hasExpandedRef.current = true;
      const categoryNames: string[] = [];
      const groups = groupFaqsByCategory(faqData.items);
      groups.forEach(function (g) { categoryNames.push(g.name); });
      expandAllCategories(categoryNames);
    }
  }, [faqData.items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Callbacks
  const handleFirstExpand = React.useCallback(function (item: IFaqItem): void {
    if (props.showViewCount && props.listName) {
      incrementViewCount(getSP(), props.listName, item.id, item.viewCount);
    }
  }, [props.showViewCount, props.listName]);

  const handleRelatedNavigate = React.useCallback(function (itemId: number): void {
    expandItem(itemId);
    // Update URL hash for deep link
    if (props.enableDeepLink !== false) {
      window.location.hash = "#faq=" + String(itemId);
    }
    // Scroll after a short delay
    window.setTimeout(function () {
      const el = document.getElementById("faq-item-" + String(itemId));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
  }, [expandItem, props.enableDeepLink]);

  // ── Loading / Empty ──
  if (faqData.loading) {
    return React.createElement(
      "div",
      { className: styles.faqContainer },
      React.createElement(HyperSkeleton, { count: 5, height: 48 })
    );
  }

  if (faqData.items.length === 0) {
    return React.createElement(HyperEmptyState, {
      iconName: "ChatBot",
      title: strings.NoResultsTitle,
      description: strings.NoResultsDescription,
    });
  }

  // ── Render helpers ──
  const displayItems = searchResult.filteredItems;
  const accordionStyle: FaqAccordionStyle = props.accordionStyle || "clean";

  function renderAccordionItem(item: IFaqItem): React.ReactNode {
    const isExpanded = expandedItemId === item.id;

    const votingElement = props.enableVoting && isExpanded
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

    const relatedElement = props.enableRelated && isExpanded
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
        accordionStyle: accordionStyle,
        showViewCount: props.showViewCount,
        onFirstExpand: handleFirstExpand,
      },
      votingElement,
      relatedElement
    );
  }

  // ── Build FAQ list ──
  let faqListContent: React.ReactNode;

  if (props.enableCategories) {
    // Grouped by category
    const groups = groupFaqsByCategory(displayItems);
    const groupElements: React.ReactNode[] = [];

    groups.forEach(function (group) {
      const isCatExpanded = expandedCategories[group.name] !== false;
      const itemElements: React.ReactNode[] = [];
      group.items.forEach(function (item) {
        itemElements.push(renderAccordionItem(item));
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
          itemElements
        )
      );
    });

    faqListContent = groupElements;
  } else {
    // Flat list
    const itemElements: React.ReactNode[] = [];
    displayItems.forEach(function (item) {
      itemElements.push(renderAccordionItem(item));
    });
    faqListContent = itemElements;
  }

  // ── Search bar ──
  const searchBar = props.enableSearch
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
  const askGuruButton = props.enableSubmission
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

  // ── Submit modal ──
  const submitModal = props.enableSubmission
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

  return React.createElement(
    "div",
    { className: styles.faqContainer },
    React.createElement("h2", { className: styles.faqTitle }, props.title || "FAQ"),
    (searchBar || askGuruButton)
      ? React.createElement(
          "div",
          { className: styles.toolbar },
          searchBar,
          askGuruButton
        )
      : undefined,
    React.createElement(
      "div",
      { className: styles.faqList, role: "list" },
      faqListContent
    ),
    submitModal
  );
};

// ── Wrapper with error boundary ──

const HyperFaq: React.FC<IHyperFaqComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperFaqInner, props)
  );
};

export default HyperFaq;
