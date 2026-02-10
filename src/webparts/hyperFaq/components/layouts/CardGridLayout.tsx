import * as React from "react";
import type { IFaqLayoutProps } from "./IFaqLayoutProps";
import type { IFaqItem } from "../../models/IFaqItem";
import { groupFaqsByCategory } from "../../models/IFaqCategory";
import HyperFaqExpandedAnswer from "../HyperFaqExpandedAnswer";
import styles from "./CardGridLayout.module.scss";

// Category accent colors for left border
const CATEGORY_COLORS: string[] = [
  "#0078d4", "#008272", "#8764b8", "#ca5010",
  "#498205", "#c239b3", "#da3b01", "#0063b1",
  "#7a7574", "#005b70",
];

function getCategoryColor(index: number): string {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}

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

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

const CardGridLayout: React.FC<IFaqLayoutProps> = function (props) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");

  const groups = React.useMemo(function () {
    return groupFaqsByCategory(props.items);
  }, [props.items]);

  // Build category index map for colors
  const categoryColorMap = React.useMemo(function () {
    const map: Record<string, string> = {};
    groups.forEach(function (g, idx) {
      map[g.name] = getCategoryColor(idx);
    });
    return map;
  }, [groups]);

  // Filter items by selected category
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

  // -- Category cards row
  const categoryCards: React.ReactNode[] = [];
  groups.forEach(function (group, idx) {
    const isActive = selectedCategory === group.name;
    const color = getCategoryColor(idx);
    const iconName = getCategoryIcon(group.name);
    const cardClass = isActive
      ? styles.categoryCard + " " + styles.categoryCardActive
      : styles.categoryCard;

    categoryCards.push(
      React.createElement(
        "button",
        {
          key: group.name,
          className: cardClass,
          style: { borderLeftColor: color },
          onClick: function (): void { handleCategoryClick(group.name); },
          type: "button",
          "aria-pressed": isActive,
        },
        React.createElement("i", {
          className: "ms-Icon ms-Icon--" + iconName + " " + styles.categoryIcon,
          "aria-hidden": "true",
          style: { color: color },
        }),
        React.createElement("span", { className: styles.categoryName }, group.name),
        React.createElement("span", { className: styles.categoryCount }, String(group.items.length))
      )
    );
  });

  // -- FAQ cards grid
  const faqCards: React.ReactNode[] = [];
  displayItems.forEach(function (item) {
    const isExpanded = props.expandedItemId === item.id;
    const preview = stripHtmlTags(item.answer);
    const truncated = preview.length > 140 ? preview.substring(0, 140) + "..." : preview;
    const accentColor = categoryColorMap[item.category] || "#0078d4";
    const cardClass = isExpanded
      ? styles.faqCard + " " + styles.faqCardExpanded
      : styles.faqCard;

    const metaChildren: React.ReactNode[] = [];
    metaChildren.push(
      React.createElement(
        "span",
        {
          key: "badge",
          className: styles.categoryBadge,
          style: { backgroundColor: accentColor + "18", color: accentColor, borderColor: accentColor + "40" },
        },
        item.category
      )
    );
    if (props.showViewCount && item.viewCount > 0) {
      metaChildren.push(
        React.createElement(
          "span",
          { key: "views", className: styles.faqCardViews },
          React.createElement("i", { className: "ms-Icon ms-Icon--View", "aria-hidden": "true" }),
          " " + String(item.viewCount)
        )
      );
    }
    if (props.enableVoting) {
      metaChildren.push(
        React.createElement(
          "span",
          { key: "votes", className: styles.faqCardVotes },
          React.createElement("i", { className: "ms-Icon ms-Icon--Like", "aria-hidden": "true" }),
          " " + String(item.helpfulYes)
        )
      );
    }

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

    faqCards.push(
      React.createElement(
        "div",
        {
          key: item.id,
          className: cardClass,
          id: "faq-item-" + String(item.id),
          style: { borderTopColor: accentColor },
        },
        React.createElement(
          "button",
          {
            className: styles.faqCardHeader,
            type: "button",
            onClick: function (): void {
              if (!isExpanded) props.onFirstExpand(item);
              props.onToggleItem(item.id);
            },
            "aria-expanded": isExpanded,
          },
          React.createElement("h3", { className: styles.faqCardQuestion }, item.question),
          !isExpanded
            ? React.createElement("p", { className: styles.faqCardPreview }, truncated)
            : undefined,
          React.createElement("div", { className: styles.faqCardMeta }, metaChildren)
        ),
        expandedContent
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.cardGridLayout },
    props.enableCategories && groups.length > 1
      ? React.createElement("div", { className: styles.categoryCardsRow }, categoryCards)
      : undefined,
    React.createElement("div", { className: styles.faqCardsGrid }, faqCards)
  );
};

export default CardGridLayout;
