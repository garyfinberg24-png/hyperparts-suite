import * as React from "react";
import styles from "./HyperDirectorySearchBar.module.scss";

export interface IHyperDirectorySearchBarProps {
  value: string;
  placeholder: string;
  resultCount?: number;
  totalCount?: number;
  onChange: (query: string) => void;
}

const HyperDirectorySearchBar: React.FC<IHyperDirectorySearchBarProps> = function (props) {
  const { value, placeholder, resultCount, totalCount, onChange } = props;

  const handleChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    onChange(e.target.value);
  }, [onChange]);

  const handleClear = React.useCallback(function (): void {
    onChange("");
  }, [onChange]);

  const handleKeyDown = React.useCallback(function (e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Escape") {
      onChange("");
    }
  }, [onChange]);

  return React.createElement("div", { className: styles.searchBar, role: "search" },
    React.createElement("span", {
      className: styles.searchIcon,
      "aria-hidden": "true",
    }, "\uD83D\uDD0D"),
    React.createElement("input", {
      type: "text",
      className: styles.searchInput,
      value: value,
      placeholder: placeholder,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      "aria-label": placeholder,
    }),
    value ? React.createElement("button", {
      className: styles.clearButton,
      onClick: handleClear,
      "aria-label": "Clear search",
      type: "button",
    }, "\u2715") : undefined,
    resultCount !== undefined && totalCount !== undefined
      ? React.createElement("span", { className: styles.resultCount },
          resultCount + " of " + totalCount
        )
      : undefined
  );
};

export default React.memo(HyperDirectorySearchBar);
