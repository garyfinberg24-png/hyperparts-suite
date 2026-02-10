import * as React from "react";
import type { IFaqLayoutProps } from "./IFaqLayoutProps";
import HyperFaqExpandedAnswer from "../HyperFaqExpandedAnswer";
import styles from "./CompactLayout.module.scss";

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

const CompactLayout: React.FC<IFaqLayoutProps> = function (props) {
  const rows: React.ReactNode[] = [];

  props.items.forEach(function (item, idx) {
    const isExpanded = props.expandedItemId === item.id;
    const isAlt = idx % 2 === 1;
    const iconName = getCategoryIcon(item.category);

    const chevronClass = isExpanded
      ? styles.compactChevron + " " + styles.compactChevronExpanded
      : styles.compactChevron;

    let rowClass = styles.compactRow;
    if (isAlt) {
      rowClass = rowClass + " " + styles.compactRowAlt;
    }
    if (isExpanded) {
      rowClass = rowClass + " " + styles.compactRowExpanded;
    }

    const expandedContent = isExpanded
      ? React.createElement(
          "div",
          { className: styles.compactExpandedContent },
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

    // Count meta elements
    const metaChildren: React.ReactNode[] = [];

    if (props.showViewCount && item.viewCount > 0) {
      metaChildren.push(
        React.createElement(
          "span",
          { key: "views", className: styles.compactViewCount, title: "Views" },
          React.createElement("i", { className: "ms-Icon ms-Icon--View", "aria-hidden": "true" }),
          " " + String(item.viewCount)
        )
      );
    }

    if (props.enableVoting) {
      metaChildren.push(
        React.createElement(
          "span",
          { key: "votes", className: styles.compactVoteCount, title: "Helpful votes" },
          React.createElement("i", { className: "ms-Icon ms-Icon--Like", "aria-hidden": "true" }),
          " " + String(item.helpfulYes)
        )
      );
    }

    rows.push(
      React.createElement(
        "div",
        {
          key: item.id,
          className: rowClass,
          id: "faq-item-" + String(item.id),
        },
        React.createElement(
          "button",
          {
            className: styles.compactRowButton,
            type: "button",
            onClick: function (): void {
              if (!isExpanded) props.onFirstExpand(item);
              props.onToggleItem(item.id);
            },
            "aria-expanded": isExpanded,
          },
          React.createElement("i", {
            className: "ms-Icon ms-Icon--" + iconName + " " + styles.compactIcon,
            "aria-hidden": "true",
            title: item.category,
          }),
          React.createElement("span", { className: styles.compactQuestion }, item.question),
          metaChildren,
          React.createElement("i", {
            className: "ms-Icon ms-Icon--ChevronRight " + chevronClass,
            "aria-hidden": "true",
          })
        ),
        expandedContent
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.compactLayout, role: "list" },
    rows
  );
};

export default CompactLayout;
