import * as React from "react";
import type { OnboardLayoutMode } from "../models";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

var LAYOUT_OPTIONS: Array<{ key: OnboardLayoutMode; label: string }> = [
  { key: "dashboard", label: "Dashboard" },
  { key: "timeline", label: "Timeline" },
  { key: "checklist", label: "Checklist" },
  { key: "cards", label: "Cards" },
];

export interface IHyperOnboardDemoBarProps {
  currentLayout: OnboardLayoutMode;
  taskCount: number;
  completedCount: number;
  progressRingEnabled: boolean;
  milestonesEnabled: boolean;
  mentorEnabled: boolean;
  onLayoutChange: (layout: OnboardLayoutMode) => void;
  onProgressRingToggle: () => void;
  onMilestonesToggle: () => void;
  onMentorToggle: () => void;
  onExitDemo: () => void;
}

var HyperOnboardDemoBar: React.FC<IHyperOnboardDemoBarProps> = function (props) {
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

  // Header row (always visible)
  var topRow = React.createElement("div", { className: styles.headerRow },
    React.createElement("span", { className: styles.demoBadge }, "DEMO"),
    React.createElement("span", { className: styles.wpName }, "HyperOnboard"),
    React.createElement("span", { className: styles.itemCount },
      props.completedCount + "/" + props.taskCount + " tasks"
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
      // Features section
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Features"),
        React.createElement("div", { className: styles.chipGroup },
          featureToggle("Progress Ring", props.progressRingEnabled, props.onProgressRingToggle),
          featureToggle("Milestones", props.milestonesEnabled, props.onMilestonesToggle),
          featureToggle("Mentor", props.mentorEnabled, props.onMentorToggle)
        )
      )
    );

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  }, topRow, sections);
};

export default HyperOnboardDemoBar;
