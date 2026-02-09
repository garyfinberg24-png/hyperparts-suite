import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IBirthdaysWizardState, IWizardCelebrationTypes } from "../../models/IHyperBirthdaysWizardState";
import { CELEBRATION_CONFIGS } from "../../models/ICelebrationType";
import type { CelebrationType } from "../../models";
import styles from "./WizardSteps.module.scss";

// Ordered list of celebration types with descriptions
var CELEBRATION_TYPE_INFO: Array<{
  key: keyof IWizardCelebrationTypes;
  type: CelebrationType;
  description: string;
}> = [
  { key: "enableBirthdays", type: "birthday", description: "Employee personal birthdays from Entra ID or list" },
  { key: "enableAnniversaries", type: "workAnniversary", description: "Work tenure milestones with year badges" },
  { key: "enableWeddings", type: "wedding", description: "Marriage and engagement celebrations" },
  { key: "enableChildBirth", type: "childBirth", description: "New baby and adoption announcements" },
  { key: "enableGraduation", type: "graduation", description: "Degree completion and certifications" },
  { key: "enableRetirement", type: "retirement", description: "Career milestone and farewell celebrations" },
  { key: "enablePromotion", type: "promotion", description: "Career advancement and role changes" },
  { key: "enableCustom", type: "custom", description: "Custom events defined in your SharePoint list" },
];

var CelebrationTypesStep: React.FC<IWizardStepProps<IBirthdaysWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleToggle = React.useCallback(function (key: keyof IWizardCelebrationTypes): void {
    var updated: Partial<IWizardCelebrationTypes> = {};
    updated[key] = !state.celebrationTypes[key];
    onChange({
      celebrationTypes: Object.assign({}, state.celebrationTypes, updated),
    });
  }, [state.celebrationTypes, onChange]);

  var enabledCount = 0;
  CELEBRATION_TYPE_INFO.forEach(function (info) {
    if (state.celebrationTypes[info.key]) {
      enabledCount++;
    }
  });

  var items: React.ReactElement[] = [];

  CELEBRATION_TYPE_INFO.forEach(function (info) {
    var config = CELEBRATION_CONFIGS[info.type];
    var isEnabled = state.celebrationTypes[info.key];
    var toggleId = "celebToggle-" + info.key;

    items.push(
      React.createElement("div", {
        key: info.key,
        className: isEnabled ? styles.celebCardActive : styles.celebCard,
        onClick: function () { handleToggle(info.key); },
        role: "checkbox",
        "aria-checked": String(isEnabled),
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent): void {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle(info.key);
          }
        },
      },
        React.createElement("span", {
          className: styles.celebCardEmoji,
          style: { borderColor: isEnabled ? config.primaryColor : undefined },
        }, config.emoji),
        React.createElement("div", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, config.displayName),
          React.createElement("span", { className: styles.toggleDesc }, info.description)
        ),
        React.createElement("div", { className: styles.toggleSwitch },
          React.createElement("input", {
            type: "checkbox",
            id: toggleId,
            className: styles.toggleInput,
            checked: isEnabled,
            onChange: function () { handleToggle(info.key); },
            tabIndex: -1,
            "aria-hidden": "true",
          }),
          React.createElement("label", {
            className: styles.toggleTrack,
            htmlFor: toggleId,
          },
            React.createElement("span", { className: styles.toggleThumb })
          )
        )
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel },
        "Select Celebration Types (" + enabledCount + " of 8 enabled)"
      ),
      React.createElement("div", { className: styles.stepSectionHint },
        "Choose at least one type. Birthdays and Anniversaries are enabled by default."
      )
    ),
    React.createElement("div", { className: styles.celebGrid }, items)
  );
};

export default CelebrationTypesStep;
