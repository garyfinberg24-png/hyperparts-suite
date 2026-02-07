import * as React from "react";
import { useRef } from "react";
import type { IHyperNewsArticle } from "../../models";
import { useResponsive } from "../../../../common/hooks";
import { HyperNewsArticleCard } from "../HyperNewsArticleCard";
import styles from "./MosaicLayout.module.scss";

export interface IMosaicLayoutProps {
  articles: IHyperNewsArticle[];
  onCardClick?: (article: IHyperNewsArticle) => void;
}

/**
 * Pinterest-style staggered grid with varied heights.
 * Uses CSS columns for masonry-like effect.
 */
const MosaicLayoutInner: React.FC<IMosaicLayoutProps> = (props) => {
  const { articles, onCardClick } = props;

  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  const breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);

  const columnCount = breakpoint === "mobile" ? 1 : breakpoint === "tablet" ? 2 : 3;

  const columnStyle: React.CSSProperties = {
    columnCount: columnCount,
  };

  return React.createElement(
    "div",
    { ref: containerRef, className: styles.mosaicLayout, style: columnStyle },
    articles.map((article, idx) =>
      React.createElement(
        "div",
        { key: article.Id, className: styles.mosaicItem },
        React.createElement(HyperNewsArticleCard, {
          article: article,
          onCardClick: onCardClick,
          // Alternate: show description on odd items for visual variety
          showDescription: idx % 2 === 0,
        })
      )
    )
  );
};

export const MosaicLayout = React.memo(MosaicLayoutInner);
