import * as React from "react";
import type { IFaqLayoutProps } from "./IFaqLayoutProps";
import HyperFaqExpandedAnswer from "../HyperFaqExpandedAnswer";
import styles from "./MasonryLayout.module.scss";

// Category accent colors
const CATEGORY_COLORS: string[] = [
  "#0078d4", "#008272", "#8764b8", "#ca5010",
  "#498205", "#c239b3", "#da3b01", "#0063b1",
  "#7a7574", "#005b70",
];

function getCategoryColorByName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[idx];
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

/**
 * Decide how many lines to show based on position.
 * Creates visual variety by alternating between short and longer previews.
 */
function getPreviewLength(idx: number): number {
  // Pattern: 140, 220, 100, 180, 160 repeating
  const lengths = [140, 220, 100, 180, 160];
  return lengths[idx % lengths.length];
}

const MasonryLayout: React.FC<IFaqLayoutProps> = function (props) {
  const cards: React.ReactNode[] = [];

  props.items.forEach(function (item, idx) {
    const isExpanded = props.expandedItemId === item.id;
    const preview = stripHtmlTags(item.answer);
    const maxLen = getPreviewLength(idx);
    const truncated = preview.length > maxLen ? preview.substring(0, maxLen) + "..." : preview;
    const accentColor = getCategoryColorByName(item.category);

    const cardClass = isExpanded
      ? styles.masonryCard + " " + styles.masonryCardExpanded
      : styles.masonryCard;

    const expandedContent = isExpanded
      ? React.createElement(
          "div",
          { className: styles.expandedWrapper },
          React.createElement(HyperFaqExpandedAnswer, {
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
        )
      : undefined;

    const metaChildren: React.ReactNode[] = [];
    if (props.showViewCount && item.viewCount > 0) {
      metaChildren.push(
        React.createElement(
          "span",
          { key: "views", className: styles.masonryViews },
          React.createElement("i", { className: "ms-Icon ms-Icon--View", "aria-hidden": "true" }),
          " " + String(item.viewCount)
        )
      );
    }
    if (props.enableVoting) {
      metaChildren.push(
        React.createElement(
          "span",
          { key: "votes", className: styles.masonryVotes },
          React.createElement("i", { className: "ms-Icon ms-Icon--Like", "aria-hidden": "true" }),
          " " + String(item.helpfulYes)
        )
      );
    }

    cards.push(
      React.createElement(
        "div",
        {
          key: item.id,
          className: cardClass,
          id: "faq-item-" + String(item.id),
          style: { borderLeftColor: accentColor },
        },
        React.createElement(
          "button",
          {
            className: styles.masonryCardButton,
            type: "button",
            onClick: function (): void {
              if (!isExpanded) props.onFirstExpand(item);
              props.onToggleItem(item.id);
            },
            "aria-expanded": isExpanded,
          },
          React.createElement("h3", { className: styles.masonryQuestion }, item.question),
          React.createElement(
            "span",
            {
              className: styles.masonryBadge,
              style: { backgroundColor: accentColor + "18", color: accentColor, borderColor: accentColor + "40" },
            },
            item.category
          ),
          !isExpanded
            ? React.createElement("p", { className: styles.masonryPreview }, truncated)
            : undefined,
          metaChildren.length > 0
            ? React.createElement("div", { className: styles.masonryMeta }, metaChildren)
            : undefined
        ),
        expandedContent
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.masonryLayout },
    cards
  );
};

export default MasonryLayout;
