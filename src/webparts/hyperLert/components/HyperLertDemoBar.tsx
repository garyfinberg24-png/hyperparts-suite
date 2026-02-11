import * as React from "react";
import type { LertLayout, LertTemplateId, AlertGroupMode } from "../models/IHyperLertV2Enums";
import {
  ALL_LERT_LAYOUTS,
  ALL_LERT_TEMPLATES,
  getLertLayoutDisplayName,
} from "../models/IHyperLertV2Enums";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles: Record<string, string> = require("./HyperLertDemoBar.module.scss");

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

const HyperLertDemoBar: React.FC<IHyperLertDemoBarProps> = function (props) {
  var handleLayoutChange = React.useCallback(function (e: React.ChangeEvent<HTMLSelectElement>): void {
    props.onLayoutChange(e.target.value as LertLayout);
  }, [props.onLayoutChange]);

  var handleTemplateChange = React.useCallback(function (e: React.ChangeEvent<HTMLSelectElement>): void {
    props.onTemplateChange(e.target.value as LertTemplateId);
  }, [props.onTemplateChange]);

  var handleGroupChange = React.useCallback(function (e: React.ChangeEvent<HTMLSelectElement>): void {
    props.onGroupModeChange(e.target.value as AlertGroupMode);
  }, [props.onGroupModeChange]);

  // Layout options
  var layoutOptions: React.ReactNode[] = [];
  ALL_LERT_LAYOUTS.forEach(function (layout: LertLayout): void {
    layoutOptions.push(React.createElement("option", {
      key: layout,
      value: layout,
    }, getLertLayoutDisplayName(layout)));
  });

  // Template options
  var templateOptions: React.ReactNode[] = [];
  ALL_LERT_TEMPLATES.forEach(function (tmpl: LertTemplateId): void {
    templateOptions.push(React.createElement("option", {
      key: tmpl,
      value: tmpl,
    }, getTemplateLabel(tmpl)));
  });

  // Group mode options
  var groupOptions: React.ReactNode[] = [];
  GROUP_MODE_OPTIONS.forEach(function (opt: { value: AlertGroupMode; label: string }): void {
    groupOptions.push(React.createElement("option", {
      key: opt.value,
      value: opt.value,
    }, opt.label));
  });

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  },
    // Demo Mode label
    React.createElement("span", { className: styles.demoLabel },
      React.createElement("i", { className: "ms-Icon ms-Icon--TestBeaker" }),
      "Demo Mode"
    ),

    // Layout switcher
    React.createElement("div", { className: styles.demoGroup },
      React.createElement("label", { className: styles.demoGroupLabel, htmlFor: "lert-demo-layout" }, "Layout:"),
      React.createElement("select", {
        id: "lert-demo-layout",
        className: styles.demoSelect,
        value: props.currentLayout,
        onChange: handleLayoutChange,
      }, layoutOptions)
    ),

    // Template switcher
    React.createElement("div", { className: styles.demoGroup },
      React.createElement("label", { className: styles.demoGroupLabel, htmlFor: "lert-demo-template" }, "Template:"),
      React.createElement("select", {
        id: "lert-demo-template",
        className: styles.demoSelect,
        value: props.currentTemplate,
        onChange: handleTemplateChange,
      }, templateOptions)
    ),

    // Group mode switcher
    React.createElement("div", { className: styles.demoGroup },
      React.createElement("label", { className: styles.demoGroupLabel, htmlFor: "lert-demo-group" }, "Group:"),
      React.createElement("select", {
        id: "lert-demo-group",
        className: styles.demoSelect,
        value: props.currentGroupMode,
        onChange: handleGroupChange,
      }, groupOptions)
    ),

    // Spacer
    React.createElement("div", { className: styles.demoSpacer }),

    // Exit Demo button
    React.createElement("button", {
      className: styles.exitBtn,
      onClick: props.onExitDemo,
      type: "button",
    },
      React.createElement("i", { className: "ms-Icon ms-Icon--Cancel" }),
      "Exit Demo"
    )
  );
};

export default HyperLertDemoBar;
