import * as React from "react";
import type { IPollQuestion } from "../../models";
import styles from "./MultipleChoiceQuestion.module.scss";

export interface IMultipleChoiceQuestionProps {
  question: IPollQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
}

function parseSelectedIds(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed as string[];
    return [];
  } catch {
    return [];
  }
}

const MultipleChoiceQuestion: React.FC<IMultipleChoiceQuestionProps> = function (props) {
  const selectedIds = parseSelectedIds(props.value);
  const options: React.ReactElement[] = [];

  props.question.options.forEach(function (opt) {
    const isSelected = selectedIds.indexOf(opt.id) !== -1;
    const className = styles.option
      + (isSelected ? " " + styles.optionSelected : "")
      + (props.disabled ? " " + styles.optionDisabled : "");

    const checkboxClass = styles.checkbox + (isSelected ? " " + styles.checkboxSelected : "");

    const handleToggle = function (): void {
      if (props.disabled) return;
      const updated: string[] = [];
      let found = false;
      selectedIds.forEach(function (id) {
        if (id === opt.id) {
          found = true;
        } else {
          updated.push(id);
        }
      });
      if (!found) {
        updated.push(opt.id);
      }
      props.onChange(JSON.stringify(updated));
    };

    options.push(
      React.createElement(
        "div",
        {
          key: opt.id,
          className: className,
          role: "checkbox",
          "aria-checked": isSelected,
          "aria-label": opt.text,
          tabIndex: 0,
          onClick: handleToggle,
          onKeyDown: function (e: React.KeyboardEvent) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle();
            }
          },
        },
        React.createElement("div", { className: checkboxClass }, isSelected ? "\u2713" : ""),
        React.createElement("span", { className: styles.optionLabel }, opt.text)
      )
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.multipleChoice,
      role: "group",
      "aria-label": props.question.text,
    },
    options
  );
};

export default MultipleChoiceQuestion;
