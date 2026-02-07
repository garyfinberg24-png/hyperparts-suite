import * as React from "react";
import { HyperCard } from "../../../common/components";
import type { IHyperNewsArticle } from "../models";
import styles from "./HyperNewsArticleCard.module.scss";

export interface IHyperNewsArticleCardProps {
  article: IHyperNewsArticle;
  onCardClick?: (article: IHyperNewsArticle) => void;
  showImage?: boolean;
  showDescription?: boolean;
  showReadTime?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  className?: string;
}

const HyperNewsArticleCardInner: React.FC<IHyperNewsArticleCardProps> = (props) => {
  const {
    article,
    onCardClick,
    showImage = true,
    showDescription = true,
    showReadTime = true,
    showAuthor = true,
    showDate = true,
    className,
  } = props;

  const handleClick = React.useCallback((): void => {
    if (onCardClick) {
      onCardClick(article);
    }
  }, [article, onCardClick]);

  // Build metadata items
  const metadataItems: React.ReactElement[] = [];

  if (showAuthor && article.Author) {
    metadataItems.push(
      React.createElement("span", { key: "author", className: styles.metaItem }, article.Author.Title)
    );
  }

  if (showDate) {
    const dateStr = article.FirstPublishedDate || article.Created;
    const formatted = new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    metadataItems.push(
      React.createElement("span", { key: "date", className: styles.metaItem }, formatted)
    );
  }

  if (showReadTime && article.readTime) {
    metadataItems.push(
      React.createElement(
        "span",
        { key: "readTime", className: styles.metaItem },
        article.readTime + " min read"
      )
    );
  }

  const cardClasses = [styles.articleCard, className].filter(Boolean).join(" ");

  return React.createElement(
    HyperCard,
    {
      title: article.Title,
      description: showDescription ? article.Description : undefined,
      imageUrl: showImage ? article.BannerImageUrl : undefined,
      imageAlt: article.Title,
      onClick: onCardClick ? handleClick : undefined,
      className: cardClasses,
    },
    // NEW badge
    article.isNew
      ? React.createElement("span", { className: styles.newBadge }, "NEW")
      : undefined,
    // Metadata row
    metadataItems.length > 0
      ? React.createElement("div", { className: styles.metadataRow }, metadataItems)
      : undefined
  );
};

export const HyperNewsArticleCard = React.memo(HyperNewsArticleCardInner);
