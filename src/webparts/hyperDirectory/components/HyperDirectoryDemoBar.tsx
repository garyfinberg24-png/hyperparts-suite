import * as React from "react";
import type { DirectoryLayoutMode, DirectoryCardStyle } from "../models";
import styles from "./HyperDirectoryDemoBar.module.scss";

// ============================================================
// HyperDirectory Demo Bar
// Displayed above the web part in published/view mode so that
// stakeholders can switch layouts, card styles, and features
// without opening edit mode.
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

export interface IHyperDirectoryDemoBarProps {
  layoutMode: DirectoryLayoutMode;
  cardStyle: DirectoryCardStyle;
  showPresence: boolean;
  onLayoutChange: (layout: DirectoryLayoutMode) => void;
  onCardStyleChange: (style: DirectoryCardStyle) => void;
  onPresenceToggle: () => void;
  onOpenWizard: () => void;
}

var HyperDirectoryDemoBar: React.FC<IHyperDirectoryDemoBarProps> = function (props) {
  var layoutButtons = LAYOUT_OPTIONS.map(function (opt) {
    var isActive = props.layoutMode === opt.key;
    return React.createElement("button", {
      key: opt.key,
      className: isActive ? styles.demoLayoutBtnActive : styles.demoLayoutBtn,
      onClick: function () { props.onLayoutChange(opt.key); },
      type: "button",
      "aria-pressed": isActive,
    }, opt.label);
  });

  var cardStyleButtons = CARD_STYLE_OPTIONS.map(function (opt) {
    var isActive = props.cardStyle === opt.key;
    return React.createElement("button", {
      key: opt.key,
      className: isActive ? styles.demoCardBtnActive : styles.demoCardBtn,
      onClick: function () { props.onCardStyleChange(opt.key); },
      type: "button",
      "aria-pressed": isActive,
    }, opt.label);
  });

  return React.createElement("div", { className: styles.demoBar, role: "toolbar", "aria-label": "Demo controls" },
    React.createElement("span", { className: styles.demoLabel }, "\uD83D\uDC65 Demo Mode"),
    React.createElement("span", { className: styles.demoDivider }),

    // Layout switcher
    React.createElement("span", { className: styles.demoGroupLabel }, "Layout:"),
    React.createElement("div", { className: styles.demoLayoutGroup }, layoutButtons),
    React.createElement("span", { className: styles.demoDivider }),

    // Card style switcher
    React.createElement("span", { className: styles.demoGroupLabel }, "Cards:"),
    React.createElement("div", { className: styles.demoCardStyleGroup }, cardStyleButtons),
    React.createElement("span", { className: styles.demoDivider }),

    // Presence toggle
    React.createElement("label", { className: styles.demoToggle },
      React.createElement("input", {
        type: "checkbox",
        checked: props.showPresence,
        onChange: function () { props.onPresenceToggle(); },
      }),
      " Presence"
    ),
    React.createElement("span", { className: styles.demoDivider }),

    // Wizard button
    React.createElement("button", {
      className: styles.demoWizardBtn,
      onClick: function () { props.onOpenWizard(); },
      type: "button",
    }, "\u2699 Wizard")
  );
};

export default HyperDirectoryDemoBar;
