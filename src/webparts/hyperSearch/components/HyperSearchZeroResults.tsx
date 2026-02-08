import * as React from "react";
import styles from "./HyperSearchZeroResults.module.scss";

export interface IHyperSearchZeroResultsProps {
  spellingSuggestion: string;
  onSpellingSuggestionClick: (suggestion: string) => void;
}

const SEARCH_TIPS: string[] = [
  "Check your spelling or try different keywords",
  "Broaden your search scope (e.g. \"Everything\" instead of \"Current Site\")",
  "Use fewer or more general words",
  "Remove active filters from the refinement panel",
];

const HyperSearchZeroResults: React.FC<IHyperSearchZeroResultsProps> = function (props) {
  const children: React.ReactElement[] = [
    React.createElement("div", { key: "icon", className: styles.icon, "aria-hidden": "true" }, "\uD83D\uDD0D"),
    React.createElement("h3", { key: "heading", className: styles.heading }, "No results found"),
    React.createElement(
      "p",
      { key: "desc", className: styles.description },
      "We couldn't find anything matching your search."
    ),
  ];

  // Spelling suggestion
  if (props.spellingSuggestion) {
    children.push(
      React.createElement(
        "div",
        { key: "spelling", className: styles.spellingSection },
        React.createElement("span", { className: styles.spellingLabel }, "Did you mean: "),
        React.createElement(
          "button",
          {
            type: "button",
            className: styles.spellingButton,
            onClick: function () {
              props.onSpellingSuggestionClick(props.spellingSuggestion);
            },
          },
          props.spellingSuggestion
        )
      )
    );
  }

  // Tips
  const tipItems: React.ReactElement[] = [];
  SEARCH_TIPS.forEach(function (tip, idx) {
    tipItems.push(
      React.createElement("li", { key: idx, className: styles.tipItem }, tip)
    );
  });

  children.push(
    React.createElement("ul", { key: "tips", className: styles.tips }, tipItems)
  );

  return React.createElement("div", { className: styles.zeroResults }, children);
};

export default HyperSearchZeroResults;
