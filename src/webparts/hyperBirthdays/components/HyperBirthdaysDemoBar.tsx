import * as React from "react";
import type { BirthdaysViewMode, CelebrationType, AnimationType } from "../models/IHyperBirthdaysEnums";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

// ============================================================
// HyperBirthdays Demo Bar — Rich Panel (Variation 3)
// Collapsed: slim bar with DEMO badge + title + celebration count
// Expanded: chip sections for view, type filter, feature toggles
// ============================================================

var VIEW_OPTIONS: Array<{ key: BirthdaysViewMode; label: string }> = [
  { key: "upcomingList", label: "Upcoming" },
  { key: "monthlyCalendar", label: "Calendar" },
  { key: "cardCarousel", label: "Carousel" },
  { key: "cardGrid", label: "Card Grid" },
  { key: "timeline", label: "Timeline" },
  { key: "featuredSpotlight", label: "Spotlight" },
  { key: "masonryWall", label: "Masonry" },
  { key: "compactStrip", label: "Compact" },
];

var TYPE_OPTIONS: Array<{ key: CelebrationType; label: string; emoji: string }> = [
  { key: "birthday", label: "Birthday", emoji: "\uD83C\uDF82" },
  { key: "workAnniversary", label: "Anniversary", emoji: "\uD83C\uDF89" },
  { key: "wedding", label: "Wedding", emoji: "\uD83D\uDC8D" },
  { key: "childBirth", label: "New Baby", emoji: "\uD83D\uDC76" },
  { key: "graduation", label: "Graduation", emoji: "\uD83C\uDF93" },
  { key: "retirement", label: "Retirement", emoji: "\uD83C\uDF34" },
  { key: "promotion", label: "Promotion", emoji: "\uD83D\uDE80" },
];

var ANIMATION_OPTIONS: Array<{ key: AnimationType; label: string }> = [
  { key: "confetti", label: "Confetti" },
  { key: "balloons", label: "Balloons" },
  { key: "sparkle", label: "Sparkle" },
  { key: "none", label: "None" },
];

export interface IHyperBirthdaysDemoBarProps {
  currentView: BirthdaysViewMode;
  currentAnimation: AnimationType;
  celebrationCount: number;
  enabledTypes: CelebrationType[];
  animationsEnabled: boolean;
  milestoneBadgesEnabled: boolean;
  onViewChange: (view: BirthdaysViewMode) => void;
  onAnimationChange: (anim: AnimationType) => void;
  onTypeToggle: (type: CelebrationType) => void;
  onAnimationsToggle: () => void;
  onMilestoneBadgesToggle: () => void;
  onExitDemo: () => void;
}

var HyperBirthdaysDemoBar: React.FC<IHyperBirthdaysDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // View chips
  var viewChips = VIEW_OPTIONS.map(function (opt) {
    var isActive = props.currentView === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onViewChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.label);
  });

  // Type filter chips (multi-select — toggle on/off)
  var typeChips = TYPE_OPTIONS.map(function (opt) {
    var isActive = props.enabledTypes.indexOf(opt.key) !== -1;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onTypeToggle(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, opt.emoji + " " + opt.label);
  });

  // Animation style chips
  var animChips = ANIMATION_OPTIONS.map(function (opt) {
    var isActive = props.currentAnimation === opt.key;
    var chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: chipClass,
      type: "button",
      onClick: function () { props.onAnimationChange(opt.key); },
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
    React.createElement("span", { className: styles.wpName }, "HyperBirthdays Demo"),
    React.createElement("span", { className: styles.itemCount },
      String(props.celebrationCount) + (props.celebrationCount === 1 ? " celebration" : " celebrations")
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
      // View section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "View"),
        React.createElement("div", { className: styles.chipGroup }, viewChips)
      ),
      // Type filter section (multi-select)
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Types"),
        React.createElement("div", { className: styles.chipGroup }, typeChips)
      ),
      // Animation style section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Animation"),
        React.createElement("div", { className: styles.chipGroup }, animChips)
      ),
      // Features section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Features"),
        React.createElement("div", { className: styles.chipGroup },
          featureToggle("Animations", props.animationsEnabled, props.onAnimationsToggle),
          featureToggle("Milestone Badges", props.milestoneBadgesEnabled, props.onMilestoneBadgesToggle)
        )
      )
    );

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  }, topRow, sections);
};

export default HyperBirthdaysDemoBar;
