import * as React from "react";
import styles from "./HyperLinksSearchBar.module.scss";

export interface IHyperLinksSearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  resultCount: number;
  totalCount: number;
  isFiltering: boolean;
}

var HyperLinksSearchBar: React.FC<IHyperLinksSearchBarProps> = function (props) {
  var inputRef = React.useRef<HTMLInputElement>(undefined as unknown as HTMLInputElement);

  var handleChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    props.onQueryChange(e.target.value);
  }, [props.onQueryChange]);

  var handleClear = React.useCallback(function (): void {
    props.onQueryChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [props.onQueryChange]);

  var handleKeyDown = React.useCallback(function (e: React.KeyboardEvent): void {
    if (e.key === "Escape") {
      props.onQueryChange("");
    }
  }, [props.onQueryChange]);

  return React.createElement("div", { className: styles.searchBar },
    React.createElement("div", { className: styles.searchInputWrapper },
      React.createElement("span", { className: styles.searchIcon, "aria-hidden": "true" }, "\uD83D\uDD0D"),
      React.createElement("input", {
        ref: inputRef,
        type: "text",
        className: styles.searchInput,
        placeholder: "Search links\u2026",
        value: props.query,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        role: "searchbox",
        "aria-label": "Search within links",
      }),
      props.query
        ? React.createElement("button", {
            className: styles.clearButton,
            onClick: handleClear,
            "aria-label": "Clear search",
            type: "button",
          }, "\u2715")
        : undefined
    ),
    props.isFiltering
      ? React.createElement("span", { className: styles.resultCount, "aria-live": "polite" },
          props.resultCount + " of " + props.totalCount + " links"
        )
      : undefined
  );
};

export default HyperLinksSearchBar;
