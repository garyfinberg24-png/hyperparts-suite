import * as React from "react";
import type { HyperTabsDisplayMode, HyperTabsTabStyle, HyperTabsAlignment } from "../models";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

// ============================================================
// HyperTabs Demo Bar — Rich Panel (Variation 3) V2
// TWO states:
//   Collapsed (default): slim bar with DEMO badge + title + panel count + Expand + Exit
//   Expanded: full panel with chip sections for display mode, tab style, alignment, and feature toggles
// ============================================================

var DISPLAY_MODE_OPTIONS: Array<{ key: HyperTabsDisplayMode; label: string }> = [
  { key: "tabs", label: "Tabs" },
  { key: "accordion", label: "Accordion" },
  { key: "wizard", label: "Wizard" },
  { key: "scroll-spy", label: "Scroll Spy" },
];

var TAB_STYLE_OPTIONS: Array<{ key: HyperTabsTabStyle; label: string }> = [
  { key: "horizontal", label: "Horizontal" },
  { key: "vertical", label: "Vertical" },
  { key: "pill", label: "Pill" },
  { key: "underline", label: "Underline" },
  { key: "enclosed", label: "Enclosed" },
  { key: "enclosed-colored", label: "Enclosed Color" },
  { key: "floating", label: "Floating" },
  { key: "segmented", label: "Segmented" },
  { key: "vertical-pill", label: "Vertical Pill" },
];

var ALIGNMENT_OPTIONS: Array<{ key: HyperTabsAlignment; label: string }> = [
  { key: "left", label: "Left" },
  { key: "center", label: "Center" },
  { key: "fitted", label: "Fitted" },
];

export interface IHyperTabsDemoBarProps {
  /** Current display mode */
  currentDisplayMode: HyperTabsDisplayMode;
  /** Current tab style */
  currentTabStyle: HyperTabsTabStyle;
  /** Current tab alignment */
  currentAlignment: HyperTabsAlignment;
  /** Whether deep linking is enabled */
  deepLinking: boolean;
  /** Whether responsive collapse is enabled */
  responsiveCollapse: boolean;
  /** Whether animations are enabled */
  animations: boolean;
  /** Whether auto-rotate is enabled */
  autoRotate: boolean;
  /** Whether tab overflow is enabled */
  enableOverflow: boolean;
  /** Whether tab search is enabled */
  enableSearch: boolean;
  /** Number of panels / tabs */
  panelCount: number;
  /** Callback when display mode changes */
  onDisplayModeChange: (mode: HyperTabsDisplayMode) => void;
  /** Callback when tab style changes */
  onTabStyleChange: (tabStyle: HyperTabsTabStyle) => void;
  /** Callback when alignment changes */
  onAlignmentChange: (alignment: HyperTabsAlignment) => void;
  /** Callback to toggle deep linking */
  onToggleDeepLinking: () => void;
  /** Callback to toggle responsive collapse */
  onToggleResponsiveCollapse: () => void;
  /** Callback to toggle animations */
  onToggleAnimations: () => void;
  /** Callback to toggle auto-rotate */
  onToggleAutoRotate: () => void;
  /** Callback to toggle tab overflow */
  onToggleOverflow: () => void;
  /** Callback to toggle tab search */
  onToggleSearch: () => void;
  /** Callback to exit demo mode */
  onExitDemo: () => void;
}

var HyperTabsDemoBar: React.FC<IHyperTabsDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var expanded = expandedState[0];
  var setExpanded = expandedState[1];

  // ── Display mode chips ──
  var displayModeChips = DISPLAY_MODE_OPTIONS.map(function (opt) {
    var isActive = props.currentDisplayMode === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onDisplayModeChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // ── Tab style chips (only relevant in tabs mode) ──
  var tabStyleChips = TAB_STYLE_OPTIONS.map(function (opt) {
    var isActive = props.currentTabStyle === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onTabStyleChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
      disabled: props.currentDisplayMode !== "tabs",
    }, opt.label);
  });

  // ── Alignment chips (only relevant in tabs mode) ──
  var alignmentChips = ALIGNMENT_OPTIONS.map(function (opt) {
    var isActive = props.currentAlignment === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onAlignmentChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
      disabled: props.currentDisplayMode !== "tabs",
    }, opt.label);
  });

  // ── Top row (always visible) ──
  var topRow = React.createElement("div", { className: styles.headerRow },
    React.createElement("span", { className: styles.demoBadge }, "DEMO"),
    React.createElement("span", { className: styles.wpName }, "HyperTabs"),
    React.createElement("span", { className: styles.itemCount },
      props.panelCount + " panel" + (props.panelCount !== 1 ? "s" : "")
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
      // Display mode section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Mode"),
        React.createElement("div", { className: styles.chipGroup }, displayModeChips)
      ),
      // Tab style section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Style"),
        React.createElement("div", { className: styles.chipGroup }, tabStyleChips)
      ),
      // Alignment section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Align"),
        React.createElement("div", { className: styles.chipGroup }, alignmentChips)
      ),
      // Feature toggles section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Features"),
        React.createElement("div", { className: styles.chipGroup },
          React.createElement("button", {
            className: styles.toggleChip + (props.deepLinking ? " " + styles.toggleChipActive : ""),
            type: "button",
            onClick: function () { props.onToggleDeepLinking(); },
            "aria-pressed": props.deepLinking ? "true" : "false",
          },
            React.createElement("span", { className: styles.toggleDot + (props.deepLinking ? " " + styles.toggleDotActive : "") }),
            "Deep Linking"
          ),
          React.createElement("button", {
            className: styles.toggleChip + (props.responsiveCollapse ? " " + styles.toggleChipActive : ""),
            type: "button",
            onClick: function () { props.onToggleResponsiveCollapse(); },
            "aria-pressed": props.responsiveCollapse ? "true" : "false",
          },
            React.createElement("span", { className: styles.toggleDot + (props.responsiveCollapse ? " " + styles.toggleDotActive : "") }),
            "Responsive"
          ),
          React.createElement("button", {
            className: styles.toggleChip + (props.animations ? " " + styles.toggleChipActive : ""),
            type: "button",
            onClick: function () { props.onToggleAnimations(); },
            "aria-pressed": props.animations ? "true" : "false",
          },
            React.createElement("span", { className: styles.toggleDot + (props.animations ? " " + styles.toggleDotActive : "") }),
            "Animations"
          ),
          React.createElement("button", {
            className: styles.toggleChip + (props.autoRotate ? " " + styles.toggleChipActive : ""),
            type: "button",
            onClick: function () { props.onToggleAutoRotate(); },
            "aria-pressed": props.autoRotate ? "true" : "false",
          },
            React.createElement("span", { className: styles.toggleDot + (props.autoRotate ? " " + styles.toggleDotActive : "") }),
            "Auto Rotate"
          ),
          React.createElement("button", {
            className: styles.toggleChip + (props.enableOverflow ? " " + styles.toggleChipActive : ""),
            type: "button",
            onClick: function () { props.onToggleOverflow(); },
            "aria-pressed": props.enableOverflow ? "true" : "false",
          },
            React.createElement("span", { className: styles.toggleDot + (props.enableOverflow ? " " + styles.toggleDotActive : "") }),
            "Overflow"
          ),
          React.createElement("button", {
            className: styles.toggleChip + (props.enableSearch ? " " + styles.toggleChipActive : ""),
            type: "button",
            onClick: function () { props.onToggleSearch(); },
            "aria-pressed": props.enableSearch ? "true" : "false",
          },
            React.createElement("span", { className: styles.toggleDot + (props.enableSearch ? " " + styles.toggleDotActive : "") }),
            "Search"
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

export default HyperTabsDemoBar;
