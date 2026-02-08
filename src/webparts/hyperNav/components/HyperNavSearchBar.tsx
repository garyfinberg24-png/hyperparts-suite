import * as React from "react";
import styles from "./HyperNavSearchBar.module.scss";

export interface IHyperNavSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const HyperNavSearchBar: React.FC<IHyperNavSearchBarProps> = function (props) {
  const handleChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>) {
    props.onChange(e.target.value);
  }, [props.onChange]);

  return React.createElement(
    "div",
    { className: styles.searchBar, role: "search" },
    React.createElement("i", {
      className: styles.searchIcon + " ms-Icon ms-Icon--Search",
      "aria-hidden": "true",
    }),
    React.createElement("input", {
      type: "text",
      className: styles.searchInput,
      value: props.value,
      onChange: handleChange,
      placeholder: props.placeholder || "Search links...",
      "aria-label": "Search navigation links",
    })
  );
};
