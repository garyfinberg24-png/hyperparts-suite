import * as React from "react";
import { LayoutMode, CardStyle } from "../models/IHyperSpotlightEnums";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

// ============================================================
// HyperSpotlight Demo Bar — Rich Panel (Variation 3)
// Collapsed: slim bar with DEMO badge + title + employee count
// Expanded: chip sections for layout, card style, feature toggles
// ============================================================

var LAYOUT_OPTIONS: Array<{ key: LayoutMode; label: string }> = [
  { key: LayoutMode.Grid, label: "Grid" },
  { key: LayoutMode.List, label: "List" },
  { key: LayoutMode.Carousel, label: "Carousel" },
  { key: LayoutMode.Tiled, label: "Tiled" },
  { key: LayoutMode.Masonry, label: "Masonry" },
  { key: LayoutMode.FeaturedHero, label: "Featured Hero" },
  { key: LayoutMode.Banner, label: "Banner" },
  { key: LayoutMode.Timeline, label: "Timeline" },
  { key: LayoutMode.WallOfFame, label: "Wall of Fame" },
];

var CARD_STYLE_OPTIONS: Array<{ key: CardStyle; label: string }> = [
  { key: CardStyle.Standard, label: "Standard" },
  { key: CardStyle.Overlay, label: "Overlay" },
  { key: CardStyle.Split, label: "Split" },
  { key: CardStyle.Compact, label: "Compact" },
  { key: CardStyle.Celebration, label: "Celebration" },
];

export interface IHyperSpotlightDemoBarProps {
  currentLayout: LayoutMode;
  currentCardStyle: CardStyle;
  employeeCount: number;
  expandedDetailsEnabled: boolean;
  departmentFilterEnabled: boolean;
  onLayoutChange: (layout: LayoutMode) => void;
  onCardStyleChange: (style: CardStyle) => void;
  onExpandedDetailsToggle: () => void;
  onDepartmentFilterToggle: () => void;
  onExitDemo: () => void;
}

var HyperSpotlightDemoBar: React.FC<IHyperSpotlightDemoBarProps> = function (props) {
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

  // Card style chips
  var cardStyleChips = CARD_STYLE_OPTIONS.map(function (opt) {
    var isActive = props.currentCardStyle === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onCardStyleChange(opt.key); },
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

  // Collapsed bar (always visible)
  var topRow = React.createElement("div", { className: styles.headerRow },
    React.createElement("span", { className: styles.demoBadge }, "DEMO"),
    React.createElement("span", { className: styles.wpName }, "HyperSpotlight Demo"),
    React.createElement("span", { className: styles.itemCount },
      String(props.employeeCount) + (props.employeeCount === 1 ? " employee" : " employees")
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
      // Card Style section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Card Style"),
        React.createElement("div", { className: styles.chipGroup }, cardStyleChips)
      ),
      // Features section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Features"),
        React.createElement("div", { className: styles.chipGroup },
          featureToggle("Expanded Details", props.expandedDetailsEnabled, props.onExpandedDetailsToggle),
          featureToggle("Dept Filter", props.departmentFilterEnabled, props.onDepartmentFilterToggle)
        )
      )
    );

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  }, topRow, sections);
};

export default HyperSpotlightDemoBar;
