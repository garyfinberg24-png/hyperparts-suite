import * as React from "react";
import type { IPollQuestion } from "../../models";
import styles from "./RatingQuestion.module.scss";

export interface IRatingQuestionProps {
  question: IPollQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
}

const RatingQuestion: React.FC<IRatingQuestionProps> = function (props) {
  const selectedValue = props.value ? parseInt(props.value, 10) : 0;
  const max = props.question.ratingMax || 5;
  const items: React.ReactElement[] = [];

  for (let i = 1; i <= max; i++) {
    const isSelected = selectedValue === i;
    const className = styles.ratingItem
      + (isSelected ? " " + styles.ratingItemSelected : "")
      + (props.disabled ? " " + styles.ratingItemDisabled : "");

    const val = i;
    items.push(
      React.createElement(
        "div",
        {
          key: i,
          className: className,
          role: "radio",
          "aria-checked": isSelected,
          "aria-label": val + " of " + max,
          tabIndex: 0,
          onClick: props.disabled ? undefined : function () { props.onChange(String(val)); },
          onKeyDown: props.disabled ? undefined : function (e: React.KeyboardEvent) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              props.onChange(String(val));
            }
          },
        },
        String(i)
      )
    );
  }

  return React.createElement(
    "div",
    {
      className: styles.ratingQuestion,
      role: "radiogroup",
      "aria-label": props.question.text,
    },
    items
  );
};

export default RatingQuestion;
