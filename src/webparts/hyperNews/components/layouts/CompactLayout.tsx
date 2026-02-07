import * as React from "react";
import type { IHyperNewsArticle } from "../../models";
import { HyperNewsArticleCard } from "../HyperNewsArticleCard";
import styles from "./CompactLayout.module.scss";

export interface ICompactLayoutProps {
  articles: IHyperNewsArticle[];
  onCardClick?: (article: IHyperNewsArticle) => void;
}

/**
 * Dense text-only list — no images, maximizes information density.
 */
const CompactLayoutInner: React.FC<ICompactLayoutProps> = (props) => {
  const { articles, onCardClick } = props;

  return React.createElement(
    "div",
    { className: styles.compactLayout },
    articles.map((article) =>
      React.createElement(
        "div",
        { key: article.Id, className: styles.compactItem },
        React.createElement(HyperNewsArticleCard, {
          article: article,
          onCardClick: onCardClick,
          showImage: false,
          showDescription: false,
          showReadTime: true,
          showAuthor: true,
          showDate: true,
        })
      )
    )
  );
};

export const CompactLayout = React.memo(CompactLayoutInner);
