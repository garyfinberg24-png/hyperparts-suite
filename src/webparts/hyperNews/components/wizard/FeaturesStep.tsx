import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { INewsWizardState } from "../../models/IHyperNewsWizardState";
import type { IWizardFeatures } from "../../models/IHyperNewsWizardState";
import styles from "./WizardSteps.module.scss";

// ============================================================
// FeaturesStep — 6 feature toggle switches
// ============================================================

interface IFeatureDef {
  key: keyof IWizardFeatures;
  icon: string;
  label: string;
  desc: string;
}

var FEATURE_DEFS: IFeatureDef[] = [
  { key: "enableInfiniteScroll", icon: "\uD83D\uDD04", label: "Infinite Scroll", desc: "Automatically load more articles as the user scrolls down" },
  { key: "enableQuickRead", icon: "\uD83D\uDC41\uFE0F", label: "Quick Read Modal", desc: "Open articles in a quick-read overlay without navigating away" },
  { key: "enableReactions", icon: "\uD83D\uDE00", label: "Emoji Reactions", desc: "Allow users to react to articles with emoji (like, love, wow, sad, angry)" },
  { key: "enableBookmarks", icon: "\uD83D\uDD16", label: "Bookmarks", desc: "Let users bookmark articles for later reading" },
  { key: "enableReadTracking", icon: "\uD83D\uDCCA", label: "Read Tracking", desc: "Track which articles each user has read and show progress" },
  { key: "enableScheduling", icon: "\u23F0", label: "Content Scheduling", desc: "Publish and unpublish articles on a schedule" },
];

var FeaturesStep: React.FC<IWizardStepProps<INewsWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;
  var features = state.features;

  var handleToggle = React.useCallback(function (key: keyof IWizardFeatures): void {
    var updated = {
      enableInfiniteScroll: features.enableInfiniteScroll,
      enableQuickRead: features.enableQuickRead,
      enableReactions: features.enableReactions,
      enableBookmarks: features.enableBookmarks,
      enableReadTracking: features.enableReadTracking,
      enableScheduling: features.enableScheduling,
    };
    updated[key] = !updated[key];
    onChange({ features: updated });
  }, [onChange, features]);

  var toggleElements: React.ReactElement[] = [];
  FEATURE_DEFS.forEach(function (feat) {
    var isChecked = features[feat.key];

    toggleElements.push(
      React.createElement("label", { key: feat.key, className: styles.toggleRow },
        React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, feat.icon),
        React.createElement("div", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, feat.label),
          React.createElement("span", { className: styles.toggleDesc }, feat.desc)
        ),
        React.createElement("div", { className: styles.toggleSwitch },
          React.createElement("input", {
            type: "checkbox",
            className: styles.toggleInput,
            checked: isChecked,
            onChange: function () { handleToggle(feat.key); },
            "aria-label": feat.label,
          }),
          React.createElement("span", { className: styles.toggleTrack },
            React.createElement("span", { className: styles.toggleThumb })
          )
        )
      )
    );
  });

  // Count enabled features
  var enabledCount = 0;
  FEATURE_DEFS.forEach(function (f) {
    if (features[f.key]) enabledCount += 1;
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Enable Features"),
      React.createElement("div", { className: styles.stepSectionHint },
        enabledCount + " of " + String(FEATURE_DEFS.length) + " features enabled. Toggle the features you want for your news experience."
      )
    ),
    toggleElements
  );
};

export default FeaturesStep;
