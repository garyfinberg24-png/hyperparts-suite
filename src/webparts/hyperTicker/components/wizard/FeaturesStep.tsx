import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ITickerWizardState } from "../../models/ITickerWizardState";
import styles from "./WizardSteps.module.scss";

interface IFeatureToggle {
  key: keyof ITickerWizardState;
  icon: string;
  label: string;
  desc: string;
}

const FEATURE_TOGGLES: IFeatureToggle[] = [
  { key: "enableDismiss", icon: "\u274C", label: "Dismiss Items", desc: "Allow users to dismiss individual ticker items" },
  { key: "enableAcknowledge", icon: "\u2705", label: "Acknowledge Items", desc: "Require acknowledgment for critical/emergency items" },
  { key: "enableExpand", icon: "\uD83D\uDD0D", label: "Expand Detail Panel", desc: "Click items to open a detail panel with description" },
  { key: "enableCopy", icon: "\uD83D\uDCCB", label: "Copy to Clipboard", desc: "Show a copy button on each ticker item" },
  { key: "enableAnalytics", icon: "\uD83D\uDCCA", label: "Analytics Tracking", desc: "Track click, dismiss, and view events" },
  { key: "enableItemAudience", icon: "\uD83D\uDC65", label: "Audience Targeting", desc: "Filter items by AD group membership" },
  { key: "enableEmergencyMode", icon: "\uD83D\uDEA8", label: "Emergency Mode", desc: "Enable full-screen emergency overlay for critical items" },
];

const FeaturesStep: React.FC<IWizardStepProps<ITickerWizardState>> = function (props) {
  const onChange = props.onChange;
  const state = props.state;

  const toggles: React.ReactElement[] = [];

  FEATURE_TOGGLES.forEach(function (feature) {
    const isChecked = Boolean(state[feature.key]);
    const inputId = "feature-" + feature.key;

    toggles.push(
      React.createElement("div", { key: feature.key, className: styles.toggleRow },
        React.createElement("div", { className: styles.toggleInfo },
          React.createElement("div", { className: styles.toggleLabel },
            React.createElement("span", { "aria-hidden": "true", style: { marginRight: "8px" } }, feature.icon),
            feature.label
          ),
          React.createElement("div", { className: styles.toggleDesc }, feature.desc)
        ),
        React.createElement("label", { className: styles.toggleSwitch, htmlFor: inputId },
          React.createElement("input", {
            id: inputId,
            className: styles.toggleInput,
            type: "checkbox",
            checked: isChecked,
            onChange: function () {
              const partial: Partial<ITickerWizardState> = {};
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (partial as any)[feature.key] = !isChecked;
              onChange(partial);
            },
            "aria-label": feature.label,
          }),
          React.createElement("div", { className: styles.toggleTrack },
            React.createElement("div", { className: styles.toggleThumb })
          )
        )
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Enable Features"),
      React.createElement("div", { className: styles.stepSectionHint }, "Toggle the features you want. All can be changed later in the property pane.")
    ),
    toggles
  );
};

export default FeaturesStep;
