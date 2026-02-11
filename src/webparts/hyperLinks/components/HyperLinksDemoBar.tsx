import * as React from "react";
import type { HyperLinksLayoutMode, HyperLinksHoverEffect, HyperLinksBorderRadius } from "../models";
import { useHyperLinksStore } from "../store/useHyperLinksStore";
import styles from "./HyperLinksDemoBar.module.scss";

// ============================================================
// HyperLinks Demo Bar
// Displayed above the web part when demo mode is active so that
// stakeholders can switch layouts, hover effects, and border
// radius without opening edit mode or the property pane.
// ============================================================

var LAYOUT_OPTIONS: Array<{ key: HyperLinksLayoutMode; label: string }> = [
  { key: "compact", label: "Compact" },
  { key: "grid", label: "Grid" },
  { key: "list", label: "List" },
  { key: "button", label: "Button" },
  { key: "filmstrip", label: "Filmstrip" },
  { key: "tiles", label: "Tiles" },
  { key: "card", label: "Card" },
  { key: "iconGrid", label: "Icon Grid" },
];

var HOVER_OPTIONS: Array<{ key: HyperLinksHoverEffect; label: string }> = [
  { key: "none", label: "None" },
  { key: "lift", label: "Lift" },
  { key: "glow", label: "Glow" },
  { key: "zoom", label: "Zoom" },
  { key: "darken", label: "Darken" },
  { key: "pulse", label: "Pulse" },
  { key: "bounce", label: "Bounce" },
  { key: "shake", label: "Shake" },
  { key: "rotate", label: "Rotate" },
  { key: "shimmer", label: "Shimmer" },
];

var BORDER_RADIUS_OPTIONS: Array<{ key: HyperLinksBorderRadius; label: string }> = [
  { key: "none", label: "None" },
  { key: "small", label: "Small" },
  { key: "medium", label: "Medium" },
  { key: "large", label: "Large" },
  { key: "round", label: "Round" },
];

export interface IHyperLinksDemoBarProps {
  /** Current effective layout mode (prop value or runtime override) */
  currentLayout: HyperLinksLayoutMode;
  /** Current effective hover effect */
  currentHoverEffect: HyperLinksHoverEffect;
  /** Current effective border radius */
  currentBorderRadius: HyperLinksBorderRadius;
  /** Total number of links displayed */
  linkCount: number;
  /** Callback to exit demo mode */
  onExitDemo: () => void;
}

var HyperLinksDemoBar: React.FC<IHyperLinksDemoBarProps> = function (props) {
  var setRuntimeLayout = useHyperLinksStore(function (s) { return s.setRuntimeLayout; });
  var setRuntimeHoverEffect = useHyperLinksStore(function (s) { return s.setRuntimeHoverEffect; });
  var setRuntimeBorderRadius = useHyperLinksStore(function (s) { return s.setRuntimeBorderRadius; });
  var resetDemo = useHyperLinksStore(function (s) { return s.resetDemo; });

  var handleExitDemo = React.useCallback(function (): void {
    resetDemo();
    props.onExitDemo();
  }, [resetDemo, props.onExitDemo]);

  // ── Layout chips ──
  var layoutChips = LAYOUT_OPTIONS.map(function (opt) {
    var isActive = props.currentLayout === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { setRuntimeLayout(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // ── Hover effect chips ──
  var hoverChips = HOVER_OPTIONS.map(function (opt) {
    var isActive = props.currentHoverEffect === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { setRuntimeHoverEffect(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // ── Border radius chips ──
  var borderChips = BORDER_RADIUS_OPTIONS.map(function (opt) {
    var isActive = props.currentBorderRadius === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { setRuntimeBorderRadius(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  },
    // ── Top row: badge + title + count + exit button ──
    React.createElement("div", { className: styles.demoBarTopRow },
      React.createElement("span", { className: styles.demoBadge }, "DEMO"),
      React.createElement("span", { className: styles.demoTitle }, "HyperLinks Preview"),
      React.createElement("span", { className: styles.itemCountBadge },
        props.linkCount + " link" + (props.linkCount !== 1 ? "s" : "")
      ),
      React.createElement("button", {
        className: styles.exitButton,
        type: "button",
        onClick: handleExitDemo,
        "aria-label": "Exit demo mode",
      }, "Exit Demo")
    ),

    // ── Layout section ──
    React.createElement("div", { className: styles.demoSection },
      React.createElement("span", { className: styles.sectionLabel }, "Layout"),
      React.createElement("div", { className: styles.chipGroup }, layoutChips)
    ),

    // ── Hover effect section ──
    React.createElement("div", { className: styles.demoSection },
      React.createElement("span", { className: styles.sectionLabel }, "Hover"),
      React.createElement("div", { className: styles.chipGroup }, hoverChips)
    ),

    // ── Border radius section ──
    React.createElement("div", { className: styles.demoSection },
      React.createElement("span", { className: styles.sectionLabel }, "Radius"),
      React.createElement("div", { className: styles.chipGroup }, borderChips)
    )
  );
};

export default HyperLinksDemoBar;
