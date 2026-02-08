import * as React from "react";
import styles from "./HyperFaqSearchBar.module.scss";

export interface IHyperFaqSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  resultCount: number;
  totalCount: number;
  placeholder: string;
}

const HyperFaqSearchBar: React.FC<IHyperFaqSearchBarProps> = function (props) {
  const handleChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    props.onQueryChange(e.target.value);
  }, [props.onQueryChange]);

  const handleClear = React.useCallback(function (): void {
    props.onQueryChange("");
  }, [props.onQueryChange]);

  const showResultCount = props.query.length >= 2;
  const isFiltered = props.resultCount !== props.totalCount;

  return React.createElement(
    "div",
    { className: styles.searchContainer, role: "search" },
    React.createElement("i", {
      className: "ms-Icon ms-Icon--Search " + styles.searchIcon,
      "aria-hidden": "true",
    }),
    React.createElement("input", {
      type: "text",
      className: styles.searchInput,
      placeholder: props.placeholder,
      value: props.query,
      onChange: handleChange,
      "aria-label": props.placeholder,
    }),
    props.query.length > 0
      ? React.createElement(
          "button",
          {
            className: styles.clearButton,
            onClick: handleClear,
            "aria-label": "Clear search",
            type: "button",
          },
          React.createElement("i", {
            className: "ms-Icon ms-Icon--Cancel",
            "aria-hidden": "true",
          })
        )
      : undefined,
    showResultCount && isFiltered
      ? React.createElement(
          "div",
          { className: styles.resultCount, "aria-live": "polite" },
          String(props.resultCount) + " of " + String(props.totalCount) + " results"
        )
      : undefined
  );
};

export default HyperFaqSearchBar;
