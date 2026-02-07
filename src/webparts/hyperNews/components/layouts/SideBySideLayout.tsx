import * as React from "react";
import { useRef } from "react";
import type { IHyperNewsArticle } from "../../models";
import { useResponsive } from "../../../../common/hooks";
import { HyperNewsArticleCard } from "../HyperNewsArticleCard";
import styles from "./SideBySideLayout.module.scss";

export interface ISideBySideLayoutProps {
  articles: IHyperNewsArticle[];
  onCardClick?: (article: IHyperNewsArticle) => void;
}

/**
 * Alternating image-left / image-right rows for visual variety.
 * On mobile, stacks vertically.
 */
const SideBySideLayoutInner: React.FC<ISideBySideLayoutProps> = (props) => {
  const { articles, onCardClick } = props;

  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  const breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);
  const isMobile = breakpoint === "mobile";

  return React.createElement(
    "div",
    { ref: containerRef, className: styles.sideBySideLayout },
    articles.map((article, idx) =>
      React.createElement(
        "div",
        {
          key: article.Id,
          className: isMobile
            ? styles.rowMobile
            : idx % 2 === 0
              ? styles.rowImageLeft
              : styles.rowImageRight,
        },
        React.createElement(HyperNewsArticleCard, {
          article: article,
          onCardClick: onCardClick,
        })
      )
    )
  );
};

export const SideBySideLayout = React.memo(SideBySideLayoutInner);
