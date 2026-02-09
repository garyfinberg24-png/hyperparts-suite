import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IBirthdaysWizardState } from "../../models/IHyperBirthdaysWizardState";
import type { AnimationType } from "../../models";
import styles from "./WizardSteps.module.scss";

var ANIMATION_OPTIONS: Array<{ key: AnimationType; icon: string; label: string }> = [
  { key: "confetti", icon: "\uD83C\uDF8A", label: "Confetti" },
  { key: "balloons", icon: "\uD83C\uDF88", label: "Balloons" },
  { key: "sparkle", icon: "\u2728", label: "Sparkle" },
  { key: "none", icon: "\uD83D\uDEAB", label: "None" },
];

var EngagementStep: React.FC<IWizardStepProps<IBirthdaysWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleToggle = React.useCallback(function (field: string): void {
    var updated: Record<string, unknown> = {};
    updated[field] = !(state.engagement as unknown as Record<string, unknown>)[field];
    onChange({
      engagement: Object.assign({}, state.engagement, updated),
    });
  }, [state.engagement, onChange]);

  var handleAnimationTypeChange = React.useCallback(function (type: AnimationType): void {
    onChange({
      engagement: Object.assign({}, state.engagement, { animationType: type }),
    });
  }, [state.engagement, onChange]);

  var handleOptOutListChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    onChange({
      engagement: Object.assign({}, state.engagement, { optOutListName: e.target.value }),
    });
  }, [state.engagement, onChange]);

  // Helper to create toggle rows
  function createToggle(
    field: string,
    icon: string,
    label: string,
    description: string,
    isEnabled: boolean
  ): React.ReactElement {
    var toggleId = "eng-" + field;
    return React.createElement("div", {
      key: field,
      className: styles.toggleRow,
      onClick: function () { handleToggle(field); },
      role: "checkbox",
      "aria-checked": String(isEnabled),
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent): void {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle(field);
        }
      },
    },
      React.createElement("span", { className: styles.toggleIcon }, icon),
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, label),
        React.createElement("span", { className: styles.toggleDesc }, description)
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          type: "checkbox",
          id: toggleId,
          className: styles.toggleInput,
          checked: isEnabled,
          onChange: function () { handleToggle(field); },
          tabIndex: -1,
          "aria-hidden": "true",
        }),
        React.createElement("label", { className: styles.toggleTrack, htmlFor: toggleId },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    );
  }

  // Animation type selector cards
  var animCards: React.ReactElement[] = [];
  ANIMATION_OPTIONS.forEach(function (opt) {
    var isSelected = state.engagement.animationType === opt.key;
    animCards.push(
      React.createElement("div", {
        key: opt.key,
        className: isSelected ? styles.animCardSelected : styles.animCard,
        onClick: function () { handleAnimationTypeChange(opt.key); },
        role: "radio",
        "aria-checked": String(isSelected),
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent): void {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleAnimationTypeChange(opt.key);
          }
        },
      },
        React.createElement("span", { className: styles.animCardIcon }, opt.icon),
        React.createElement("span", { className: styles.animCardLabel }, opt.label)
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    // Teams deep link
    createToggle(
      "enableTeamsDeepLink",
      "\uD83D\uDCAC",
      "Teams Send Wishes",
      "Add a button to send birthday wishes via Microsoft Teams chat",
      state.engagement.enableTeamsDeepLink
    ),

    // Animations
    createToggle(
      "enableAnimations",
      "\uD83C\uDF86",
      "Celebration Animations",
      "Show confetti, balloons, or sparkle effects when someone has a celebration today",
      state.engagement.enableAnimations
    ),

    // Animation type picker (conditional)
    state.engagement.enableAnimations
      ? React.createElement("div", { className: styles.animRow },
          React.createElement("div", { className: styles.stepSectionLabel }, "Animation Style"),
          React.createElement("div", {
            className: styles.animGrid,
            role: "radiogroup",
            "aria-label": "Animation style",
          }, animCards)
        )
      : undefined,

    // Milestone badges
    createToggle(
      "enableMilestoneBadges",
      "\uD83C\uDFC6",
      "Milestone Badges",
      "Display colored badges for years-of-service milestones (1, 5, 10, 15, 20, 25, 30 years)",
      state.engagement.enableMilestoneBadges
    ),

    // Privacy opt-out
    createToggle(
      "enablePrivacyOptOut",
      "\uD83D\uDD12",
      "Privacy Opt-Out",
      "Allow employees to opt out of having their celebrations displayed (GDPR-friendly)",
      state.engagement.enablePrivacyOptOut
    ),

    // Opt-out list name (conditional)
    state.engagement.enablePrivacyOptOut
      ? React.createElement("div", { className: styles.inputRow },
          React.createElement("label", { className: styles.inputLabel, htmlFor: "optOutList" }, "Opt-Out List Name"),
          React.createElement("input", {
            id: "optOutList",
            type: "text",
            className: styles.textInput,
            value: state.engagement.optOutListName,
            onChange: handleOptOutListChange,
            placeholder: "e.g. CelebrationOptOut",
          }),
          React.createElement("span", { className: styles.inputHint },
            "SharePoint list with columns: Title (userId), Email"
          )
        )
      : undefined
  );
};

export default EngagementStep;
