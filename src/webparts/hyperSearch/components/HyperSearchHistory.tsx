import * as React from "react";
import type { ISearchHistoryEntry } from "../models";
import styles from "./HyperSearchHistory.module.scss";

export interface IHyperSearchHistoryProps {
  history: ISearchHistoryEntry[];
  onSelect: (queryText: string) => void;
  onClear: () => void;
}

const HyperSearchHistory: React.FC<IHyperSearchHistoryProps> = function (props) {
  if (props.history.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const items: React.ReactElement[] = [];
  props.history.forEach(function (entry, index) {
    items.push(
      React.createElement(
        "li",
        {
          key: index,
          className: styles.historyItem,
          onMouseDown: function (e: React.MouseEvent): void {
            e.preventDefault();
            props.onSelect(entry.queryText);
          },
        },
        React.createElement("span", { className: styles.historyQuery }, entry.queryText),
        React.createElement(
          "span",
          { className: styles.historyCount },
          String(entry.resultCount) + " results"
        )
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.historyDropdown },
    React.createElement(
      "div",
      { className: styles.historyHeader },
      React.createElement("span", { className: styles.historyTitle }, "Recent Searches"),
      React.createElement(
        "button",
        {
          type: "button",
          className: styles.clearButton,
          onMouseDown: function (e: React.MouseEvent): void {
            e.preventDefault();
            props.onClear();
          },
        },
        "Clear"
      )
    ),
    React.createElement("ul", { className: styles.historyList }, items)
  );
};

export default HyperSearchHistory;
