import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IStyleWizardState } from "../../models/IHyperStyleWizardState";
import type { WpHeaderStyle } from "../../models";
import styles from "./WizardSteps.module.scss";

var WP_HEADER_STYLES: Array<{ key: WpHeaderStyle; label: string; icon: string }> = [
  { key: "standard", label: "Standard", icon: "\uD83D\uDCDD" },
  { key: "accent-bar", label: "Accent Bar", icon: "\uD83C\uDFA8" },
  { key: "bordered", label: "Full Border", icon: "\uD83D\uDD32" },
  { key: "underlined", label: "Underlined", icon: "\uD83D\uDCCF" },
  { key: "shadowed", label: "Shadowed", icon: "\uD83C\uDF13" },
  { key: "gradient-bar", label: "Gradient Bar", icon: "\uD83C\uDF08" },
  { key: "icon-accent", label: "Icon Accent", icon: "\u2B55" },
];

var EffectsStep: React.FC<IWizardStepProps<IStyleWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  // Accordion state for collapsible sections
  var expandedState = React.useState<Record<string, boolean>>({ wpStyling: true });
  var expanded = expandedState[0];
  var setExpanded = expandedState[1];

  var toggleSection = React.useCallback(function (key: string): void {
    setExpanded(function (prev) {
      var next: Record<string, boolean> = {};
      var keys = Object.keys(prev);
      keys.forEach(function (k) { next[k] = prev[k]; });
      next[key] = !prev[key];
      return next;
    });
  }, []);

  // Effect toggle helper
  function effectToggle(key: keyof IStyleWizardState, icon: string, title: string, desc: string, val: boolean): React.ReactElement {
    return React.createElement("div", { className: styles.effectToggleRow, key: key as string },
      React.createElement("div", { className: styles.effectToggleLeft },
        React.createElement("span", { className: styles.effectToggleIcon }, icon),
        React.createElement("div", { className: styles.effectToggleInfo },
          React.createElement("div", { className: styles.effectToggleTitle }, title),
          React.createElement("div", { className: styles.effectToggleDesc }, desc)
        )
      ),
      React.createElement("div", {
        className: val ? styles.toggleSwitchOn : styles.toggleSwitch,
        onClick: function () {
          var update: Partial<IStyleWizardState> = {};
          (update as unknown as Record<string, boolean>)[key as string] = !val;
          onChange(update);
        },
        role: "switch",
        "aria-checked": String(val),
        tabIndex: 0,
      })
    );
  }

  // Section header helper (accordion)
  function sectionHeader(key: string, title: string): React.ReactElement {
    var isOpen = expanded[key] || false;
    return React.createElement("div", {
      className: styles.effectSectionTitle,
      onClick: function () { toggleSection(key); },
      role: "button",
      "aria-expanded": String(isOpen),
      tabIndex: 0,
      style: { cursor: "pointer", userSelect: "none" },
    },
      React.createElement("span", undefined, title),
      React.createElement("span", { className: styles.accordionChevron, style: { transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" } }, "\u25BC")
    );
  }

  // WP Header style cards
  var wpHeaderCards: React.ReactElement[] = [];
  WP_HEADER_STYLES.forEach(function (s) {
    var isSelected = state.wpHeaderStyle === s.key;
    wpHeaderCards.push(
      React.createElement("div", {
        key: s.key,
        className: isSelected ? styles.layoutCardSelected : styles.layoutCard,
        onClick: function () { onChange({ wpHeaderStyle: s.key }); },
        style: { textAlign: "center", padding: "8px" },
      },
        React.createElement("span", { style: { fontSize: "20px", display: "block" } }, s.icon),
        React.createElement("span", { className: styles.layoutCardName, style: { fontSize: "11px" } }, s.label)
      )
    );
  });

  function chipGroup(key: keyof IStyleWizardState, options: Array<{ v: string; l: string }>, current: string): React.ReactElement {
    var chips: React.ReactElement[] = [];
    options.forEach(function (o) {
      chips.push(
        React.createElement("button", {
          key: o.v,
          className: current === o.v ? styles.chipActive : styles.chip,
          onClick: function () {
            var update: Partial<IStyleWizardState> = {};
            (update as unknown as Record<string, string>)[key as string] = o.v;
            onChange(update);
          },
          type: "button",
        }, o.l)
      );
    });
    return React.createElement("div", { className: styles.chipGroup }, chips);
  }

  return React.createElement("div", { className: styles.stepContainer },

    // -- Web Part Styling --
    sectionHeader("wpStyling", "Web Part Styling"),
    expanded.wpStyling ? React.createElement("div", { className: styles.effectSection },
      React.createElement("div", { className: styles.formLabel }, "Web Part Header Style"),
      React.createElement("div", { className: styles.wpHeaderGrid }, wpHeaderCards),
      React.createElement("div", { className: styles.formGroup },
        React.createElement("label", { className: styles.formLabel }, "Web Part Border Style"),
        chipGroup("wpBorderStyle", [
          { v: "standard", l: "Standard (8px)" }, { v: "rounded", l: "Rounded (16px)" },
          { v: "pill", l: "Pill (24px)" }, { v: "sharp", l: "Sharp (0px)" },
          { v: "double", l: "Double" }, { v: "dashed", l: "Dashed" },
        ], state.wpBorderStyle)
      ),
      React.createElement("div", { className: styles.formGroup },
        React.createElement("label", { className: styles.formLabel }, "Web Part Shadow"),
        chipGroup("wpShadowStyle", [
          { v: "standard", l: "Standard" }, { v: "elevated", l: "Elevated" },
          { v: "flat", l: "Flat" }, { v: "inset", l: "Inset" },
          { v: "colored", l: "Colored" }, { v: "dramatic", l: "Dramatic" },
        ], state.wpShadowStyle)
      ),
      React.createElement("div", { className: styles.formGroup },
        React.createElement("label", { className: styles.formLabel }, "Web Part Spacing"),
        chipGroup("wpSpacing", [
          { v: "compact", l: "Compact" }, { v: "standard", l: "Standard" },
          { v: "comfortable", l: "Comfortable" }, { v: "spacious", l: "Spacious" },
        ], state.wpSpacing)
      )
    ) : null,

    // -- Visual Style --
    sectionHeader("visualStyle", "Visual Style"),
    expanded.visualStyle ? React.createElement("div", { className: styles.effectSection },
      React.createElement("div", { className: styles.formGroup },
        React.createElement("label", { className: styles.formLabel }, "Card Style"),
        chipGroup("cardStyle", [
          { v: "standard", l: "Standard" }, { v: "glass", l: "Glassmorphism" },
          { v: "neo", l: "Neomorphism" }, { v: "flat", l: "Flat" },
        ], state.cardStyle)
      ),
      React.createElement("div", { className: styles.formGroup },
        React.createElement("label", { className: styles.formLabel }, "Shadow Preset"),
        chipGroup("shadowPreset", [
          { v: "none", l: "None" }, { v: "subtle", l: "Subtle" },
          { v: "medium", l: "Medium" }, { v: "elevated", l: "Elevated" },
          { v: "dramatic", l: "Dramatic" },
        ], state.shadowPreset)
      )
    ) : null,

    // -- Backgrounds --
    sectionHeader("backgrounds", "Backgrounds & Decorations"),
    expanded.backgrounds ? React.createElement("div", { className: styles.effectSection },
      effectToggle("enableAurora", "\uD83C\uDF0C", "Aurora Background", "Animated color blobs behind content", state.enableAurora),
      effectToggle("enableParticles", "\u2727", "Particle Effect", "Floating particles overlay", state.enableParticles),
      effectToggle("enableWaves", "\uD83C\uDF0A", "Wave Section Dividers", "SVG wave shapes between sections", state.enableWaves)
    ) : null,

    // -- Animations --
    sectionHeader("animations", "Animations"),
    expanded.animations ? React.createElement("div", { className: styles.effectSection },
      effectToggle("enableScrollReveal", "\uD83D\uDC40", "Scroll Reveal Animations", "Animate elements as they enter viewport", state.enableScrollReveal),
      effectToggle("enableHoverMicro", "\uD83D\uDC46", "Hover Micro-Animations", "Subtle hover effects on interactive elements", state.enableHoverMicro),
      effectToggle("enablePageTransition", "\uD83D\uDD04", "Page Transition Effect", "Animate between page navigations", state.enablePageTransition)
    ) : null,

    // -- Advanced --
    sectionHeader("advanced", "Advanced"),
    expanded.advanced ? React.createElement("div", { className: styles.effectSection },
      effectToggle("enableDarkMode", "\uD83C\uDF19", "Dark Mode Support", "Full dark theme for your intranet", state.enableDarkMode),
      effectToggle("enableCustomScrollbar", "\uD83D\uDCDC", "Custom Scrollbar", "Style the browser scrollbar", state.enableCustomScrollbar),
      effectToggle("enableGradientText", "\uD83C\uDF08", "Gradient Text Headings", "Apply gradient color to heading text", state.enableGradientText),
      effectToggle("enableCustomCursor", "\uD83D\uDDB1", "Custom Cursor", "Styled cursor on your site", state.enableCustomCursor)
    ) : null,

    // -- CSS Overrides --
    sectionHeader("cssOverrides", "CSS Overrides"),
    expanded.cssOverrides ? React.createElement("div", { className: styles.effectSection },
      effectToggle("enableWpCardStyling", "\uD83C\uDFB4", "Web Part Card Styling", "Border-radius + shadow on .ControlZone-control", state.enableWpCardStyling),
      effectToggle("enableWpHeaderAccent", "\uD83C\uDFA8", "Web Part Header Accent", "Left border accent on web part headers", state.enableWpHeaderAccent),
      effectToggle("enableButtonRestyling", "\uD83D\uDD22", "Button Restyling", "Override border-radius + color on all SP buttons", state.enableButtonRestyling),
      effectToggle("enableLinkStyling", "\uD83D\uDD17", "Link Styling", "Custom link color and hover effects", state.enableLinkStyling),
      effectToggle("enableSelectionColor", "\uD83D\uDCDD", "Selection Color", "Custom ::selection background + text color", state.enableSelectionColor)
    ) : null
  );
};

export default EffectsStep;
