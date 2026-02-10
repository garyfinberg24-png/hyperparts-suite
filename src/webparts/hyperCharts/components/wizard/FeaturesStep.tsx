import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IChartsWizardState } from "../../models/IHyperChartsWizardState";
import styles from "./WizardSteps.module.scss";

// ============================================================
// Step 4: Features & Styling
// ============================================================

var FEATURE_DEFS: Array<{ key: string; icon: string; label: string; desc: string }> = [
  { key: "enableDrillDown", icon: "\uD83D\uDD0D", label: "Drill-Down", desc: "Click chart segments to see underlying data details" },
  { key: "enableExport", icon: "\uD83D\uDCE5", label: "Export (PNG/CSV)", desc: "Download charts as images or data as CSV files" },
  { key: "enableConditionalColors", icon: "\uD83D\uDEA6", label: "RAG Conditional Colors", desc: "Red/Amber/Green coloring based on threshold rules" },
  { key: "enableComparison", icon: "\u2194\uFE0F", label: "Period Comparison", desc: "Compare current data vs. previous period overlay" },
  { key: "enableAccessibilityTables", icon: "\u267F", label: "Accessibility Tables", desc: "Hidden data tables for screen reader users" },
  { key: "showDataLabels", icon: "\uD83C\uDFF7\uFE0F", label: "Data Labels", desc: "Show numeric values directly on chart elements" },
  { key: "enableZoomPan", icon: "\uD83D\uDD0E", label: "Zoom & Pan", desc: "Interactive zoom and pan on time-series charts" },
];

var REFRESH_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 0, label: "Off (manual refresh)" },
  { value: 15, label: "Every 15 seconds" },
  { value: 30, label: "Every 30 seconds" },
  { value: 60, label: "Every 1 minute" },
  { value: 120, label: "Every 2 minutes" },
  { value: 300, label: "Every 5 minutes" },
];

var FeaturesStep: React.FC<IWizardStepProps<IChartsWizardState>> = function (props) {
  var features = props.state.features;

  var handleToggle = React.useCallback(function (key: string) {
    var updated: Record<string, unknown> = {};
    var keys = Object.keys(features);
    keys.forEach(function (k) { updated[k] = (features as unknown as Record<string, unknown>)[k]; });
    updated[key] = !updated[key];
    props.onChange({ features: updated as unknown as IChartsWizardState["features"] });
  }, [features, props]);

  var handleRefreshChange = React.useCallback(function (e: React.ChangeEvent<HTMLSelectElement>) {
    props.onChange({ refreshInterval: parseInt(e.target.value, 10) });
  }, [props]);

  // Count enabled
  var enabledCount = 0;
  var featureKeys = Object.keys(features);
  featureKeys.forEach(function (k) {
    if ((features as unknown as Record<string, boolean>)[k]) {
      enabledCount++;
    }
  });

  var toggleRows = FEATURE_DEFS.map(function (def) {
    var isOn = (features as unknown as Record<string, boolean>)[def.key] === true;

    return React.createElement("label", {
      key: def.key,
      className: styles.toggleRow,
    },
      React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, def.icon),
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, def.label),
        React.createElement("span", { className: styles.toggleDesc }, def.desc)
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          className: styles.toggleInput,
          type: "checkbox",
          checked: isOn,
          onChange: function () { handleToggle(def.key); },
          "aria-label": def.label,
        }),
        React.createElement("span", { className: styles.toggleTrack },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Dashboard Features"),
      React.createElement("div", { className: styles.stepSectionHint },
        String(enabledCount) + " of " + String(FEATURE_DEFS.length) + " features enabled. Toggle the capabilities you want."
      )
    ),
    toggleRows,

    // Auto-refresh
    React.createElement("div", { className: styles.refreshRow },
      React.createElement("span", { className: styles.refreshLabel }, "Auto-Refresh Interval"),
      React.createElement("select", {
        className: styles.refreshSelect,
        value: String(props.state.refreshInterval),
        onChange: handleRefreshChange,
        "aria-label": "Auto-refresh interval",
      }, REFRESH_OPTIONS.map(function (opt) {
        return React.createElement("option", { key: opt.value, value: String(opt.value) }, opt.label);
      }))
    )
  );
};

export default FeaturesStep;
