import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IEventsWizardState } from "../../models/IHyperEventsWizardState";
import styles from "./WizardSteps.module.scss";

// ============================================================
// Step 3: Features
// ============================================================

var FEATURE_DEFS: Array<{ key: string; icon: string; label: string; desc: string }> = [
  { key: "enableRsvp", icon: "\u270D\uFE0F", label: "RSVP", desc: "Going / Maybe / Decline buttons on each event" },
  { key: "enableRegistration", icon: "\uD83D\uDCDD", label: "Registration Forms", desc: "Custom sign-up forms with dynamic fields per event" },
  { key: "enableCountdown", icon: "\u23F1\uFE0F", label: "Countdown Timer", desc: "Show countdown to the next upcoming event" },
  { key: "enableNotifications", icon: "\uD83D\uDD14", label: "Notifications", desc: "Email and Teams reminders via Microsoft Graph" },
  { key: "enableCategoryFilter", icon: "\uD83C\uDFF7\uFE0F", label: "Category Filter Bar", desc: "Filter events by category with color-coded chips" },
  { key: "enableLocationLinks", icon: "\uD83D\uDCCD", label: "Location Links", desc: "Show map and directions links for event locations" },
  { key: "enableVirtualLinks", icon: "\uD83C\uDFA5", label: "Teams Meeting Links", desc: "Show Join Teams Meeting buttons for virtual events" },
  { key: "enablePastArchive", icon: "\uD83D\uDCE6", label: "Past Events Archive", desc: "Show expandable section for past events" },
  { key: "showCalendarOverlay", icon: "\uD83C\uDFA8", label: "Calendar Overlay", desc: "Color-code events by source with overlay legend" },
];

var FeaturesStep: React.FC<IWizardStepProps<IEventsWizardState>> = function (props) {
  var features = props.state.features;

  var handleToggle = React.useCallback(function (key: string) {
    var updated: Record<string, unknown> = {};
    var keys = Object.keys(features);
    keys.forEach(function (k) { updated[k] = (features as unknown as Record<string, unknown>)[k]; });
    updated[key] = !updated[key];
    props.onChange({ features: updated as unknown as IEventsWizardState["features"] });
  }, [features, props]);

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
      React.createElement("div", { className: styles.stepSectionLabel }, "Enable Features"),
      React.createElement("div", { className: styles.stepSectionHint },
        String(enabledCount) + " of " + String(FEATURE_DEFS.length) + " features enabled. Toggle the features you want for your calendar."
      )
    ),
    toggleRows
  );
};

export default FeaturesStep;
