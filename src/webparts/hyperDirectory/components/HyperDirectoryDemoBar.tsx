import * as React from "react";
import type { DirectoryLayoutMode, DirectoryCardStyle } from "../models";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

// ============================================================
// HyperDirectory Demo Bar — Rich Panel (Variation 3)
// Collapsed by default: DEMO badge + title + summary + Customize + Exit
// Expanded: chip rows for Layout, Card Style, Presence toggle
// ============================================================

var LAYOUT_OPTIONS: Array<{ key: DirectoryLayoutMode; label: string }> = [
  { key: "grid", label: "Grid" },
  { key: "list", label: "List" },
  { key: "compact", label: "Compact" },
  { key: "card", label: "Card" },
  { key: "masonry", label: "Masonry" },
  { key: "rollerDex", label: "RollerDex" },
  { key: "orgChart", label: "Org Chart" },
];

var CARD_STYLE_OPTIONS: Array<{ key: DirectoryCardStyle; label: string }> = [
  { key: "standard", label: "Standard" },
  { key: "detailed", label: "Detailed" },
  { key: "compact", label: "Compact" },
];

function getLayoutLabel(key: DirectoryLayoutMode): string {
  var label = "";
  LAYOUT_OPTIONS.forEach(function (opt) {
    if (opt.key === key) { label = opt.label; }
  });
  return label || String(key);
}

function getCardStyleLabel(key: DirectoryCardStyle): string {
  var label = "";
  CARD_STYLE_OPTIONS.forEach(function (opt) {
    if (opt.key === key) { label = opt.label; }
  });
  return label || String(key);
}

export interface IHyperDirectoryDemoBarProps {
  layoutMode: DirectoryLayoutMode;
  cardStyle: DirectoryCardStyle;
  showPresence: boolean;
  onLayoutChange: (layout: DirectoryLayoutMode) => void;
  onCardStyleChange: (style: DirectoryCardStyle) => void;
  onPresenceToggle: () => void;
  onOpenWizard: () => void;
  onExitDemo: () => void;
}

var HyperDirectoryDemoBar: React.FC<IHyperDirectoryDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // -- Build collapsed summary --
  var summary = getLayoutLabel(props.layoutMode) +
    " | " + getCardStyleLabel(props.cardStyle) +
    (props.showPresence ? " | Presence" : "");

  // -- Layout chips --
  var layoutChips: React.ReactNode[] = [];
  LAYOUT_OPTIONS.forEach(function (opt) {
    var isActive = props.layoutMode === opt.key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    layoutChips.push(
      React.createElement("button", {
        key: opt.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onLayoutChange(opt.key); },
        "aria-pressed": isActive ? "true" : "false",
      }, opt.label)
    );
  });

  // -- Card style chips --
  var cardStyleChips: React.ReactNode[] = [];
  CARD_STYLE_OPTIONS.forEach(function (opt) {
    var isActive = props.cardStyle === opt.key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    cardStyleChips.push(
      React.createElement("button", {
        key: opt.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onCardStyleChange(opt.key); },
        "aria-pressed": isActive ? "true" : "false",
      }, opt.label)
    );
  });

  // -- Presence toggle chip --
  var presenceToggleClass = props.showPresence
    ? styles.toggleChip + " " + styles.toggleChipActive
    : styles.toggleChip;
  var presenceDotClass = props.showPresence
    ? styles.toggleDot + " " + styles.toggleDotActive
    : styles.toggleDot;

  // -- Expanded panel class --
  var panelClass = isExpanded
    ? styles.expandPanel + " " + styles.expandPanelOpen
    : styles.expandPanel;

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  },
    // ---- Header row (always visible) ----
    React.createElement("div", { className: styles.headerRow },
      React.createElement("span", { className: styles.demoBadge }, "DEMO"),
      React.createElement("span", { className: styles.wpName }, "HyperDirectory Preview"),
      !isExpanded ? React.createElement("span", { className: styles.collapsedSummary }, summary) : undefined,
      React.createElement("span", { className: styles.spacer }),
      React.createElement("button", {
        className: styles.expandToggle,
        type: "button",
        onClick: function (): void { setExpanded(!isExpanded); },
        "aria-expanded": isExpanded ? "true" : "false",
      },
        isExpanded ? "Collapse" : "Customize",
        React.createElement("span", {
          className: styles.chevron + (isExpanded ? " " + styles.chevronExpanded : ""),
        }, "\u25BC")
      ),
      React.createElement("button", {
        className: styles.exitButton,
        type: "button",
        onClick: props.onExitDemo,
        "aria-label": "Exit demo mode",
      }, "\u2715 Exit Demo")
    ),

    // ---- Expandable panel ----
    React.createElement("div", { className: panelClass },
      // Layout row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Layout:"),
        React.createElement("div", { className: styles.chipGroup }, layoutChips)
      ),

      // Card style row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Cards:"),
        React.createElement("div", { className: styles.chipGroup }, cardStyleChips)
      ),

      // Features row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Features:"),
        React.createElement("div", { className: styles.chipGroup },
          React.createElement("button", {
            className: presenceToggleClass,
            type: "button",
            onClick: function (): void { props.onPresenceToggle(); },
            "aria-pressed": props.showPresence ? "true" : "false",
          },
            React.createElement("span", { className: presenceDotClass }),
            "Presence"
          ),
          React.createElement("button", {
            className: styles.chip,
            type: "button",
            onClick: function (): void { props.onOpenWizard(); },
          }, "\u2699 Wizard")
        )
      )
    )
  );
};

export default HyperDirectoryDemoBar;
