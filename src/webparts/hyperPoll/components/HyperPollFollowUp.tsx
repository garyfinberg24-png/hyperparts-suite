import * as React from "react";
import type { IPollQuestion } from "../models";
import HyperPollQuestionRenderer from "./HyperPollQuestionRenderer";
import styles from "./HyperPollFollowUp.module.scss";

export interface IHyperPollFollowUpProps {
  /** The follow-up question to potentially show */
  followUpQuestion: IPollQuestion | undefined;
  /** Whether the trigger condition is met */
  isTriggered: boolean;
  /** Current answer for the follow-up question */
  value: string | undefined;
  /** Answer change handler */
  onChange: (questionId: string, value: string) => void;
  disabled: boolean;
}

const HyperPollFollowUp: React.FC<IHyperPollFollowUpProps> = function (props) {
  if (!props.followUpQuestion) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const className = styles.followUp
    + (props.isTriggered ? " " + styles.followUpVisible : "");

  return React.createElement(
    "div",
    { className: className, "aria-hidden": !props.isTriggered },
    props.isTriggered
      ? React.createElement(HyperPollQuestionRenderer, {
          question: props.followUpQuestion,
          value: props.value,
          onChange: props.onChange,
          disabled: props.disabled,
        })
      : undefined
  );
};

export default HyperPollFollowUp;
