import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ILinksWizardState, IWizardFeatures } from "../../models/IHyperLinksWizardState";
import styles from "./WizardSteps.module.scss";

var FEATURE_TOGGLES: Array<{
  key: keyof IWizardFeatures;
  icon: string;
  label: string;
  desc: string;
  isNew?: boolean;
  hint?: string;
}> = [
  {
    key: "enableAnalytics",
    icon: "\uD83D\uDCCA",
    label: "Click Analytics",
    desc: "Track which links are clicked most. Data is stored locally per web part instance.",
  },
  {
    key: "enableHealthCheck",
    icon: "\uD83D\uDC9A",
    label: "Link Health Monitoring",
    desc: "Automatically check if links are alive. Broken links show a warning indicator in edit mode.",
    isNew: true,
    hint: "Health checks run in edit mode only, using lightweight HEAD requests. Checks run once per session.",
  },
  {
    key: "enablePopularBadges",
    icon: "\uD83D\uDD25",
    label: "Popular Link Badges",
    desc: "Show a trending badge on the most-clicked links based on analytics data.",
    isNew: true,
    hint: "Requires Click Analytics to be enabled. The top 3 most-clicked links display a trending indicator.",
  },
];

var FeaturesStep: React.FC<IWizardStepProps<ILinksWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleToggle = React.useCallback(function (key: keyof IWizardFeatures): void {
    var updated: Partial<IWizardFeatures> = {};
    (updated as Record<string, boolean>)[key] = !state.features[key];

    // If enabling popular badges, auto-enable analytics
    if (key === "enablePopularBadges" && !state.features.enablePopularBadges) {
      (updated as Record<string, boolean>).enableAnalytics = true;
    }

    onChange({
      features: Object.assign({}, state.features, updated),
    });
  }, [state.features, onChange]);

  var enabledCount = 0;
  FEATURE_TOGGLES.forEach(function (opt) {
    if (state.features[opt.key]) {
      enabledCount++;
    }
  });

  var cards: React.ReactElement[] = [];
  FEATURE_TOGGLES.forEach(function (opt) {
    var isEnabled = !!state.features[opt.key];
    var toggleId = "featureToggle-" + opt.key;

    var labelChildren: React.ReactNode[] = [opt.label];
    if (opt.isNew) {
      labelChildren.push(
        React.createElement("span", { key: "badge", className: styles.badgeNew }, "NEW")
      );
    }

    var cardChildren: React.ReactElement[] = [
      React.createElement("span", {
        key: "emoji",
        className: styles.featureCardEmoji,
        style: { borderColor: isEnabled ? "#0078d4" : undefined },
      }, opt.icon),
      React.createElement("div", { key: "info", className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, labelChildren),
        React.createElement("span", { className: styles.toggleDesc }, opt.desc)
      ),
      React.createElement("div", { key: "switch", className: styles.toggleSwitch },
        React.createElement("input", {
          type: "checkbox",
          id: toggleId,
          className: styles.toggleInput,
          checked: isEnabled,
          onChange: function () { handleToggle(opt.key); },
          tabIndex: -1,
          "aria-hidden": "true",
        }),
        React.createElement("label", {
          className: styles.toggleTrack,
          htmlFor: toggleId,
        },
          React.createElement("span", { className: styles.toggleThumb })
        )
      ),
    ];

    cards.push(
      React.createElement("div", {
        key: opt.key,
        className: isEnabled ? styles.featureCardActive : styles.featureCard,
        onClick: function () { handleToggle(opt.key); },
        role: "checkbox",
        "aria-checked": String(isEnabled),
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent): void {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle(opt.key);
          }
        },
      }, cardChildren)
    );

    // Show hint if enabled
    if (isEnabled && opt.hint) {
      cards.push(
        React.createElement("div", {
          key: opt.key + "-hint",
          className: styles.hintBox,
        }, opt.hint)
      );
    }
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel },
        "Advanced Features (" + enabledCount + " of 3 enabled)"
      ),
      React.createElement("div", { className: styles.stepSectionHint },
        "All features are optional. Enable what makes sense for your use case."
      )
    ),
    React.createElement("div", {
      style: { display: "flex", flexDirection: "column", gap: "8px" },
    }, cards)
  );
};

export default FeaturesStep;
