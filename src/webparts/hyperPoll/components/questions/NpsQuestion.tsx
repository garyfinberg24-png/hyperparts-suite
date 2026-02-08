import * as React from "react";
import type { IPollQuestion } from "../../models";
import styles from "./NpsQuestion.module.scss";

export interface INpsQuestionProps {
  question: IPollQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
}

function getNpsZoneClass(score: number): string {
  if (score >= 9) return styles.npsPromoter;
  if (score >= 7) return styles.npsPassive;
  return styles.npsDetractor;
}

const NpsQuestion: React.FC<INpsQuestionProps> = function (props) {
  const selectedValue = props.value !== undefined ? parseInt(props.value, 10) : -1;
  const items: React.ReactElement[] = [];

  for (let n = 0; n <= 10; n++) {
    const isSelected = selectedValue === n;
    const className = styles.npsItem
      + " " + getNpsZoneClass(n)
      + (isSelected ? " " + styles.npsItemSelected : "")
      + (props.disabled ? " " + styles.npsItemDisabled : "");

    const val = n;
    items.push(
      React.createElement(
        "div",
        {
          key: n,
          className: className,
          role: "radio",
          "aria-checked": isSelected,
          "aria-label": val + " of 10",
          tabIndex: 0,
          onClick: props.disabled ? undefined : function () { props.onChange(String(val)); },
          onKeyDown: props.disabled ? undefined : function (e: React.KeyboardEvent) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              props.onChange(String(val));
            }
          },
        },
        String(n)
      )
    );
  }

  return React.createElement(
    "div",
    {
      className: styles.npsQuestion,
      role: "radiogroup",
      "aria-label": props.question.text,
    },
    React.createElement("div", { className: styles.npsRow }, items),
    React.createElement(
      "div",
      { className: styles.npsLabels },
      React.createElement("span", undefined, "Not at all likely"),
      React.createElement("span", undefined, "Extremely likely")
    )
  );
};

export default NpsQuestion;
