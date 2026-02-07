import * as React from "react";
import { HyperModal } from "../../../common/components";
import { HyperNewsReactions } from "./HyperNewsReactions";
import { useArticleReactions } from "../hooks/useArticleReactions";
import type { IHyperNewsArticle, ReactionType } from "../models";
import styles from "./HyperNewsQuickReadModal.module.scss";

export interface IHyperNewsQuickReadModalProps {
  article: IHyperNewsArticle | undefined;
  isOpen: boolean;
  onClose: () => void;
  reactionListName: string;
  enableReactions: boolean;
}

const HyperNewsQuickReadModalInner: React.FC<IHyperNewsQuickReadModalProps> = (props) => {
  const { article, isOpen, onClose, reactionListName, enableReactions } = props;

  const articleId = article ? article.Id : 0;

  const { reactions, currentUserReaction, addReaction, removeReaction } =
    useArticleReactions({
      articleId: articleId,
      listName: reactionListName,
      enabled: enableReactions && isOpen && articleId > 0,
    });

  const handleReactionClick = React.useCallback(
    (type: ReactionType): void => {
      addReaction(type).catch(() => {
        /* error stored in hook */
      });
    },
    [addReaction]
  );

  const handleRemoveReaction = React.useCallback((): void => {
    if (currentUserReaction && currentUserReaction.Id) {
      removeReaction(currentUserReaction.Id).catch(() => {
        /* error stored in hook */
      });
    }
  }, [currentUserReaction, removeReaction]);

  if (!article) {
    return React.createElement(React.Fragment);
  }

  // Build footer with reactions
  const footer = enableReactions
    ? React.createElement(HyperNewsReactions, {
        reactions: reactions,
        currentUserReaction: currentUserReaction,
        onReactionClick: handleReactionClick,
        onRemoveReaction: handleRemoveReaction,
      })
    : undefined;

  // Build content element
  const contentElement = article.FileRef
    ? React.createElement("iframe", {
        src: article.FileRef,
        className: styles.articleIframe,
        title: article.Title,
      })
    : React.createElement(
        "div",
        { className: styles.fallbackContent },
        React.createElement("p", undefined, article.Description || "No content available.")
      );

  return React.createElement(
    HyperModal,
    {
      isOpen: isOpen,
      onClose: onClose,
      title: article.Title,
      size: "large",
      footer: footer,
    },
    contentElement
  );
};

export const HyperNewsQuickReadModal = React.memo(HyperNewsQuickReadModalInner);
