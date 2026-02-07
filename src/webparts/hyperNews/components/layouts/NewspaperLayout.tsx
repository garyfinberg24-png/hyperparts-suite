import * as React from "react";
import { useRef } from "react";
import type { IHyperNewsArticle } from "../../models";
import { useResponsive } from "../../../../common/hooks";
import { HyperNewsArticleCard } from "../HyperNewsArticleCard";
import styles from "./NewspaperLayout.module.scss";

export interface INewspaperLayoutProps {
  articles: IHyperNewsArticle[];
  onCardClick?: (article: IHyperNewsArticle) => void;
}

/**
 * Multi-column masonry-style layout with varied card sizes.
 * First article is large (spans 2 columns), next 2 are medium, rest are small.
 */
const NewspaperLayoutInner: React.FC<INewspaperLayoutProps> = (props) => {
  const { articles, onCardClick } = props;

  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  const breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);

  const isMobile = breakpoint === "mobile";

  if (articles.length === 0) {
    return React.createElement("div", { ref: containerRef });
  }

  const headline = articles[0];
  const secondary = articles.slice(1, 3);
  const rest = articles.slice(3);

  return React.createElement(
    "div",
    { ref: containerRef, className: styles.newspaperLayout },
    // Headline — full width
    React.createElement(
      "div",
      { className: styles.headline },
      React.createElement(HyperNewsArticleCard, {
        article: headline,
        onCardClick: onCardClick,
        className: styles.headlineCard,
      })
    ),
    // Secondary row — 2 columns (or stacked on mobile)
    secondary.length > 0
      ? React.createElement(
          "div",
          { className: isMobile ? styles.secondaryMobile : styles.secondaryRow },
          secondary.map((article) =>
            React.createElement(HyperNewsArticleCard, {
              key: article.Id,
              article: article,
              onCardClick: onCardClick,
            })
          )
        )
      : undefined,
    // Remaining — 3-column grid (or stacked on mobile)
    rest.length > 0
      ? React.createElement(
          "div",
          { className: isMobile ? styles.restMobile : styles.restGrid },
          rest.map((article) =>
            React.createElement(HyperNewsArticleCard, {
              key: article.Id,
              article: article,
              onCardClick: onCardClick,
              showDescription: false,
            })
          )
        )
      : undefined
  );
};

export const NewspaperLayout = React.memo(NewspaperLayoutInner);
