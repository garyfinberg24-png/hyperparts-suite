import * as React from "react";
import { useRef } from "react";
import type { IHyperNewsArticle } from "../../models";
import { useResponsive } from "../../../../common/hooks";
import { HyperNewsArticleCard } from "../HyperNewsArticleCard";
import styles from "./TilesLayout.module.scss";

export interface ITilesLayoutProps {
  articles: IHyperNewsArticle[];
  onCardClick?: (article: IHyperNewsArticle) => void;
}

/**
 * Equal-height card tiles in a responsive grid — similar to OOTB Tiles but prettier.
 */
const TilesLayoutInner: React.FC<ITilesLayoutProps> = (props) => {
  const { articles, onCardClick } = props;

  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  const breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);

  const columnCount =
    breakpoint === "mobile" ? 1 : breakpoint === "tablet" ? 2 : 4;

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: "repeat(" + columnCount + ", 1fr)",
  };

  return React.createElement(
    "div",
    { ref: containerRef, className: styles.tilesLayout, style: gridStyle },
    articles.map((article) =>
      React.createElement(
        "div",
        { key: article.Id, className: styles.tile },
        React.createElement(HyperNewsArticleCard, {
          article: article,
          onCardClick: onCardClick,
          showDescription: false,
        })
      )
    )
  );
};

export const TilesLayout = React.memo(TilesLayoutInner);
