import * as React from "react";
import type { ISearchHistoryEntry } from "../models";
import { DEMO_TRENDING, DEMO_ALSO_SEARCHED } from "../constants/demoData";
import styles from "./HyperSearchZeroQuery.module.scss";

export interface IHyperSearchZeroQueryProps {
  history: ISearchHistoryEntry[];
  savedSearches: string[];
  accentColor: string;
  onSearchClick: (query: string) => void;
  enableSavedSearches: boolean;
}

var HyperSearchZeroQuery: React.FC<IHyperSearchZeroQueryProps> = function (props) {
  // Build trending items
  var trendingItems: React.ReactElement[] = [];
  DEMO_TRENDING.forEach(function (item, idx) {
    trendingItems.push(
      React.createElement("button", {
        key: "trend-" + String(idx),
        className: styles.trendingItem,
        onClick: function () { props.onSearchClick(item.term); },
        type: "button",
      },
        React.createElement("span", { className: styles.trendingRank }, String(idx + 1)),
        React.createElement("span", { className: styles.trendingTerm }, item.term),
        React.createElement("span", {
          className: styles.trendingChange,
          style: { color: props.accentColor },
        }, item.change)
      )
    );
  });

  // Build recent searches (from history)
  var recentItems: React.ReactElement[] = [];
  var historySlice = props.history.length > 5
    ? props.history.slice(props.history.length - 5)
    : props.history;
  historySlice.forEach(function (entry, idx) {
    recentItems.push(
      React.createElement("button", {
        key: "recent-" + String(idx),
        className: styles.recentItem,
        onClick: function () { props.onSearchClick(entry.queryText); },
        type: "button",
      },
        React.createElement("span", { className: styles.recentIcon }, "\uD83D\uDD52"),
        React.createElement("span", { className: styles.recentText }, entry.queryText),
        entry.resultCount !== undefined
          ? React.createElement("span", { className: styles.recentCount }, String(entry.resultCount) + " results")
          : undefined
      )
    );
  });

  // Build saved searches
  var savedItems: React.ReactElement[] = [];
  if (props.enableSavedSearches && props.savedSearches.length > 0) {
    props.savedSearches.forEach(function (query, idx) {
      savedItems.push(
        React.createElement("button", {
          key: "saved-" + String(idx),
          className: styles.recentItem,
          onClick: function () { props.onSearchClick(query); },
          type: "button",
        },
          React.createElement("span", { className: styles.recentIcon }, "\uD83D\uDD16"),
          React.createElement("span", { className: styles.recentText }, query)
        )
      );
    });
  }

  // Build "Also searched for" suggestions
  var alsoSearched: React.ReactElement[] = [];
  DEMO_ALSO_SEARCHED.forEach(function (term, idx) {
    alsoSearched.push(
      React.createElement("button", {
        key: "also-" + String(idx),
        className: styles.suggestionChip,
        onClick: function () { props.onSearchClick(term); },
        type: "button",
      }, term)
    );
  });

  return React.createElement("div", { className: styles.zeroQuery },
    // Trending section
    React.createElement("div", { className: styles.section },
      React.createElement("h3", { className: styles.sectionTitle },
        React.createElement("span", { className: styles.sectionIcon }, "\uD83D\uDD25"),
        "Trending Now"
      ),
      React.createElement("div", { className: styles.trendingList }, trendingItems)
    ),
    // Recent searches
    recentItems.length > 0
      ? React.createElement("div", { className: styles.section },
          React.createElement("h3", { className: styles.sectionTitle },
            React.createElement("span", { className: styles.sectionIcon }, "\uD83D\uDD52"),
            "Recent Searches"
          ),
          React.createElement("div", { className: styles.recentList }, recentItems)
        )
      : undefined,
    // Saved searches
    savedItems.length > 0
      ? React.createElement("div", { className: styles.section },
          React.createElement("h3", { className: styles.sectionTitle },
            React.createElement("span", { className: styles.sectionIcon }, "\uD83D\uDD16"),
            "Saved Searches"
          ),
          React.createElement("div", { className: styles.recentList }, savedItems)
        )
      : undefined,
    // Also searched for
    React.createElement("div", { className: styles.section },
      React.createElement("h3", { className: styles.sectionTitle },
        React.createElement("span", { className: styles.sectionIcon }, "\uD83D\uDCA1"),
        "Suggested Searches"
      ),
      React.createElement("div", { className: styles.suggestionChips }, alsoSearched)
    )
  );
};

export default HyperSearchZeroQuery;
