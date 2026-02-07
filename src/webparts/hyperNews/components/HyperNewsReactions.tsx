import * as React from "react";
import type { ReactionType, INewsReaction } from "../models";
import { REACTION_EMOJI_MAP, REACTION_TYPES } from "../models";
import styles from "./HyperNewsReactions.module.scss";

export interface IHyperNewsReactionsProps {
  reactions: INewsReaction[];
  currentUserReaction: INewsReaction | undefined;
  onReactionClick: (type: ReactionType) => void;
  onRemoveReaction: () => void;
}

const HyperNewsReactionsInner: React.FC<IHyperNewsReactionsProps> = (props) => {
  const { reactions, currentUserReaction, onReactionClick, onRemoveReaction } = props;

  // Count reactions by type
  const counts: Record<ReactionType, number> = {
    like: 0,
    love: 0,
    celebrate: 0,
    insightful: 0,
    curious: 0,
  };

  reactions.forEach((r) => {
    if (counts[r.ReactionType] !== undefined) {
      counts[r.ReactionType] += 1;
    }
  });

  return React.createElement(
    "div",
    { className: styles.reactionsContainer, role: "group", "aria-label": "Reactions" },
    REACTION_TYPES.map((type) => {
      const isActive =
        currentUserReaction !== undefined && currentUserReaction.ReactionType === type;
      const count = counts[type];

      const btnClasses = [styles.reactionButton, isActive ? styles.active : ""]
        .filter(Boolean)
        .join(" ");

      return React.createElement(
        "button",
        {
          key: type,
          className: btnClasses,
          onClick: () => {
            if (isActive) {
              onRemoveReaction();
            } else {
              onReactionClick(type);
            }
          },
          "aria-label": type + " reaction" + (count > 0 ? ", " + count : ""),
          "aria-pressed": isActive,
          type: "button",
        },
        React.createElement("span", { className: styles.emoji }, REACTION_EMOJI_MAP[type]),
        count > 0
          ? React.createElement("span", { className: styles.count }, String(count))
          : undefined
      );
    })
  );
};

export const HyperNewsReactions = React.memo(HyperNewsReactionsInner);
