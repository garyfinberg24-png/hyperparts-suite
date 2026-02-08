import * as React from "react";
import type { IFaqItem } from "../models";
import styles from "./HyperFaqVoting.module.scss";

export interface IHyperFaqVotingProps {
  item: IFaqItem;
  hasVoted: boolean;
  voteDirection: "yes" | "no" | undefined;
  onVote: (itemId: number, isHelpful: boolean) => void;
  helpfulLabel: string;
  yesLabel: string;
  noLabel: string;
}

const HyperFaqVoting: React.FC<IHyperFaqVotingProps> = function (props) {
  const handleYes = React.useCallback(function (): void {
    props.onVote(props.item.id, true);
  }, [props.item.id, props.onVote]);

  const handleNo = React.useCallback(function (): void {
    props.onVote(props.item.id, false);
  }, [props.item.id, props.onVote]);

  const yesClass = props.voteDirection === "yes"
    ? styles.voteButton + " " + styles.voteButtonActive
    : styles.voteButton;

  const noClass = props.voteDirection === "no"
    ? styles.voteButton + " " + styles.voteButtonActive
    : styles.voteButton;

  return React.createElement(
    "div",
    { className: styles.votingContainer },
    React.createElement("span", { className: styles.votingLabel }, props.helpfulLabel),
    React.createElement(
      "button",
      {
        className: yesClass,
        onClick: handleYes,
        disabled: props.hasVoted,
        type: "button",
        "aria-label": props.yesLabel,
      },
      React.createElement("i", {
        className: "ms-Icon ms-Icon--Like",
        "aria-hidden": "true",
      }),
      props.yesLabel,
      React.createElement("span", { className: styles.voteCount }, String(props.item.helpfulYes))
    ),
    React.createElement(
      "button",
      {
        className: noClass,
        onClick: handleNo,
        disabled: props.hasVoted,
        type: "button",
        "aria-label": props.noLabel,
      },
      React.createElement("i", {
        className: "ms-Icon ms-Icon--Dislike",
        "aria-hidden": "true",
      }),
      props.noLabel,
      React.createElement("span", { className: styles.voteCount }, String(props.item.helpfulNo))
    )
  );
};

export default HyperFaqVoting;
