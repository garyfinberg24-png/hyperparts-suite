import * as React from "react";
import type { LertLayout, LertTemplateId, AlertGroupMode } from "../models/IHyperLertV2Enums";
import {
  ALL_LERT_LAYOUTS,
  ALL_LERT_TEMPLATES,
  getLertLayoutDisplayName,
} from "../models/IHyperLertV2Enums";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

export interface IHyperLertDemoBarProps {
  currentLayout: LertLayout;
  currentTemplate: LertTemplateId;
  currentGroupMode: AlertGroupMode;
  onLayoutChange: (layout: LertLayout) => void;
  onTemplateChange: (template: LertTemplateId) => void;
  onGroupModeChange: (mode: AlertGroupMode) => void;
  onExitDemo: () => void;
}

var GROUP_MODE_OPTIONS: Array<{ value: AlertGroupMode; label: string }> = [
  { value: "none", label: "No Grouping" },
  { value: "severity", label: "By Severity" },
  { value: "source", label: "By Source" },
  { value: "rule", label: "By Rule" },
  { value: "category", label: "By Category" },
];

function getTemplateLabel(id: LertTemplateId): string {
  switch (id) {
    case "it-operations": return "IT Operations";
    case "budget-monitor": return "Budget Monitor";
    case "sla-tracker": return "SLA Tracker";
    case "security-watchdog": return "Security Watchdog";
    case "content-governance": return "Content Governance";
    case "hr-onboarding": return "HR Onboarding";
    case "project-deadline": return "Project Deadline";
    case "inventory-alert": return "Inventory Alert";
    case "compliance-watch": return "Compliance Watch";
    case "custom": return "Custom";
    default: return String(id);
  }
}

function getGroupModeLabel(mode: AlertGroupMode): string {
  var label = "";
  GROUP_MODE_OPTIONS.forEach(function (opt) {
    if (opt.value === mode) {
      label = opt.label;
    }
  });
  return label || String(mode);
}

var HyperLertDemoBar: React.FC<IHyperLertDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // -- Build collapsed summary --
  var summary = getLertLayoutDisplayName(props.currentLayout) +
    " | " + getTemplateLabel(props.currentTemplate) +
    " | " + getGroupModeLabel(props.currentGroupMode);

  // -- Layout chips --
  var layoutChips: React.ReactNode[] = [];
  ALL_LERT_LAYOUTS.forEach(function (layout) {
    var isActive = props.currentLayout === layout;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    layoutChips.push(
      React.createElement("button", {
        key: layout,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onLayoutChange(layout); },
        "aria-pressed": isActive ? "true" : "false",
      }, getLertLayoutDisplayName(layout))
    );
  });

  // -- Template chips --
  var templateChips: React.ReactNode[] = [];
  ALL_LERT_TEMPLATES.forEach(function (tmpl) {
    var isActive = props.currentTemplate === tmpl;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    templateChips.push(
      React.createElement("button", {
        key: tmpl,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onTemplateChange(tmpl); },
        "aria-pressed": isActive ? "true" : "false",
      }, getTemplateLabel(tmpl))
    );
  });

  // -- Group mode chips --
  var groupChips: React.ReactNode[] = [];
  GROUP_MODE_OPTIONS.forEach(function (opt) {
    var isActive = props.currentGroupMode === opt.value;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    groupChips.push(
      React.createElement("button", {
        key: opt.value,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onGroupModeChange(opt.value); },
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
      React.createElement("span", { className: styles.wpName }, "HyperLert Preview"),
      !isExpanded ? React.createElement("span", { className: styles.collapsedSummary }, summary) : undefined,
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
        onClick: props.onExitDemo,
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

      // Template row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Template:"),
        React.createElement("div", { className: styles.chipGroup }, templateChips)
      ),

      // Group mode row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Grouping:"),
        React.createElement("div", { className: styles.chipGroup }, groupChips)
      )
    )
  );
};

export default HyperLertDemoBar;
