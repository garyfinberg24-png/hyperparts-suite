import * as React from "react";
import { useRef } from "react";
import type { IHyperNewsArticle } from "../../models";
import { useResponsive } from "../../../../common/hooks";
import { HyperNewsArticleCard } from "../HyperNewsArticleCard";
import styles from "./MagazineLayout.module.scss";

export interface IMagazineLayoutProps {
  articles: IHyperNewsArticle[];
  onCardClick?: (article: IHyperNewsArticle) => void;
}

const MagazineLayoutInner: React.FC<IMagazineLayoutProps> = (props) => {
  const { articles, onCardClick } = props;

  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  const breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);

  if (articles.length === 0) {
    return React.createElement("div", { ref: containerRef });
  }

  const featured = articles[0];
  const sidebar = articles.slice(1, 5);
  const isMobile = breakpoint === "mobile";

  // On mobile, stack vertically; otherwise use 2fr + 1fr grid
  const gridClass = isMobile ? styles.magazineMobile : styles.magazineDesktop;

  return React.createElement(
    "div",
    { ref: containerRef, className: gridClass },
    // Featured large card
    React.createElement(
      "div",
      { className: styles.featuredArea },
      React.createElement(HyperNewsArticleCard, {
        article: featured,
        onCardClick: onCardClick,
      })
    ),
    // Sidebar compact cards
    sidebar.length > 0
      ? React.createElement(
          "div",
          { className: styles.sidebarArea },
          sidebar.map((article) =>
            React.createElement(
              "div",
              { key: article.Id, className: styles.sidebarItem },
              React.createElement(HyperNewsArticleCard, {
                article: article,
                onCardClick: onCardClick,
                showDescription: false,
              })
            )
          )
        )
      : undefined
  );
};

export const MagazineLayout = React.memo(MagazineLayoutInner);
