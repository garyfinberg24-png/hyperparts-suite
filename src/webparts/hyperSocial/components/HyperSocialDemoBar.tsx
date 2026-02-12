import * as React from "react";
import type { SocialLayoutMode, SocialSortMode } from "../models";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

var LAYOUT_OPTIONS: Array<{ key: SocialLayoutMode; label: string }> = [
  { key: "feed", label: "Feed" },
  { key: "grid", label: "Grid" },
  { key: "compact", label: "Compact" },
  { key: "wall", label: "Wall" },
];

var SORT_OPTIONS: Array<{ key: SocialSortMode; label: string }> = [
  { key: "latest", label: "Latest" },
  { key: "popular", label: "Popular" },
  { key: "trending", label: "Trending" },
];

export interface IHyperSocialDemoBarProps {
  currentLayout: SocialLayoutMode;
  currentSort: SocialSortMode;
  postCount: number;
  reactionsEnabled: boolean;
  commentsEnabled: boolean;
  hashtagsEnabled: boolean;
  onLayoutChange: (layout: SocialLayoutMode) => void;
  onSortChange: (sort: SocialSortMode) => void;
  onReactionsToggle: () => void;
  onCommentsToggle: () => void;
  onHashtagsToggle: () => void;
  onExitDemo: () => void;
}

var HyperSocialDemoBar: React.FC<IHyperSocialDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // Layout chips
  var layoutChips = LAYOUT_OPTIONS.map(function (opt) {
    var isActive = props.currentLayout === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onLayoutChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // Sort chips
  var sortChips = SORT_OPTIONS.map(function (opt) {
    var isActive = props.currentSort === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onSortChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // Feature toggle helper
  var featureToggle = function (label: string, enabled: boolean, onToggle: () => void): React.ReactElement {
    var toggleClass = styles.toggleChip + (enabled ? " " + styles.toggleChipActive : "");
    var dotClass = styles.toggleDot + (enabled ? " " + styles.toggleDotActive : "");
    return React.createElement("button", {
      className: toggleClass,
      type: "button",
      onClick: function () { onToggle(); },
      "aria-pressed": enabled ? "true" : "false",
    },
      React.createElement("span", { className: dotClass }),
      label
    );
  };

  // Header row (always visible)
  var topRow = React.createElement("div", { className: styles.headerRow },
    React.createElement("span", { className: styles.demoBadge }, "DEMO"),
    React.createElement("span", { className: styles.wpName }, "HyperSocial"),
    React.createElement("span", { className: styles.itemCount },
      props.postCount + (props.postCount === 1 ? " post" : " posts")
    ),
    React.createElement("span", { className: styles.spacer }),
    React.createElement("button", {
      className: styles.expandToggle,
      type: "button",
      onClick: function () { setExpanded(function (v: boolean) { return !v; }); },
      "aria-label": isExpanded ? "Collapse demo panel" : "Expand demo panel",
    }, isExpanded ? "Collapse" : "Expand"),
    React.createElement("button", {
      className: styles.exitButton,
      type: "button",
      onClick: props.onExitDemo,
      "aria-label": "Exit demo mode",
    }, "Exit Demo")
  );

  // Expanded sections
  var sections = !isExpanded ? undefined :
    React.createElement("div", { className: styles.expandPanel + " " + styles.expandPanelOpen },
      // Layout section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Layout"),
        React.createElement("div", { className: styles.chipGroup }, layoutChips)
      ),
      // Sort section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Sort"),
        React.createElement("div", { className: styles.chipGroup }, sortChips)
      ),
      // Features section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Features"),
        React.createElement("div", { className: styles.chipGroup },
          featureToggle("Reactions", props.reactionsEnabled, props.onReactionsToggle),
          featureToggle("Comments", props.commentsEnabled, props.onCommentsToggle),
          featureToggle("Hashtags", props.hashtagsEnabled, props.onHashtagsToggle)
        )
      )
    );

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  }, topRow, sections);
};

export default HyperSocialDemoBar;
