import * as React from "react";
import type { IFaqLayoutProps } from "./IFaqLayoutProps";
import type { IFaqItem } from "../../models/IFaqItem";
import HyperFaqExpandedAnswer from "../HyperFaqExpandedAnswer";
import styles from "./TimelineLayout.module.scss";

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function getMonthYear(isoStr: string): string {
  if (!isoStr) return "Unknown";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "Unknown";
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return months[d.getMonth()] + " " + String(d.getFullYear());
}

function formatShortDate(isoStr: string): string {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[d.getMonth()] + " " + String(d.getDate());
}

interface IMonthGroup {
  monthKey: string;
  items: IFaqItem[];
}

function groupByMonth(items: IFaqItem[]): IMonthGroup[] {
  const groupMap: Record<string, IFaqItem[]> = {};
  const order: string[] = [];

  items.forEach(function (item) {
    const key = getMonthYear(item.modified || item.created);
    if (!groupMap[key]) {
      groupMap[key] = [];
      order.push(key);
    }
    groupMap[key].push(item);
  });

  const result: IMonthGroup[] = [];
  order.forEach(function (key) {
    result.push({ monthKey: key, items: groupMap[key] });
  });
  return result;
}

const TimelineLayout: React.FC<IFaqLayoutProps> = function (props) {
  const monthGroups = React.useMemo(function () {
    // Sort by date descending before grouping
    const sorted = props.items.slice().sort(function (a, b) {
      return new Date(b.modified || b.created).getTime() - new Date(a.modified || a.created).getTime();
    });
    return groupByMonth(sorted);
  }, [props.items]);

  function renderTimelineNode(item: IFaqItem, idx: number): React.ReactNode {
    const isExpanded = props.expandedItemId === item.id;
    const isLeft = idx % 2 === 0;
    const preview = stripHtmlTags(item.answer);
    const truncated = preview.length > 160 ? preview.substring(0, 160) + "..." : preview;
    const dateStr = formatShortDate(item.modified || item.created);

    const nodeClass = isLeft
      ? styles.timelineNode + " " + styles.timelineNodeLeft
      : styles.timelineNode + " " + styles.timelineNodeRight;

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

    return React.createElement(
      "div",
      {
        key: item.id,
        className: nodeClass,
        id: "faq-item-" + String(item.id),
      },
      React.createElement("div", { className: styles.timelineDot }),
      React.createElement(
        "div",
        { className: isExpanded ? styles.timelineCard + " " + styles.timelineCardExpanded : styles.timelineCard },
        dateStr
          ? React.createElement("span", { className: styles.timelineDate }, dateStr)
          : undefined,
        React.createElement(
          "button",
          {
            className: styles.timelineCardButton,
            type: "button",
            onClick: function (): void {
              if (!isExpanded) props.onFirstExpand(item);
              props.onToggleItem(item.id);
            },
            "aria-expanded": isExpanded,
          },
          React.createElement("h3", { className: styles.timelineQuestion }, item.question),
          !isExpanded
            ? React.createElement("p", { className: styles.timelinePreview }, truncated)
            : undefined,
          React.createElement(
            "div",
            { className: styles.timelineMeta },
            React.createElement("span", { className: styles.timelineBadge }, item.category),
            props.showViewCount && item.viewCount > 0
              ? React.createElement(
                  "span",
                  { className: styles.timelineViews },
                  String(item.viewCount) + " views"
                )
              : undefined
          )
        ),
        expandedContent
      )
    );
  }

  const timelineElements: React.ReactNode[] = [];
  let globalIdx = 0;

  monthGroups.forEach(function (group) {
    // Month header
    timelineElements.push(
      React.createElement(
        "div",
        { key: "month-" + group.monthKey, className: styles.monthHeader },
        React.createElement("span", { className: styles.monthLabel }, group.monthKey)
      )
    );

    // Timeline nodes
    group.items.forEach(function (item) {
      timelineElements.push(renderTimelineNode(item, globalIdx));
      globalIdx += 1;
    });
  });

  return React.createElement(
    "div",
    { className: styles.timelineLayout },
    React.createElement("div", { className: styles.timelineLine }),
    timelineElements
  );
};

export default TimelineLayout;
