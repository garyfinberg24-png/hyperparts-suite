import * as React from "react";
import type { SearchScopeType } from "../models";
import type { ISearchHistoryEntry } from "../models";
import { useHyperSearchStore } from "../store/useHyperSearchStore";
import HyperSearchSuggestions from "./HyperSearchSuggestions";
import HyperSearchHistory from "./HyperSearchHistory";
import styles from "./HyperSearchBar.module.scss";

export interface IHyperSearchBarProps {
  placeholderText: string;
  showScopeSelector: boolean;
  enableHistory: boolean;
  history: ISearchHistoryEntry[];
  onClearHistory: () => void;
  onSearch: (queryText: string) => void;
}

const SCOPE_LABELS: Array<{ key: SearchScopeType; label: string }> = [
  { key: "everything", label: "Everything" },
  { key: "sharepoint", label: "SharePoint" },
  { key: "onedrive", label: "OneDrive" },
  { key: "teams", label: "Teams" },
  { key: "exchange", label: "Exchange" },
  { key: "currentSite", label: "Current Site" },
];

const HyperSearchBar: React.FC<IHyperSearchBarProps> = function (props) {
  const store = useHyperSearchStore();
  const [inputValue, setInputValue] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(-1);
  // eslint-disable-next-line @rushstack/no-new-null
  const inputRef = React.useRef<HTMLInputElement>(null);
  const suggestionsId = "hyperSearch-suggestions-" + Math.random().toString(36).substring(2, 9);

  const handleInputChange = function (e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value;
    setInputValue(value);
    store.setQueryText(value);
    setShowSuggestions(value.length >= 3);
    setShowHistory(false);
    setActiveSuggestionIndex(-1);
  };

  const handleKeyDown = function (e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < store.suggestions.length) {
        // Select active suggestion
        const suggestion = store.suggestions[activeSuggestionIndex];
        setInputValue(suggestion.queryString);
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        props.onSearch(suggestion.queryString);
      } else {
        // Submit current input
        setShowSuggestions(false);
        props.onSearch(inputValue);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (showSuggestions && store.suggestions.length > 0) {
        setActiveSuggestionIndex(function (prev) {
          return prev < store.suggestions.length - 1 ? prev + 1 : 0;
        });
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (showSuggestions && store.suggestions.length > 0) {
        setActiveSuggestionIndex(function (prev) {
          return prev > 0 ? prev - 1 : store.suggestions.length - 1;
        });
      }
    }
  };

  const handleSuggestionSelect = function (queryString: string): void {
    setInputValue(queryString);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    props.onSearch(queryString);
  };

  const handleClear = function (): void {
    setInputValue("");
    store.setQueryText("");
    store.setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleScopeChange = function (e: React.ChangeEvent<HTMLSelectElement>): void {
    store.setScope(e.target.value as SearchScopeType);
  };

  const handleHistorySelect = function (queryText: string): void {
    setInputValue(queryText);
    setShowHistory(false);
    props.onSearch(queryText);
  };

  const handleFocus = function (): void {
    if (inputValue.length >= 3 && store.suggestions.length > 0) {
      setShowSuggestions(true);
    } else if (!inputValue && props.enableHistory && props.history.length > 0) {
      setShowHistory(true);
    }
  };

  const handleBlur = function (): void {
    // Delay to allow click on suggestion
    setTimeout(function () {
      setShowSuggestions(false);
      setShowHistory(false);
    }, 200);
  };

  // Build scope options
  const scopeOptions: React.ReactElement[] = [];
  SCOPE_LABELS.forEach(function (item) {
    scopeOptions.push(
      React.createElement("option", { key: item.key, value: item.key }, item.label)
    );
  });

  const hasExpanded = showSuggestions && store.suggestions.length > 0;
  const activeDescendant = activeSuggestionIndex >= 0
    ? suggestionsId + "-" + activeSuggestionIndex
    : undefined;

  return React.createElement(
    "div",
    {
      className: styles.searchBar,
      role: "search",
      "aria-label": "Search",
    },
    // Scope selector
    props.showScopeSelector
      ? React.createElement(
          "select",
          {
            className: styles.scopeSelector,
            value: store.query.scope,
            onChange: handleScopeChange,
            "aria-label": "Search scope",
          },
          scopeOptions
        )
      : undefined,
    // Input wrapper
    React.createElement(
      "div",
      { className: styles.inputWrapper },
      // Search icon
      React.createElement("span", { className: styles.searchIcon, "aria-hidden": "true" }, "\uD83D\uDD0D"),
      // Input
      React.createElement("input", {
        ref: inputRef,
        type: "text",
        className: styles.searchInput,
        placeholder: props.placeholderText,
        value: inputValue,
        onChange: handleInputChange,
        onKeyDown: handleKeyDown,
        onFocus: handleFocus,
        onBlur: handleBlur,
        role: "combobox",
        "aria-expanded": hasExpanded,
        "aria-haspopup": "listbox",
        "aria-controls": hasExpanded ? suggestionsId : undefined,
        "aria-activedescendant": activeDescendant,
        "aria-autocomplete": "list",
        autoComplete: "off",
      }),
      // Clear button
      inputValue
        ? React.createElement(
            "button",
            {
              type: "button",
              className: styles.clearButton,
              onClick: handleClear,
              "aria-label": "Clear search",
            },
            "\u2715"
          )
        : undefined,
      // Suggestions dropdown
      hasExpanded
        ? React.createElement(HyperSearchSuggestions, {
            suggestions: store.suggestions,
            activeSuggestionIndex: activeSuggestionIndex,
            suggestionsId: suggestionsId,
            onSelect: handleSuggestionSelect,
          })
        : undefined,
      // History dropdown (shown when input is empty and focused)
      showHistory && !hasExpanded
        ? React.createElement(HyperSearchHistory, {
            history: props.history,
            onSelect: handleHistorySelect,
            onClear: props.onClearHistory,
          })
        : undefined
    )
  );
};

export default HyperSearchBar;
