import * as React from "react";
import type { IFaqLayoutProps } from "./IFaqLayoutProps";
import type { IFaqItem } from "../../models/IFaqItem";
import HyperFaqExpandedAnswer from "../HyperFaqExpandedAnswer";
import styles from "./MagazineLayout.module.scss";

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function formatDate(isoStr: string): string {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[d.getMonth()] + " " + String(d.getDate()) + ", " + String(d.getFullYear());
}

function getPopularItems(items: IFaqItem[], max: number): IFaqItem[] {
  const sorted = items.slice().sort(function (a, b) { return b.viewCount - a.viewCount; });
  return sorted.slice(0, max);
}

function getRecentItems(items: IFaqItem[], max: number): IFaqItem[] {
  const sorted = items.slice().sort(function (a, b) {
    return new Date(b.modified).getTime() - new Date(a.modified).getTime();
  });
  return sorted.slice(0, max);
}

const MagazineLayout: React.FC<IFaqLayoutProps> = function (props) {
  const heroItem = props.items.length > 0 ? props.items[0] : undefined;
  const restItems = props.items.length > 1 ? props.items.slice(1) : [];
  const popularItems = React.useMemo(function () { return getPopularItems(props.allItems, 5); }, [props.allItems]);
  const recentItems = React.useMemo(function () { return getRecentItems(props.allItems, 5); }, [props.allItems]);

  function renderExpandedContent(item: IFaqItem): React.ReactNode {
    return React.createElement(
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
    );
  }

  // -- Hero section
  const heroEl = heroItem
    ? (function (): React.ReactNode {
        const isExpanded = props.expandedItemId === heroItem.id;
        const preview = stripHtmlTags(heroItem.answer);
        const truncated = preview.length > 300 ? preview.substring(0, 300) + "..." : preview;

        return React.createElement(
          "div",
          {
            className: isExpanded ? styles.heroCard + " " + styles.heroCardExpanded : styles.heroCard,
            id: "faq-item-" + String(heroItem.id),
          },
          React.createElement(
            "button",
            {
              className: styles.heroCardButton,
              type: "button",
              onClick: function (): void {
                if (!isExpanded) props.onFirstExpand(heroItem);
                props.onToggleItem(heroItem.id);
              },
              "aria-expanded": isExpanded,
            },
            React.createElement("h2", { className: styles.heroQuestion }, heroItem.question),
            !isExpanded
              ? React.createElement("p", { className: styles.heroPreview }, truncated)
              : undefined,
            React.createElement(
              "div",
              { className: styles.heroMeta },
              React.createElement("span", { className: styles.heroBadge }, heroItem.category),
              props.showViewCount && heroItem.viewCount > 0
                ? React.createElement(
                    "span",
                    { className: styles.heroViews },
                    React.createElement("i", { className: "ms-Icon ms-Icon--View", "aria-hidden": "true" }),
                    " " + String(heroItem.viewCount) + " views"
                  )
                : undefined,
              heroItem.modified
                ? React.createElement("span", { className: styles.heroDate }, formatDate(heroItem.modified))
                : undefined
            )
          ),
          isExpanded ? renderExpandedContent(heroItem) : undefined
        );
      })()
    : undefined;

  // -- Article cards
  const articleCards: React.ReactNode[] = [];
  restItems.forEach(function (item) {
    const isExpanded = props.expandedItemId === item.id;
    const preview = stripHtmlTags(item.answer);
    const truncated = preview.length > 120 ? preview.substring(0, 120) + "..." : preview;

    articleCards.push(
      React.createElement(
        "div",
        {
          key: item.id,
          className: isExpanded ? styles.articleCard + " " + styles.articleCardExpanded : styles.articleCard,
          id: "faq-item-" + String(item.id),
        },
        React.createElement(
          "button",
          {
            className: styles.articleCardButton,
            type: "button",
            onClick: function (): void {
              if (!isExpanded) props.onFirstExpand(item);
              props.onToggleItem(item.id);
            },
            "aria-expanded": isExpanded,
          },
          React.createElement("h3", { className: styles.articleQuestion }, item.question),
          !isExpanded
            ? React.createElement("p", { className: styles.articlePreview }, truncated)
            : undefined,
          React.createElement(
            "span",
            { className: styles.articleBadge },
            item.category
          )
        ),
        isExpanded ? renderExpandedContent(item) : undefined
      )
    );
  });

  // -- Sidebar: Popular Questions
  const popularListItems: React.ReactNode[] = [];
  popularItems.forEach(function (item, idx) {
    popularListItems.push(
      React.createElement(
        "li",
        { key: item.id, className: styles.sidebarItem },
        React.createElement(
          "button",
          {
            className: styles.sidebarLink,
            type: "button",
            onClick: function (): void { props.onRelatedNavigate(item.id); },
          },
          React.createElement("span", { className: styles.sidebarIndex }, String(idx + 1)),
          React.createElement("span", { className: styles.sidebarText }, item.question)
        )
      )
    );
  });

  // -- Sidebar: Recent Questions
  const recentListItems: React.ReactNode[] = [];
  recentItems.forEach(function (item) {
    recentListItems.push(
      React.createElement(
        "li",
        { key: item.id, className: styles.sidebarItem },
        React.createElement(
          "button",
          {
            className: styles.sidebarLink,
            type: "button",
            onClick: function (): void { props.onRelatedNavigate(item.id); },
          },
          React.createElement("span", { className: styles.sidebarText }, item.question),
          item.modified
            ? React.createElement("span", { className: styles.sidebarDate }, formatDate(item.modified))
            : undefined
        )
      )
    );
  });

  const sidebar = React.createElement(
    "aside",
    { className: styles.sidebar, role: "complementary", "aria-label": "FAQ sidebar" },
    React.createElement(
      "div",
      { className: styles.sidebarSection },
      React.createElement("h3", { className: styles.sidebarTitle }, "Popular Questions"),
      React.createElement("ol", { className: styles.sidebarList }, popularListItems)
    ),
    React.createElement(
      "div",
      { className: styles.sidebarSection },
      React.createElement("h3", { className: styles.sidebarTitle }, "Recent Questions"),
      React.createElement("ul", { className: styles.sidebarList }, recentListItems)
    )
  );

  return React.createElement(
    "div",
    { className: styles.magazineLayout },
    heroEl,
    React.createElement(
      "div",
      { className: styles.contentArea },
      React.createElement("div", { className: styles.mainColumn }, articleCards),
      sidebar
    )
  );
};

export default MagazineLayout;
