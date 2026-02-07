import * as React from "react";
import { useRef } from "react";
import type { IHyperNewsArticle } from "../../models";
import { useResponsive } from "../../../../common/hooks";
import { HyperNewsArticleCard } from "../HyperNewsArticleCard";
import styles from "./CardGridLayout.module.scss";

export interface ICardGridLayoutProps {
  articles: IHyperNewsArticle[];
  onCardClick?: (article: IHyperNewsArticle) => void;
  columns?: number;
}

const CardGridLayoutInner: React.FC<ICardGridLayoutProps> = (props) => {
  const { articles, onCardClick, columns = 3 } = props;

  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  const breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);

  const responsiveColumns =
    breakpoint === "mobile" ? 1 : breakpoint === "tablet" ? 2 : columns;

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: "repeat(" + responsiveColumns + ", 1fr)",
  };

  return React.createElement(
    "div",
    { ref: containerRef, className: styles.cardGrid, style: gridStyle },
    articles.map((article) =>
      React.createElement(HyperNewsArticleCard, {
        key: article.Id,
        article: article,
        onCardClick: onCardClick,
      })
    )
  );
};

export const CardGridLayout = React.memo(CardGridLayoutInner);
