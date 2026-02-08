import * as React from "react";
import type { IPollQuestion } from "../../models";
import styles from "./RankingQuestion.module.scss";

export interface IRankingQuestionProps {
  question: IPollQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
}

function parseRankedIds(value: string | undefined, options: IPollQuestion["options"]): string[] {
  if (value) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as string[];
    } catch { /* use default */ }
  }
  // Default order: same as options array
  const ids: string[] = [];
  options.forEach(function (opt) { ids.push(opt.id); });
  return ids;
}

const RankingQuestion: React.FC<IRankingQuestionProps> = function (props) {
  const rankedIds = parseRankedIds(props.value, props.question.options);

  // Build a lookup from id -> text
  const optionMap: Record<string, string> = {};
  props.question.options.forEach(function (opt) {
    optionMap[opt.id] = opt.text;
  });

  const items: React.ReactElement[] = [];

  rankedIds.forEach(function (optId, idx) {
    const moveUp = function (): void {
      if (props.disabled || idx === 0) return;
      const updated: string[] = [];
      rankedIds.forEach(function (id) { updated.push(id); });
      const temp = updated[idx - 1];
      updated[idx - 1] = updated[idx];
      updated[idx] = temp;
      props.onChange(JSON.stringify(updated));
    };

    const moveDown = function (): void {
      if (props.disabled || idx === rankedIds.length - 1) return;
      const updated: string[] = [];
      rankedIds.forEach(function (id) { updated.push(id); });
      const temp = updated[idx + 1];
      updated[idx + 1] = updated[idx];
      updated[idx] = temp;
      props.onChange(JSON.stringify(updated));
    };

    items.push(
      React.createElement(
        "div",
        { key: optId, className: styles.rankItem, role: "listitem" },
        React.createElement("div", { className: styles.rankNumber }, String(idx + 1)),
        React.createElement("span", { className: styles.rankLabel }, optionMap[optId] || optId),
        React.createElement(
          "div",
          { className: styles.rankButtons },
          React.createElement(
            "button",
            {
              type: "button",
              className: styles.rankButton,
              disabled: props.disabled || idx === 0,
              "aria-label": "Move " + (optionMap[optId] || optId) + " up",
              onClick: moveUp,
            },
            "\u25B2"
          ),
          React.createElement(
            "button",
            {
              type: "button",
              className: styles.rankButton,
              disabled: props.disabled || idx === rankedIds.length - 1,
              "aria-label": "Move " + (optionMap[optId] || optId) + " down",
              onClick: moveDown,
            },
            "\u25BC"
          )
        )
      )
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.rankingQuestion,
      role: "list",
      "aria-label": props.question.text,
    },
    items
  );
};

export default RankingQuestion;
