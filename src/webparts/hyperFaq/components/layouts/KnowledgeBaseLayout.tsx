import * as React from "react";
import type { IFaqLayoutProps } from "./IFaqLayoutProps";
import type { IFaqItem } from "../../models/IFaqItem";
import type { IFaqCategoryGroup } from "../../models/IFaqCategory";
import { groupFaqsByCategory } from "../../models/IFaqCategory";
import HyperFaqAccordionItem from "../HyperFaqAccordionItem";
import HyperFaqExpandedAnswer from "../HyperFaqExpandedAnswer";
import styles from "./KnowledgeBaseLayout.module.scss";

// Category icon mapping
const CATEGORY_ICONS: Record<string, string> = {
  General: "Info",
  Security: "Shield",
  People: "People",
  Email: "Mail",
  Benefits: "Heart",
  Privacy: "Lock",
  IT: "Settings",
  HR: "People",
  Finance: "Money",
  Legal: "Policy",
};

function getCategoryIcon(categoryName: string): string {
  return CATEGORY_ICONS[categoryName] || "FolderHorizontal";
}

function extractTags(items: IFaqItem[]): Array<{ tag: string; count: number }> {
  const tagMap: Record<string, number> = {};

  items.forEach(function (item) {
    if (item.tags) {
      item.tags.split(",").forEach(function (t) {
        const tag = t.trim();
        if (tag) {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        }
      });
    }
  });

  const result: Array<{ tag: string; count: number }> = [];
  Object.keys(tagMap).forEach(function (tag) {
    result.push({ tag: tag, count: tagMap[tag] });
  });

  result.sort(function (a, b) { return b.count - a.count; });
  return result.slice(0, 15);
}

const KnowledgeBaseLayout: React.FC<IFaqLayoutProps> = function (props) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");

  const groups = React.useMemo(function () {
    return groupFaqsByCategory(props.items);
  }, [props.items]);

  const tags = React.useMemo(function () {
    return extractTags(props.allItems);
  }, [props.allItems]);

  // Display items filtered by selected category
  const displayItems = React.useMemo(function () {
    if (!selectedCategory) return props.items;
    const filtered: IFaqItem[] = [];
    props.items.forEach(function (item) {
      if (item.category === selectedCategory) {
        filtered.push(item);
      }
    });
    return filtered;
  }, [props.items, selectedCategory]);

  const handleCategoryClick = React.useCallback(function (catName: string): void {
    setSelectedCategory(function (prev) {
      return prev === catName ? "" : catName;
    });
  }, []);

  // -- Left sidebar: category tree
  const sidebarItems: React.ReactNode[] = [];
  groups.forEach(function (group: IFaqCategoryGroup) {
    const isActive = selectedCategory === group.name;
    const iconName = getCategoryIcon(group.name);
    const itemClass = isActive
      ? styles.kbSidebarItem + " " + styles.kbSidebarItemActive
      : styles.kbSidebarItem;

    sidebarItems.push(
      React.createElement(
        "button",
        {
          key: group.name,
          className: itemClass,
          type: "button",
          onClick: function (): void { handleCategoryClick(group.name); },
          "aria-current": isActive ? "true" : undefined,
        },
        React.createElement("i", {
          className: "ms-Icon ms-Icon--" + iconName + " " + styles.kbSidebarIcon,
          "aria-hidden": "true",
        }),
        React.createElement("span", { className: styles.kbSidebarName }, group.name),
        React.createElement("span", { className: styles.kbSidebarCount }, String(group.items.length))
      )
    );
  });

  const leftSidebar = React.createElement(
    "nav",
    { className: styles.kbSidebar, "aria-label": "FAQ categories" },
    React.createElement("h3", { className: styles.kbSidebarTitle }, "Categories"),
    sidebarItems
  );

  // -- Breadcrumb
  const breadcrumbParts: React.ReactNode[] = [];
  breadcrumbParts.push(
    React.createElement(
      "button",
      {
        key: "root",
        className: styles.kbBreadcrumbLink,
        type: "button",
        onClick: function (): void { setSelectedCategory(""); },
      },
      "FAQ"
    )
  );
  if (selectedCategory) {
    breadcrumbParts.push(
      React.createElement("span", { key: "sep", className: styles.kbBreadcrumbSep }, " > ")
    );
    breadcrumbParts.push(
      React.createElement("span", { key: "cat", className: styles.kbBreadcrumbCurrent }, selectedCategory)
    );
  }

  // -- Main content: accordion items
  const accordionItems: React.ReactNode[] = [];
  displayItems.forEach(function (item) {
    const isExpanded = props.expandedItemId === item.id;

    const expandedContent = isExpanded
      ? React.createElement(HyperFaqExpandedAnswer, {
          item: item,
          allItems: props.allItems,
          enableVoting: props.enableVoting,
          enableRelated: props.enableRelated,
          enableCopyLink: props.enableCopyLink,
          enableContactExpert: props.enableContactExpert,
          enableFeedbackOnDownvote: props.enableFeedbackOnDownvote,
          votingHook: props.votingHook,
          onRelatedNavigate: props.onRelatedNavigate,
        })
      : undefined;

    accordionItems.push(
      React.createElement(
        HyperFaqAccordionItem,
        {
          key: item.id,
          item: item,
          isExpanded: isExpanded,
          onToggle: function (): void {
            if (!isExpanded) props.onFirstExpand(item);
            props.onToggleItem(item.id);
          },
          accordionStyle: props.accordionStyle,
          showViewCount: props.showViewCount,
        },
        expandedContent
      )
    );
  });

  const mainContent = React.createElement(
    "main",
    { className: styles.kbMain },
    React.createElement("nav", { className: styles.kbBreadcrumb, "aria-label": "Breadcrumb" }, breadcrumbParts),
    React.createElement(
      "div",
      { className: styles.kbItemCount },
      String(displayItems.length) + " question" + (displayItems.length !== 1 ? "s" : "")
    ),
    accordionItems.length > 0
      ? accordionItems
      : React.createElement(
          "div",
          { className: styles.kbEmpty },
          "No questions found in this category."
        )
  );

  // -- Right sidebar: support + submit + tags
  const supportCard = React.createElement(
    "div",
    { className: styles.kbSupportCard },
    React.createElement("i", {
      className: "ms-Icon ms-Icon--Headset " + styles.kbSupportIcon,
      "aria-hidden": "true",
    }),
    React.createElement("h4", { className: styles.kbSupportTitle }, "Contact Support"),
    React.createElement("p", { className: styles.kbSupportText }, "Can't find what you need? Our support team is here to help."),
    React.createElement(
      "button",
      {
        className: styles.kbSupportButton,
        type: "button",
        onClick: function (): void {
          window.open("mailto:support@company.com?subject=FAQ%20Support%20Request", "_blank");
        },
      },
      "Get Help"
    )
  );

  const submitCard = React.createElement(
    "div",
    { className: styles.kbSubmitCard },
    React.createElement("i", {
      className: "ms-Icon ms-Icon--ChatBot " + styles.kbSubmitIcon,
      "aria-hidden": "true",
    }),
    React.createElement("h4", { className: styles.kbSubmitTitle }, "Submit a Question"),
    React.createElement("p", { className: styles.kbSubmitText }, "Have a question not covered here? Submit it for review."),
    React.createElement(
      "button",
      {
        className: styles.kbSubmitButton,
        type: "button",
        onClick: function (): void {
          // Could trigger the submit modal; for now, scroll to top
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
      "Ask a Question"
    )
  );

  // Tag cloud
  const tagElements: React.ReactNode[] = [];
  tags.forEach(function (tagItem) {
    tagElements.push(
      React.createElement(
        "span",
        {
          key: tagItem.tag,
          className: styles.kbTag,
          title: String(tagItem.count) + " questions",
        },
        tagItem.tag
      )
    );
  });

  const tagCloud = tags.length > 0
    ? React.createElement(
        "div",
        { className: styles.kbTagCloud },
        React.createElement("h4", { className: styles.kbTagCloudTitle }, "Popular Tags"),
        React.createElement("div", { className: styles.kbTagList }, tagElements)
      )
    : undefined;

  const rightSidebar = React.createElement(
    "aside",
    { className: styles.kbRightSidebar, role: "complementary", "aria-label": "Help resources" },
    supportCard,
    submitCard,
    tagCloud
  );

  return React.createElement(
    "div",
    { className: styles.kbLayout },
    leftSidebar,
    mainContent,
    rightSidebar
  );
};

export default KnowledgeBaseLayout;
