import * as React from "react";
import type { IPollQuestion } from "../../models";
import styles from "./SingleChoiceQuestion.module.scss";

export interface ISingleChoiceQuestionProps {
  question: IPollQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
}

const SingleChoiceQuestion: React.FC<ISingleChoiceQuestionProps> = function (props) {
  const options: React.ReactElement[] = [];

  props.question.options.forEach(function (opt) {
    const isSelected = props.value === opt.id;
    const className = styles.option
      + (isSelected ? " " + styles.optionSelected : "")
      + (props.disabled ? " " + styles.optionDisabled : "");

    const radioClass = styles.radio + (isSelected ? " " + styles.radioSelected : "");

    options.push(
      React.createElement(
        "div",
        {
          key: opt.id,
          className: className,
          role: "radio",
          "aria-checked": isSelected,
          "aria-label": opt.text,
          tabIndex: 0,
          onClick: props.disabled ? undefined : function () { props.onChange(opt.id); },
          onKeyDown: props.disabled ? undefined : function (e: React.KeyboardEvent) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              props.onChange(opt.id);
            }
          },
        },
        React.createElement("div", { className: radioClass }),
        React.createElement("span", { className: styles.optionLabel }, opt.text)
      )
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.singleChoice,
      role: "radiogroup",
      "aria-label": props.question.text,
    },
    options
  );
};

export default SingleChoiceQuestion;
