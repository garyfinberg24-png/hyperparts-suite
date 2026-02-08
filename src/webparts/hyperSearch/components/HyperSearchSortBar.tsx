import * as React from "react";
import type { SearchSortBy } from "../models";
import { useHyperSearchStore } from "../store/useHyperSearchStore";
import styles from "./HyperSearchSortBar.module.scss";

const SORT_OPTIONS: Array<{ key: SearchSortBy; label: string }> = [
  { key: "relevance", label: "Relevance" },
  { key: "dateModified", label: "Date Modified" },
  { key: "author", label: "Author" },
];

const HyperSearchSortBar: React.FC = function () {
  const store = useHyperSearchStore();

  const handleChange = function (e: React.ChangeEvent<HTMLSelectElement>): void {
    store.setSortBy(e.target.value as SearchSortBy);
  };

  const options: React.ReactElement[] = [];
  SORT_OPTIONS.forEach(function (opt) {
    options.push(
      React.createElement("option", { key: opt.key, value: opt.key }, opt.label)
    );
  });

  return React.createElement(
    "div",
    { className: styles.sortBar },
    React.createElement("span", { className: styles.sortLabel }, "Sort by:"),
    React.createElement(
      "select",
      {
        className: styles.sortSelect,
        value: store.query.sortBy,
        onChange: handleChange,
        "aria-label": "Sort results by",
      },
      options
    )
  );
};

export default HyperSearchSortBar;
