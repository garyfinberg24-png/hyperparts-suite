import * as React from "react";
import type { IHyperNewsArticle } from "../../models";
import { HyperNewsArticleCard } from "../HyperNewsArticleCard";
import styles from "./FilmstripLayout.module.scss";

export interface IFilmstripLayoutProps {
  articles: IHyperNewsArticle[];
  onCardClick?: (article: IHyperNewsArticle) => void;
}

/**
 * Horizontal scroll strip with fixed-width cards.
 * Overflows with native horizontal scrollbar.
 */
const FilmstripLayoutInner: React.FC<IFilmstripLayoutProps> = (props) => {
  const { articles, onCardClick } = props;

  return React.createElement(
    "div",
    { className: styles.filmstripLayout, role: "list", "aria-label": "News filmstrip" },
    articles.map((article) =>
      React.createElement(
        "div",
        { key: article.Id, className: styles.filmstripCard, role: "listitem" },
        React.createElement(HyperNewsArticleCard, {
          article: article,
          onCardClick: onCardClick,
        })
      )
    )
  );
};

export const FilmstripLayout = React.memo(FilmstripLayoutInner);
