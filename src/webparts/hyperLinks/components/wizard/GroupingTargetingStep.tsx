import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ILinksWizardState, IWizardGroupingTargeting } from "../../models/IHyperLinksWizardState";
import styles from "./WizardSteps.module.scss";

var GROUPING_TOGGLES: Array<{
  key: keyof IWizardGroupingTargeting;
  icon: string;
  label: string;
  desc: string;
  hint?: string;
}> = [
  {
    key: "enableGrouping",
    icon: "\uD83D\uDCC1",
    label: "Link Grouping",
    desc: "Organize links into collapsible sections with custom group names",
    hint: "Groups help users navigate large collections. Each link can be assigned to a named group.",
  },
  {
    key: "enableAudienceTargeting",
    icon: "\uD83C\uDFAF",
    label: "Audience Targeting",
    desc: "Show or hide specific links based on Azure AD group membership",
    hint: "Target links to specific teams or departments. Uses Microsoft 365 security and distribution groups.",
  },
  {
    key: "enableSearch",
    icon: "\uD83D\uDD0D",
    label: "Search Within Links",
    desc: "Add a search bar to quickly filter links by title, description, or group",
    hint: "Recommended for collections with 10+ links. Users can instantly find what they need.",
  },
];

var GroupingTargetingStep: React.FC<IWizardStepProps<ILinksWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleToggle = React.useCallback(function (key: keyof IWizardGroupingTargeting): void {
    var updated: Partial<IWizardGroupingTargeting> = {};
    (updated as Record<string, boolean>)[key] = !state.groupingTargeting[key];
    onChange({
      groupingTargeting: Object.assign({}, state.groupingTargeting, updated),
    });
  }, [state.groupingTargeting, onChange]);

  var enabledCount = 0;
  GROUPING_TOGGLES.forEach(function (opt) {
    if (state.groupingTargeting[opt.key]) {
      enabledCount++;
    }
  });

  var cards: React.ReactElement[] = [];
  GROUPING_TOGGLES.forEach(function (opt) {
    var isEnabled = !!state.groupingTargeting[opt.key];
    var toggleId = "groupToggle-" + opt.key;

    var cardChildren: React.ReactElement[] = [
      React.createElement("span", {
        key: "emoji",
        className: styles.featureCardEmoji,
        style: { borderColor: isEnabled ? "#0078d4" : undefined },
      }, opt.icon),
      React.createElement("div", { key: "info", className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, opt.label),
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
        "Organization & Targeting (" + enabledCount + " of 3 enabled)"
      ),
      React.createElement("div", { className: styles.stepSectionHint },
        "These features help manage larger link collections and personalize the experience."
      )
    ),
    React.createElement("div", {
      style: { display: "flex", flexDirection: "column", gap: "8px" },
    }, cards)
  );
};

export default GroupingTargetingStep;
