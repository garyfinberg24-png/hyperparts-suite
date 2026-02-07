import * as React from "react";
import { useState, useCallback } from "react";
import type { IHyperNewsArticle } from "../../models";
import { HyperNewsArticleCard } from "../HyperNewsArticleCard";
import styles from "./CarouselLayout.module.scss";

export interface ICarouselLayoutProps {
  articles: IHyperNewsArticle[];
  onCardClick?: (article: IHyperNewsArticle) => void;
}

/**
 * Horizontal carousel with prev/next arrows and dot indicators.
 * Shows one article at a time with fade transition.
 */
const CarouselLayoutInner: React.FC<ICarouselLayoutProps> = (props) => {
  const { articles, onCardClick } = props;
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = useCallback((): void => {
    setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  }, [articles.length]);

  const goToNext = useCallback((): void => {
    setCurrentIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
  }, [articles.length]);

  const goToSlide = useCallback((index: number): void => {
    setCurrentIndex(index);
  }, []);

  if (articles.length === 0) {
    return React.createElement(React.Fragment);
  }

  const currentArticle = articles[currentIndex];

  return React.createElement(
    "div",
    { className: styles.carouselLayout, role: "region", "aria-roledescription": "carousel", "aria-label": "News carousel" },
    // Previous arrow
    React.createElement(
      "button",
      {
        className: styles.arrowButton + " " + styles.arrowLeft,
        onClick: goToPrev,
        "aria-label": "Previous article",
        type: "button",
      },
      "\u2039"
    ),
    // Current slide
    React.createElement(
      "div",
      {
        className: styles.slide,
        role: "group",
        "aria-roledescription": "slide",
        "aria-label": (currentIndex + 1) + " of " + articles.length,
      },
      React.createElement(HyperNewsArticleCard, {
        article: currentArticle,
        onCardClick: onCardClick,
      })
    ),
    // Next arrow
    React.createElement(
      "button",
      {
        className: styles.arrowButton + " " + styles.arrowRight,
        onClick: goToNext,
        "aria-label": "Next article",
        type: "button",
      },
      "\u203A"
    ),
    // Dot indicators
    React.createElement(
      "div",
      { className: styles.dots, role: "tablist", "aria-label": "Slide navigation" },
      articles.map((_article, idx) =>
        React.createElement("button", {
          key: idx,
          className: styles.dot + (idx === currentIndex ? " " + styles.dotActive : ""),
          onClick: () => goToSlide(idx),
          role: "tab",
          "aria-selected": idx === currentIndex,
          "aria-label": "Go to slide " + (idx + 1),
          type: "button",
        })
      )
    )
  );
};

export const CarouselLayout = React.memo(CarouselLayoutInner);
