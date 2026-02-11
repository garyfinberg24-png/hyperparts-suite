import * as React from "react";
import type { TransitionEffect } from "../models";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

// ============================================================
// HyperHero Demo Bar — Rich Panel (Variation 3)
// Collapsed: slim bar with DEMO badge + title + slide count
// Expanded: chip sections for layout, transition, feature toggles
// ============================================================

/** Hero layout modes surfaced in the demo bar */
type HeroLayoutMode = "grid" | "carousel" | "split" | "cinematic" | "filmstrip" | "stacked";

var LAYOUT_OPTIONS: Array<{ key: HeroLayoutMode; label: string }> = [
  { key: "grid", label: "Grid" },
  { key: "carousel", label: "Carousel" },
  { key: "split", label: "Split" },
  { key: "cinematic", label: "Cinematic" },
  { key: "filmstrip", label: "Filmstrip" },
  { key: "stacked", label: "Stacked" },
];

var TRANSITION_OPTIONS: Array<{ key: TransitionEffect; label: string }> = [
  { key: "fade", label: "Fade" },
  { key: "slide", label: "Slide" },
  { key: "zoom", label: "Zoom" },
  { key: "kenBurns", label: "Ken Burns" },
  { key: "none", label: "None" },
];

var ASPECT_OPTIONS: Array<{ key: string; label: string }> = [
  { key: "16:9", label: "16:9" },
  { key: "4:3", label: "4:3" },
  { key: "21:9", label: "21:9" },
  { key: "custom", label: "Custom" },
];

export interface IHyperHeroDemoBarProps {
  currentLayout: HeroLayoutMode;
  currentTransition: TransitionEffect;
  currentAspectRatio: string;
  slideCount: number;
  parallaxEnabled: boolean;
  autoRotationEnabled: boolean;
  countdownEnabled: boolean;
  videoEnabled: boolean;
  onLayoutChange: (layout: HeroLayoutMode) => void;
  onTransitionChange: (transition: TransitionEffect) => void;
  onAspectRatioChange: (ratio: string) => void;
  onParallaxToggle: () => void;
  onAutoRotationToggle: () => void;
  onCountdownToggle: () => void;
  onVideoToggle: () => void;
  onExitDemo: () => void;
}

var HyperHeroDemoBar: React.FC<IHyperHeroDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // Layout chips
  var layoutChips = LAYOUT_OPTIONS.map(function (opt) {
    var isActive = props.currentLayout === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onLayoutChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // Transition chips
  var transitionChips = TRANSITION_OPTIONS.map(function (opt) {
    var isActive = props.currentTransition === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onTransitionChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // Aspect ratio chips
  var aspectChips = ASPECT_OPTIONS.map(function (opt) {
    var isActive = props.currentAspectRatio === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onAspectRatioChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // Feature toggle helper
  var featureToggle = function (label: string, enabled: boolean, onToggle: () => void): React.ReactElement {
    var toggleClass = styles.toggleChip + (enabled ? " " + styles.toggleChipActive : "");
    var dotClass = styles.toggleDot + (enabled ? " " + styles.toggleDotActive : "");
    return React.createElement("button", {
      className: toggleClass,
      type: "button",
      onClick: function () { onToggle(); },
      "aria-pressed": enabled ? "true" : "false",
    },
      React.createElement("span", { className: dotClass }),
      label
    );
  };

  // Collapsed bar (always visible)
  var topRow = React.createElement("div", { className: styles.headerRow },
    React.createElement("span", { className: styles.demoBadge }, "DEMO"),
    React.createElement("span", { className: styles.wpName }, "HyperHero Demo"),
    React.createElement("span", { className: styles.itemCount },
      String(props.slideCount) + (props.slideCount === 1 ? " slide" : " slides")
    ),
    React.createElement("span", { className: styles.spacer }),
    React.createElement("button", {
      className: styles.expandToggle,
      type: "button",
      onClick: function () { setExpanded(function (v: boolean) { return !v; }); },
      "aria-label": isExpanded ? "Collapse demo panel" : "Expand demo panel",
    }, isExpanded ? "Collapse" : "Expand"),
    React.createElement("button", {
      className: styles.exitButton,
      type: "button",
      onClick: props.onExitDemo,
      "aria-label": "Exit demo mode",
    }, "Exit Demo")
  );

  // Expanded sections
  var sections = !isExpanded ? undefined :
    React.createElement("div", { className: styles.expandPanel + " " + styles.expandPanelOpen },
      // Layout section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Layout"),
        React.createElement("div", { className: styles.chipGroup }, layoutChips)
      ),
      // Transition section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Transition"),
        React.createElement("div", { className: styles.chipGroup }, transitionChips)
      ),
      // Aspect Ratio section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Aspect"),
        React.createElement("div", { className: styles.chipGroup }, aspectChips)
      ),
      // Features section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Features"),
        React.createElement("div", { className: styles.chipGroup },
          featureToggle("Parallax", props.parallaxEnabled, props.onParallaxToggle),
          featureToggle("Auto-Rotate", props.autoRotationEnabled, props.onAutoRotationToggle),
          featureToggle("Countdown", props.countdownEnabled, props.onCountdownToggle),
          featureToggle("Video BG", props.videoEnabled, props.onVideoToggle)
        )
      )
    );

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  }, topRow, sections);
};

export default HyperHeroDemoBar;
