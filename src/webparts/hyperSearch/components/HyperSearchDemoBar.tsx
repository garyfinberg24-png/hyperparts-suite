import * as React from "react";
import type { SearchScopeType } from "../models/ISearchQuery";
import type { ResultLayoutMode } from "../models/IHyperSearchV2";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

// ============================================================
// HyperSearch Demo Bar — Rich Panel (Variation 3)
// TWO states:
//   Collapsed (default): slim bar with DEMO badge + title + count + Expand + Exit
//   Expanded: full panel with chip sections for scope, layout, and feature toggles
// ============================================================

var SCOPE_OPTIONS: Array<{ key: SearchScopeType; label: string }> = [
  { key: "everything", label: "All" },
  { key: "sharepoint", label: "SharePoint" },
  { key: "onedrive", label: "OneDrive" },
  { key: "teams", label: "Teams" },
  { key: "exchange", label: "Messages" },
  { key: "currentSite", label: "This Site" },
];

var LAYOUT_OPTIONS: Array<{ key: ResultLayoutMode; label: string }> = [
  { key: "listRich", label: "Rich List" },
  { key: "listCompact", label: "Compact" },
  { key: "cardGrid", label: "Card Grid" },
  { key: "magazine", label: "Magazine" },
  { key: "table", label: "Table" },
  { key: "peopleGrid", label: "People" },
  { key: "mediaGallery", label: "Gallery" },
  { key: "conversation", label: "Conversation" },
  { key: "timeline", label: "Timeline" },
  { key: "previewPanel", label: "Preview" },
];

export interface IHyperSearchDemoBarProps {
  /** Current active search scope */
  currentScope: SearchScopeType;
  /** Current result layout mode */
  currentLayout: ResultLayoutMode;
  /** Whether the refiners panel is visible */
  showRefiners: boolean;
  /** Whether promoted results are shown */
  showPromoted: boolean;
  /** Whether preview panel is enabled */
  showPreview: boolean;
  /** Number of demo results displayed */
  resultCount: number;
  /** Callback when scope changes */
  onScopeChange: (scope: SearchScopeType) => void;
  /** Callback when layout changes */
  onLayoutChange: (layout: ResultLayoutMode) => void;
  /** Callback to toggle refiners panel */
  onToggleRefiners: () => void;
  /** Callback to toggle promoted results */
  onTogglePromoted: () => void;
  /** Callback to toggle preview panel */
  onTogglePreview: () => void;
  /** Callback to exit demo mode */
  onExitDemo: () => void;
}

var HyperSearchDemoBar: React.FC<IHyperSearchDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var expanded = expandedState[0];
  var setExpanded = expandedState[1];

  // ── Scope chips ──
  var scopeChips = SCOPE_OPTIONS.map(function (opt) {
    var isActive = props.currentScope === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onScopeChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // ── Layout chips ──
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

  // ── Top row (always visible) ──
  var topRow = React.createElement("div", { className: styles.headerRow },
    React.createElement("span", { className: styles.demoBadge }, "DEMO"),
    React.createElement("span", { className: styles.wpName }, "HyperSearch"),
    React.createElement("span", { className: styles.itemCount },
      props.resultCount + " result" + (props.resultCount !== 1 ? "s" : "")
    ),
    React.createElement("span", { className: styles.spacer }),
    React.createElement("button", {
      className: styles.expandToggle,
      type: "button",
      onClick: function () { setExpanded(!expanded); },
      "aria-expanded": expanded ? "true" : "false",
    }, expanded ? "Collapse" : "Expand"),
    React.createElement("button", {
      className: styles.exitButton,
      type: "button",
      onClick: function () { props.onExitDemo(); },
      "aria-label": "Exit demo mode",
    }, "Exit Demo")
  );

  // ── Expanded sections ──
  var sectionsEl: React.ReactElement | undefined = undefined;
  if (expanded) {
    sectionsEl = React.createElement("div", { className: styles.expandPanel + " " + styles.expandPanelOpen },
      // Scope section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Scope"),
        React.createElement("div", { className: styles.chipGroup }, scopeChips)
      ),
      // Layout section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Layout"),
        React.createElement("div", { className: styles.chipGroup }, layoutChips)
      ),
      // Feature toggles section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Features"),
        React.createElement("div", { className: styles.chipGroup },
          React.createElement("button", {
            className: styles.toggleChip + (props.showRefiners ? " " + styles.toggleChipActive : ""),
            type: "button",
            onClick: function () { props.onToggleRefiners(); },
            "aria-pressed": props.showRefiners ? "true" : "false",
          },
            React.createElement("span", { className: styles.toggleDot + (props.showRefiners ? " " + styles.toggleDotActive : "") }),
            "Refiners"
          ),
          React.createElement("button", {
            className: styles.toggleChip + (props.showPromoted ? " " + styles.toggleChipActive : ""),
            type: "button",
            onClick: function () { props.onTogglePromoted(); },
            "aria-pressed": props.showPromoted ? "true" : "false",
          },
            React.createElement("span", { className: styles.toggleDot + (props.showPromoted ? " " + styles.toggleDotActive : "") }),
            "Promoted"
          ),
          React.createElement("button", {
            className: styles.toggleChip + (props.showPreview ? " " + styles.toggleChipActive : ""),
            type: "button",
            onClick: function () { props.onTogglePreview(); },
            "aria-pressed": props.showPreview ? "true" : "false",
          },
            React.createElement("span", { className: styles.toggleDot + (props.showPreview ? " " + styles.toggleDotActive : "") }),
            "Preview"
          )
        )
      )
    );
  }

  // ── Assemble ──
  var children: React.ReactNode[] = [topRow];
  if (sectionsEl) {
    children.push(sectionsEl);
  }

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  }, children);
};

export default HyperSearchDemoBar;
