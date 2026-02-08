import * as React from "react";
import type { ISearchSuggestion } from "../models";
import styles from "./HyperSearchSuggestions.module.scss";

export interface IHyperSearchSuggestionsProps {
  suggestions: ISearchSuggestion[];
  activeSuggestionIndex: number;
  suggestionsId: string;
  onSelect: (queryString: string) => void;
}

const HyperSearchSuggestions: React.FC<IHyperSearchSuggestionsProps> = function (props) {
  if (props.suggestions.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const items: React.ReactElement[] = [];
  props.suggestions.forEach(function (suggestion, index) {
    const isActive = index === props.activeSuggestionIndex;
    const className = styles.suggestionItem
      + (isActive ? " " + styles.suggestionItemActive : "");

    items.push(
      React.createElement(
        "li",
        {
          key: index,
          id: props.suggestionsId + "-" + index,
          className: className,
          role: "option",
          "aria-selected": isActive,
          onMouseDown: function (e: React.MouseEvent): void {
            e.preventDefault();
            props.onSelect(suggestion.queryString);
          },
        },
        suggestion.text
      )
    );
  });

  return React.createElement(
    "ul",
    {
      id: props.suggestionsId,
      className: styles.suggestionsDropdown,
      role: "listbox",
      "aria-label": "Search suggestions",
    },
    items
  );
};

export default HyperSearchSuggestions;
