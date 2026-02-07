import * as React from "react";
import type { IHyperNewsArticle } from "../../models";
import { HyperNewsArticleCard } from "../HyperNewsArticleCard";
import styles from "./ListLayout.module.scss";

export interface IListLayoutProps {
  articles: IHyperNewsArticle[];
  onCardClick?: (article: IHyperNewsArticle) => void;
}

const ListLayoutInner: React.FC<IListLayoutProps> = (props) => {
  const { articles, onCardClick } = props;

  return React.createElement(
    "div",
    { className: styles.listLayout },
    articles.map((article) =>
      React.createElement(
        "div",
        { key: article.Id, className: styles.listItem },
        React.createElement(HyperNewsArticleCard, {
          article: article,
          onCardClick: onCardClick,
          showDescription: true,
        })
      )
    )
  );
};

export const ListLayout = React.memo(ListLayoutInner);
