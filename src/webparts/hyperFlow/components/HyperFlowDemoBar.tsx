import * as React from "react";
import type {
  FlowMode,
  FlowVisualStyle,
  FlowFunctionalLayout,
  FlowColorTheme,
} from "../models";
import {
  getFlowModeDisplayName,
  getVisualStyleDisplayName,
  getFunctionalLayoutDisplayName,
  getColorThemeDisplayName,
} from "../models";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

// ============================================================
// HyperFlow Demo Bar — Rich Panel (Variation 3)
// Collapsed: DEMO badge + title + mode/style/theme summary
// Expanded: chip rows for Mode, Style/Layout (context), Theme, Features
// ============================================================

var MODE_OPTIONS: Array<{ key: FlowMode; label: string }> = [
  { key: "visual", label: "Visual Diagram" },
  { key: "functional", label: "Process Stepper" },
];

var VISUAL_STYLE_OPTIONS: Array<{ key: FlowVisualStyle; label: string }> = [
  { key: "pill", label: "Pill" },
  { key: "circle", label: "Circle" },
  { key: "card", label: "Card" },
  { key: "gradient-lane", label: "Gradient Lane" },
  { key: "metro-map", label: "Metro Map" },
];

var FUNCTIONAL_LAYOUT_OPTIONS: Array<{ key: FlowFunctionalLayout; label: string }> = [
  { key: "horizontal", label: "Horizontal" },
  { key: "timeline", label: "Timeline" },
  { key: "kanban", label: "Kanban" },
  { key: "checklist", label: "Checklist" },
];

var THEME_OPTIONS: Array<{ key: FlowColorTheme; label: string }> = [
  { key: "corporate", label: "Corporate" },
  { key: "purple-haze", label: "Purple Haze" },
  { key: "ocean", label: "Ocean" },
  { key: "sunset", label: "Sunset" },
  { key: "forest", label: "Forest" },
  { key: "monochrome", label: "Monochrome" },
];

export interface IHyperFlowDemoBarProps {
  // Current mode
  flowMode: FlowMode;
  // Visual mode options
  visualStyle: FlowVisualStyle;
  // Functional mode options
  functionalLayout: FlowFunctionalLayout;
  // Shared options
  colorTheme: FlowColorTheme;
  showStepNumbers: boolean;
  enableAnimation: boolean;
  showConnectorLabels: boolean;
  // Callbacks
  onFlowModeChange: (mode: FlowMode) => void;
  onVisualStyleChange: (style: FlowVisualStyle) => void;
  onFunctionalLayoutChange: (layout: FlowFunctionalLayout) => void;
  onColorThemeChange: (theme: FlowColorTheme) => void;
  onStepNumbersToggle: () => void;
  onAnimationToggle: () => void;
  onConnectorLabelsToggle: () => void;
  onOpenWizard: () => void;
  onExitDemo: () => void;
}

var HyperFlowDemoBar: React.FC<IHyperFlowDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // -- Build collapsed summary --
  var modeName = getFlowModeDisplayName(props.flowMode);
  var styleOrLayout = props.flowMode === "visual"
    ? getVisualStyleDisplayName(props.visualStyle)
    : getFunctionalLayoutDisplayName(props.functionalLayout);
  var themeName = getColorThemeDisplayName(props.colorTheme);
  var summary = modeName + " | " + styleOrLayout + " | " + themeName;

  // -- Mode chips --
  var modeChips = MODE_OPTIONS.map(function (opt) {
    var isActive = props.flowMode === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function (): void { props.onFlowModeChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // -- Style/Layout chips (context-dependent on flowMode) --
  var styleLayoutChips: React.ReactNode[];
  var styleLayoutLabel: string;

  if (props.flowMode === "visual") {
    styleLayoutLabel = "Style:";
    styleLayoutChips = VISUAL_STYLE_OPTIONS.map(function (opt) {
      var isActive = props.visualStyle === opt.key;
      var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
      return React.createElement("button", {
        key: opt.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onVisualStyleChange(opt.key); },
        "aria-pressed": isActive ? "true" : "false",
      }, opt.label);
    });
  } else {
    styleLayoutLabel = "Layout:";
    styleLayoutChips = FUNCTIONAL_LAYOUT_OPTIONS.map(function (opt) {
      var isActive = props.functionalLayout === opt.key;
      var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
      return React.createElement("button", {
        key: opt.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onFunctionalLayoutChange(opt.key); },
        "aria-pressed": isActive ? "true" : "false",
      }, opt.label);
    });
  }

  // -- Theme chips --
  var themeChips = THEME_OPTIONS.map(function (opt) {
    var isActive = props.colorTheme === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function (): void { props.onColorThemeChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // -- Feature toggle helper --
  var featureToggle = function (label: string, enabled: boolean, onToggle: () => void): React.ReactElement {
    var toggleClass = styles.toggleChip + (enabled ? " " + styles.toggleChipActive : "");
    var dotClass = styles.toggleDot + (enabled ? " " + styles.toggleDotActive : "");
    return React.createElement("button", {
      className: toggleClass,
      type: "button",
      onClick: function (): void { onToggle(); },
      "aria-pressed": enabled ? "true" : "false",
    },
      React.createElement("span", { className: dotClass }),
      label
    );
  };

  // -- Header row (always visible) --
  var topRow = React.createElement("div", { className: styles.headerRow },
    React.createElement("span", { className: styles.demoBadge }, "DEMO"),
    React.createElement("span", { className: styles.wpName }, "HyperFlow Preview"),
    !isExpanded ? React.createElement("span", { className: styles.collapsedSummary }, summary) : undefined,
    React.createElement("span", { className: styles.spacer }),
    React.createElement("button", {
      className: styles.expandToggle,
      type: "button",
      onClick: function (): void { setExpanded(function (v: boolean) { return !v; }); },
      "aria-expanded": isExpanded ? "true" : "false",
      "aria-label": isExpanded ? "Collapse demo panel" : "Expand demo panel",
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
  );

  // -- Expanded panel --
  var sections = !isExpanded ? undefined :
    React.createElement("div", { className: styles.expandPanel + " " + styles.expandPanelOpen },
      // Row 1 — Mode
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Mode:"),
        React.createElement("div", { className: styles.chipGroup }, modeChips)
      ),
      // Row 2 — Style or Layout (context-dependent)
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, styleLayoutLabel),
        React.createElement("div", { className: styles.chipGroup }, styleLayoutChips)
      ),
      // Row 3 — Theme
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Theme:"),
        React.createElement("div", { className: styles.chipGroup }, themeChips)
      ),
      // Row 4 — Features
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Features:"),
        React.createElement("div", { className: styles.chipGroup },
          featureToggle("Numbers", props.showStepNumbers, props.onStepNumbersToggle),
          featureToggle("Animation", props.enableAnimation, props.onAnimationToggle),
          featureToggle("Labels", props.showConnectorLabels, props.onConnectorLabelsToggle),
          React.createElement("button", {
            className: styles.chip,
            type: "button",
            onClick: function (): void { props.onOpenWizard(); },
          }, "\u2699 Wizard")
        )
      )
    );

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  }, topRow, sections);
};

export default HyperFlowDemoBar;
