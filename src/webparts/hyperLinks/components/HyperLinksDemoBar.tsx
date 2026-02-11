import * as React from "react";
import type { HyperLinksLayoutMode, HyperLinksHoverEffect, HyperLinksBorderRadius } from "../models";
import { useHyperLinksStore } from "../store/useHyperLinksStore";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

// ============================================================
// HyperLinks Demo Bar — Rich Panel (Variation 3)
// Collapsed by default: DEMO badge + title + summary + item count + Customize + Exit
// Expanded: chip rows for Layout, Hover effect, Border radius
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

function getLayoutLabel(key: HyperLinksLayoutMode): string {
  var label = "";
  LAYOUT_OPTIONS.forEach(function (opt) {
    if (opt.key === key) { label = opt.label; }
  });
  return label || String(key);
}

function getHoverLabel(key: HyperLinksHoverEffect): string {
  var label = "";
  HOVER_OPTIONS.forEach(function (opt) {
    if (opt.key === key) { label = opt.label; }
  });
  return label || String(key);
}

function getRadiusLabel(key: HyperLinksBorderRadius): string {
  var label = "";
  BORDER_RADIUS_OPTIONS.forEach(function (opt) {
    if (opt.key === key) { label = opt.label; }
  });
  return label || String(key);
}

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
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  var setRuntimeLayout = useHyperLinksStore(function (s) { return s.setRuntimeLayout; });
  var setRuntimeHoverEffect = useHyperLinksStore(function (s) { return s.setRuntimeHoverEffect; });
  var setRuntimeBorderRadius = useHyperLinksStore(function (s) { return s.setRuntimeBorderRadius; });
  var resetDemo = useHyperLinksStore(function (s) { return s.resetDemo; });

  var handleExitDemo = React.useCallback(function (): void {
    resetDemo();
    props.onExitDemo();
  }, [resetDemo, props.onExitDemo]);

  // -- Build collapsed summary --
  var summary = getLayoutLabel(props.currentLayout) +
    " | " + getHoverLabel(props.currentHoverEffect) +
    " | " + getRadiusLabel(props.currentBorderRadius);

  // -- Layout chips --
  var layoutChips: React.ReactNode[] = [];
  LAYOUT_OPTIONS.forEach(function (opt) {
    var isActive = props.currentLayout === opt.key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    layoutChips.push(
      React.createElement("button", {
        key: opt.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { setRuntimeLayout(opt.key); },
        "aria-pressed": isActive ? "true" : "false",
      }, opt.label)
    );
  });

  // -- Hover effect chips --
  var hoverChips: React.ReactNode[] = [];
  HOVER_OPTIONS.forEach(function (opt) {
    var isActive = props.currentHoverEffect === opt.key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    hoverChips.push(
      React.createElement("button", {
        key: opt.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { setRuntimeHoverEffect(opt.key); },
        "aria-pressed": isActive ? "true" : "false",
      }, opt.label)
    );
  });

  // -- Border radius chips --
  var borderChips: React.ReactNode[] = [];
  BORDER_RADIUS_OPTIONS.forEach(function (opt) {
    var isActive = props.currentBorderRadius === opt.key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    borderChips.push(
      React.createElement("button", {
        key: opt.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { setRuntimeBorderRadius(opt.key); },
        "aria-pressed": isActive ? "true" : "false",
      }, opt.label)
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
      React.createElement("span", { className: styles.wpName }, "HyperLinks Preview"),
      !isExpanded ? React.createElement("span", { className: styles.collapsedSummary }, summary) : undefined,
      React.createElement("span", { className: styles.itemCount },
        props.linkCount + " link" + (props.linkCount !== 1 ? "s" : "")
      ),
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
        onClick: handleExitDemo,
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

      // Border radius row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Radius:"),
        React.createElement("div", { className: styles.chipGroup }, borderChips)
      )
    )
  );
};

export default HyperLinksDemoBar;
