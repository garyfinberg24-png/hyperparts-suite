import * as React from "react";
import type { HyperNavLayoutMode, HyperNavHoverEffect, HyperNavTheme } from "../models";
import styles from "./HyperNavDemoBar.module.scss";

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
}

var LAYOUT_KEYS: HyperNavLayoutMode[] = [
  "topbar", "megaMenu", "sidebar", "tiles", "grid", "card", "list",
  "compact", "iconOnly", "dropdown", "tabbar", "hamburger", "breadcrumb", "cmdPalette", "fab",
];

var HOVER_KEYS: HyperNavHoverEffect[] = [
  "lift", "glow", "zoom", "darken", "underline", "bgfill", "none",
];

var THEME_KEYS: HyperNavTheme[] = ["light", "dark", "auto"];

export const HyperNavDemoBar: React.FC<IHyperNavDemoBarProps> = function (props) {
  var collapsed = React.useState(false);
  var isCollapsed = collapsed[0];
  var setCollapsed = collapsed[1];

  if (isCollapsed) {
    return React.createElement("div", { className: styles.demoBarCollapsed },
      React.createElement("button", {
        className: styles.demoToggle,
        onClick: function () { setCollapsed(false); },
        type: "button",
        "aria-label": "Expand demo controls",
      }, "\u2699\uFE0F Demo Controls")
    );
  }

  return React.createElement("div", { className: styles.demoBar },
    // Header
    React.createElement("div", { className: styles.demoHeader },
      React.createElement("span", { className: styles.demoTitle }, "\u2699\uFE0F HyperNav Demo Controls"),
      React.createElement("button", {
        className: styles.demoCollapse,
        onClick: function () { setCollapsed(true); },
        type: "button",
        "aria-label": "Collapse demo controls",
      }, "\u2715")
    ),

    // Layout selector
    React.createElement("div", { className: styles.demoSection },
      React.createElement("span", { className: styles.demoLabel }, "Layout"),
      React.createElement("select", {
        className: styles.demoSelect,
        value: props.layoutMode,
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
          props.onLayoutChange(e.target.value as HyperNavLayoutMode);
        },
      },
        LAYOUT_KEYS.map(function (key) {
          return React.createElement("option", { key: key, value: key }, key);
        })
      )
    ),

    // Hover effect selector
    React.createElement("div", { className: styles.demoSection },
      React.createElement("span", { className: styles.demoLabel }, "Hover"),
      React.createElement("select", {
        className: styles.demoSelect,
        value: props.hoverEffect,
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
          props.onHoverChange(e.target.value as HyperNavHoverEffect);
        },
      },
        HOVER_KEYS.map(function (key) {
          return React.createElement("option", { key: key, value: key }, key);
        })
      )
    ),

    // Theme selector
    React.createElement("div", { className: styles.demoSection },
      React.createElement("span", { className: styles.demoLabel }, "Theme"),
      React.createElement("div", { className: styles.demoChips },
        THEME_KEYS.map(function (key) {
          return React.createElement("button", {
            key: key,
            className: styles.demoChip + (props.navTheme === key ? " " + styles.demoChipActive : ""),
            onClick: function () { props.onThemeChange(key); },
            type: "button",
          }, key);
        })
      )
    ),

    // Feature toggles
    React.createElement("div", { className: styles.demoSection },
      React.createElement("span", { className: styles.demoLabel }, "Features"),
      React.createElement("div", { className: styles.demoToggles },
        React.createElement("label", { className: styles.demoToggleLabel },
          React.createElement("input", { type: "checkbox", checked: props.showSearch, onChange: props.onToggleSearch }),
          " Search"
        ),
        React.createElement("label", { className: styles.demoToggleLabel },
          React.createElement("input", { type: "checkbox", checked: props.enableGrouping, onChange: props.onToggleGrouping }),
          " Grouping"
        ),
        React.createElement("label", { className: styles.demoToggleLabel },
          React.createElement("input", { type: "checkbox", checked: props.enableTooltips, onChange: props.onToggleTooltips }),
          " Tooltips"
        ),
        React.createElement("label", { className: styles.demoToggleLabel },
          React.createElement("input", { type: "checkbox", checked: props.enableStickyNav, onChange: props.onToggleStickyNav }),
          " Sticky"
        )
      )
    )
  );
};
