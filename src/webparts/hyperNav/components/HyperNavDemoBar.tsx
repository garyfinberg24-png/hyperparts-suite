import * as React from "react";
import type { HyperNavLayoutMode, HyperNavHoverEffect, HyperNavTheme } from "../models";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

export interface IHyperNavDemoBarProps {
  layoutMode: HyperNavLayoutMode;
  hoverEffect: HyperNavHoverEffect;
  navTheme: HyperNavTheme;
  showSearch: boolean;
  enableGrouping: boolean;
  enableTooltips: boolean;
  enableStickyNav: boolean;
  onLayoutChange: (mode: HyperNavLayoutMode) => void;
  onHoverChange: (effect: HyperNavHoverEffect) => void;
  onThemeChange: (theme: HyperNavTheme) => void;
  onToggleSearch: () => void;
  onToggleGrouping: () => void;
  onToggleTooltips: () => void;
  onToggleStickyNav: () => void;
  onExitDemo?: () => void;
}

var LAYOUT_KEYS: HyperNavLayoutMode[] = [
  "topbar", "megaMenu", "sidebar", "tiles", "grid", "card", "list",
  "compact", "iconOnly", "dropdown", "tabbar", "hamburger", "breadcrumb", "cmdPalette", "fab",
];

var HOVER_KEYS: HyperNavHoverEffect[] = [
  "lift", "glow", "zoom", "darken", "underline", "bgfill", "none",
];

var THEME_KEYS: HyperNavTheme[] = ["light", "dark", "auto"];

function getLayoutLabel(key: HyperNavLayoutMode): string {
  switch (key) {
    case "topbar": return "Top Bar";
    case "megaMenu": return "Mega Menu";
    case "sidebar": return "Sidebar";
    case "tiles": return "Tiles";
    case "grid": return "Grid";
    case "card": return "Card";
    case "list": return "List";
    case "compact": return "Compact";
    case "iconOnly": return "Icon Only";
    case "dropdown": return "Dropdown";
    case "tabbar": return "Tab Bar";
    case "hamburger": return "Hamburger";
    case "breadcrumb": return "Breadcrumb";
    case "cmdPalette": return "Cmd Palette";
    case "fab": return "FAB";
    default: return String(key);
  }
}

function getHoverLabel(key: HyperNavHoverEffect): string {
  return key.charAt(0).toUpperCase() + key.substring(1);
}

function getThemeLabel(key: HyperNavTheme): string {
  return key.charAt(0).toUpperCase() + key.substring(1);
}

export var HyperNavDemoBar: React.FC<IHyperNavDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // -- Build collapsed summary --
  var summary = getLayoutLabel(props.layoutMode) +
    " | " + getHoverLabel(props.hoverEffect) +
    " | " + getThemeLabel(props.navTheme);

  // -- Layout chips --
  var layoutChips: React.ReactNode[] = [];
  LAYOUT_KEYS.forEach(function (key) {
    var isActive = props.layoutMode === key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    layoutChips.push(
      React.createElement("button", {
        key: key,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onLayoutChange(key); },
        "aria-pressed": isActive ? "true" : "false",
      }, getLayoutLabel(key))
    );
  });

  // -- Hover effect chips --
  var hoverChips: React.ReactNode[] = [];
  HOVER_KEYS.forEach(function (key) {
    var isActive = props.hoverEffect === key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    hoverChips.push(
      React.createElement("button", {
        key: key,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onHoverChange(key); },
        "aria-pressed": isActive ? "true" : "false",
      }, getHoverLabel(key))
    );
  });

  // -- Theme chips --
  var themeChips: React.ReactNode[] = [];
  THEME_KEYS.forEach(function (key) {
    var isActive = props.navTheme === key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    themeChips.push(
      React.createElement("button", {
        key: key,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onThemeChange(key); },
        "aria-pressed": isActive ? "true" : "false",
      }, getThemeLabel(key))
    );
  });

  // -- Feature toggle chips --
  var featureToggles: Array<{ label: string; active: boolean; onToggle: () => void }> = [
    { label: "Search", active: props.showSearch, onToggle: props.onToggleSearch },
    { label: "Grouping", active: props.enableGrouping, onToggle: props.onToggleGrouping },
    { label: "Tooltips", active: props.enableTooltips, onToggle: props.onToggleTooltips },
    { label: "Sticky", active: props.enableStickyNav, onToggle: props.onToggleStickyNav },
  ];

  var toggleChips: React.ReactNode[] = [];
  featureToggles.forEach(function (toggle) {
    var chipClass = toggle.active
      ? styles.toggleChip + " " + styles.toggleChipActive
      : styles.toggleChip;
    var dotClass = toggle.active
      ? styles.toggleDot + " " + styles.toggleDotActive
      : styles.toggleDot;

    toggleChips.push(
      React.createElement("button", {
        key: toggle.label,
        className: chipClass,
        type: "button",
        onClick: toggle.onToggle,
        "aria-pressed": toggle.active ? "true" : "false",
      },
        React.createElement("span", { className: dotClass }),
        toggle.label
      )
    );
  });

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
      React.createElement("span", { className: styles.wpName }, "HyperNav Preview"),
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
        onClick: function (): void { if (props.onExitDemo) { props.onExitDemo(); } },
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

      // Hover effect row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Hover:"),
        React.createElement("div", { className: styles.chipGroup }, hoverChips)
      ),

      // Theme row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Theme:"),
        React.createElement("div", { className: styles.chipGroup }, themeChips)
      ),

      // Features row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Features:"),
        React.createElement("div", { className: styles.chipGroup }, toggleChips)
      )
    )
  );
};
