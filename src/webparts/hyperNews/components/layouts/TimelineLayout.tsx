import * as React from "react";
import type { IHyperNewsArticle } from "../../models";
import { HyperNewsArticleCard } from "../HyperNewsArticleCard";
import styles from "./TimelineLayout.module.scss";

export interface ITimelineLayoutProps {
  articles: IHyperNewsArticle[];
  onCardClick?: (article: IHyperNewsArticle) => void;
}

/** Group articles by month/year for timeline display */
function groupByMonth(articles: IHyperNewsArticle[]): Array<{ label: string; items: IHyperNewsArticle[] }> {
  const groups: Array<{ label: string; items: IHyperNewsArticle[] }> = [];
  const groupMap: Record<string, IHyperNewsArticle[]> = {};
  const groupOrder: string[] = [];

  articles.forEach((article) => {
    const date = new Date(article.FirstPublishedDate || article.Created);
    const key = date.toLocaleDateString(undefined, { month: "long", year: "numeric" });

    if (!groupMap[key]) {
      groupMap[key] = [];
      groupOrder.push(key);
    }
    groupMap[key].push(article);
  });

  groupOrder.forEach((key) => {
    groups.push({ label: key, items: groupMap[key] });
  });

  return groups;
}

/**
 * Timeline layout — articles grouped by month with date headers and connector line.
 */
const TimelineLayoutInner: React.FC<ITimelineLayoutProps> = (props) => {
  const { articles, onCardClick } = props;

  const groups = groupByMonth(articles);

  return React.createElement(
    "div",
    { className: styles.timelineLayout },
    groups.map((group) =>
      React.createElement(
        "div",
        { key: group.label, className: styles.timelineGroup },
        React.createElement(
          "div",
          { className: styles.monthHeader },
          React.createElement("span", { className: styles.monthDot }),
          React.createElement("h3", { className: styles.monthLabel }, group.label)
        ),
        React.createElement(
          "div",
          { className: styles.timelineItems },
          group.items.map((article) =>
            React.createElement(
              "div",
              { key: article.Id, className: styles.timelineItem },
              React.createElement(HyperNewsArticleCard, {
                article: article,
                onCardClick: onCardClick,
              })
            )
          )
        )
      )
    )
  );
};

export const TimelineLayout = React.memo(TimelineLayoutInner);
