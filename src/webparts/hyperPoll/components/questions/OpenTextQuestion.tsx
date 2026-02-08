import * as React from "react";
import type { IPollQuestion } from "../../models";
import styles from "./OpenTextQuestion.module.scss";

export interface IOpenTextQuestionProps {
  question: IPollQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
}

const OpenTextQuestion: React.FC<IOpenTextQuestionProps> = function (props) {
  return React.createElement(
    "div",
    { className: styles.openTextQuestion },
    React.createElement("textarea", {
      className: styles.textarea,
      value: props.value || "",
      disabled: props.disabled,
      placeholder: "Type your answer here...",
      "aria-label": props.question.text,
      onChange: function (e: React.ChangeEvent<HTMLTextAreaElement>) {
        props.onChange(e.target.value);
      },
    })
  );
};

export default OpenTextQuestion;
