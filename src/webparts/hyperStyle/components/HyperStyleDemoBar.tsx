import * as React from "react";
import type {
  StyleTemplate, HeaderStyle, FooterStyle, CardStyle,
} from "../models/IHyperStyleEnums";
import { getTemplateDisplayName } from "../models/IHyperStyleEnums";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

// ============================================================
// HyperStyle Demo Bar — Rich Panel (Variation 3)
// TWO states:
//   Collapsed (default): slim bar with DEMO badge + title + template name + Expand + Exit
//   Expanded: full panel with chip sections for template, header, footer, card style, and effect toggles
// ============================================================

var TEMPLATE_OPTIONS: Array<{ key: StyleTemplate; label: string }> = [
  { key: "corporateClassic", label: "Corporate" },
  { key: "modernMinimal", label: "Minimal" },
  { key: "darkExecutive", label: "Dark Exec" },
  { key: "glassmorphismPro", label: "Glass" },
  { key: "gradientVibes", label: "Gradient" },
  { key: "neonGlow", label: "Neon" },
  { key: "softPastels", label: "Pastels" },
  { key: "materialDesign", label: "Material" },
  { key: "brutalist", label: "Brutalist" },
  { key: "swissClean", label: "Swiss" },
  { key: "warmEarth", label: "Earth" },
  { key: "oceanBreeze", label: "Ocean" },
  { key: "forestDark", label: "Forest" },
  { key: "sunsetCoral", label: "Sunset" },
  { key: "techStartup", label: "Startup" },
];

var HEADER_OPTIONS: Array<{ key: HeaderStyle; label: string }> = [
  { key: "classic", label: "Classic" },
  { key: "modern", label: "Modern" },
  { key: "glassmorphism", label: "Glass" },
  { key: "gradient", label: "Gradient" },
  { key: "transparent", label: "Transparent" },
  { key: "minimal", label: "Minimal" },
];

var FOOTER_OPTIONS: Array<{ key: FooterStyle; label: string }> = [
  { key: "classic", label: "Classic" },
  { key: "modern", label: "Modern" },
  { key: "minimal", label: "Minimal" },
  { key: "expanded", label: "Expanded" },
];

var CARD_OPTIONS: Array<{ key: CardStyle; label: string }> = [
  { key: "standard", label: "Standard" },
  { key: "glass", label: "Glass" },
  { key: "neo", label: "Neo" },
  { key: "flat", label: "Flat" },
];

export interface IHyperStyleDemoBarProps {
  /** Current selected template (or empty string for none) */
  currentTemplate: StyleTemplate | "";
  /** Current header style */
  currentHeaderStyle: HeaderStyle;
  /** Current footer style */
  currentFooterStyle: FooterStyle;
  /** Current card style */
  currentCardStyle: CardStyle;
  /** Whether dark mode is enabled */
  darkMode: boolean;
  /** Whether scroll reveal is enabled */
  scrollReveal: boolean;
  /** Whether hover micro-animations are enabled */
  hoverMicro: boolean;
  /** Whether custom scrollbar is enabled */
  customScrollbar: boolean;
  /** Callback when template changes */
  onTemplateChange: (template: StyleTemplate) => void;
  /** Callback when header style changes */
  onHeaderStyleChange: (headerStyle: HeaderStyle) => void;
  /** Callback when footer style changes */
  onFooterStyleChange: (footerStyle: FooterStyle) => void;
  /** Callback when card style changes */
  onCardStyleChange: (cardStyle: CardStyle) => void;
  /** Callback to toggle dark mode */
  onToggleDarkMode: () => void;
  /** Callback to toggle scroll reveal */
  onToggleScrollReveal: () => void;
  /** Callback to toggle hover micro-animations */
  onToggleHoverMicro: () => void;
  /** Callback to toggle custom scrollbar */
  onToggleCustomScrollbar: () => void;
  /** Callback to exit demo mode */
  onExitDemo: () => void;
}

var HyperStyleDemoBar: React.FC<IHyperStyleDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var expanded = expandedState[0];
  var setExpanded = expandedState[1];

  // ── Template chips ──
  var templateChips = TEMPLATE_OPTIONS.map(function (opt) {
    var isActive = props.currentTemplate === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onTemplateChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // ── Header style chips ──
  var headerChips = HEADER_OPTIONS.map(function (opt) {
    var isActive = props.currentHeaderStyle === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onHeaderStyleChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // ── Footer style chips ──
  var footerChips = FOOTER_OPTIONS.map(function (opt) {
    var isActive = props.currentFooterStyle === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onFooterStyleChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // ── Card style chips ──
  var cardChips = CARD_OPTIONS.map(function (opt) {
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

  // ── Determine the template display name for the collapsed badge ──
  var templateLabel = props.currentTemplate
    ? getTemplateDisplayName(props.currentTemplate)
    : "None";

  // ── Top row (always visible) ──
  var topRow = React.createElement("div", { className: styles.headerRow },
    React.createElement("span", { className: styles.demoBadge }, "DEMO"),
    React.createElement("span", { className: styles.wpName }, "HyperStyle"),
    React.createElement("span", { className: styles.itemCount }, templateLabel),
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
      // Template section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Template"),
        React.createElement("div", { className: styles.chipGroup }, templateChips)
      ),
      // Header style section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Header"),
        React.createElement("div", { className: styles.chipGroup }, headerChips)
      ),
      // Footer style section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Footer"),
        React.createElement("div", { className: styles.chipGroup }, footerChips)
      ),
      // Card style section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Cards"),
        React.createElement("div", { className: styles.chipGroup }, cardChips)
      ),
      // Effect toggles section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Effects"),
        React.createElement("div", { className: styles.chipGroup },
          React.createElement("button", {
            className: styles.toggleChip + (props.darkMode ? " " + styles.toggleChipActive : ""),
            type: "button",
            onClick: function () { props.onToggleDarkMode(); },
            "aria-pressed": props.darkMode ? "true" : "false",
          },
            React.createElement("span", { className: styles.toggleDot + (props.darkMode ? " " + styles.toggleDotActive : "") }),
            "Dark Mode"
          ),
          React.createElement("button", {
            className: styles.toggleChip + (props.scrollReveal ? " " + styles.toggleChipActive : ""),
            type: "button",
            onClick: function () { props.onToggleScrollReveal(); },
            "aria-pressed": props.scrollReveal ? "true" : "false",
          },
            React.createElement("span", { className: styles.toggleDot + (props.scrollReveal ? " " + styles.toggleDotActive : "") }),
            "Scroll Reveal"
          ),
          React.createElement("button", {
            className: styles.toggleChip + (props.hoverMicro ? " " + styles.toggleChipActive : ""),
            type: "button",
            onClick: function () { props.onToggleHoverMicro(); },
            "aria-pressed": props.hoverMicro ? "true" : "false",
          },
            React.createElement("span", { className: styles.toggleDot + (props.hoverMicro ? " " + styles.toggleDotActive : "") }),
            "Hover Effects"
          ),
          React.createElement("button", {
            className: styles.toggleChip + (props.customScrollbar ? " " + styles.toggleChipActive : ""),
            type: "button",
            onClick: function () { props.onToggleCustomScrollbar(); },
            "aria-pressed": props.customScrollbar ? "true" : "false",
          },
            React.createElement("span", { className: styles.toggleDot + (props.customScrollbar ? " " + styles.toggleDotActive : "") }),
            "Scrollbar"
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

export default HyperStyleDemoBar;
