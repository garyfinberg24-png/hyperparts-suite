import * as React from "react";
import { useRef } from "react";
import type { IHyperNewsArticle } from "../../models";
import { useResponsive } from "../../../../common/hooks";
import { HyperNewsArticleCard } from "../HyperNewsArticleCard";
import styles from "./HeroGridLayout.module.scss";

export interface IHeroGridLayoutProps {
  articles: IHyperNewsArticle[];
  onCardClick?: (article: IHyperNewsArticle) => void;
}

/**
 * 1 large hero card (2x2) + up to 4 small cards in a CSS Grid.
 * Falls back to stacked column on mobile.
 */
const HeroGridLayoutInner: React.FC<IHeroGridLayoutProps> = (props) => {
  const { articles, onCardClick } = props;

  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  const breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);

  if (articles.length === 0) {
    return React.createElement("div", { ref: containerRef });
  }

  const isMobile = breakpoint === "mobile";
  const hero = articles[0];
  const cards = articles.slice(1, 5);

  if (isMobile) {
    return React.createElement(
      "div",
      { ref: containerRef, className: styles.heroGridMobile },
      React.createElement(HyperNewsArticleCard, {
        article: hero,
        onCardClick: onCardClick,
      }),
      cards.map((article) =>
        React.createElement(HyperNewsArticleCard, {
          key: article.Id,
          article: article,
          onCardClick: onCardClick,
          showDescription: false,
        })
      )
    );
  }

  return React.createElement(
    "div",
    { ref: containerRef, className: styles.heroGrid },
    // Hero takes 2x2 area
    React.createElement(
      "div",
      { className: styles.heroArea },
      React.createElement(HyperNewsArticleCard, {
        article: hero,
        onCardClick: onCardClick,
      })
    ),
    // Small cards fill remaining grid cells
    cards.map((article) =>
      React.createElement(
        "div",
        { key: article.Id, className: styles.smallCard },
        React.createElement(HyperNewsArticleCard, {
          article: article,
          onCardClick: onCardClick,
          showDescription: false,
        })
      )
    )
  );
};

export const HeroGridLayout = React.memo(HeroGridLayoutInner);
