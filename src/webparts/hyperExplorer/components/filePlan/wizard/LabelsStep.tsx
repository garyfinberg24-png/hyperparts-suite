import * as React from "react";
import type { IWizardStepProps } from "../../../../../common/components/wizard/IHyperWizard";
import type { IFilePlanWizardState, IRetentionLabel } from "../../../models";
import { formatRetentionDuration, formatRetentionAction, formatRetentionBehavior } from "../../../models";
import { getSampleRetentionLabels } from "../../../utils/sampleData";
import styles from "./WizardSteps.module.scss";

/**
 * Step 2: Retention Labels
 * Select which MS Purview retention labels to enable.
 */
export var LabelsStep: React.FC<IWizardStepProps<IFilePlanWizardState>> = function (props) {
  var labelState = props.state.labels;

  // Load available labels (sample data for wizard preview)
  var availableLabels = React.useMemo(function (): IRetentionLabel[] {
    return getSampleRetentionLabels();
  }, []);

  var toggleLabel = React.useCallback(function (labelId: string): void {
    var current = labelState.selectedLabelIds;
    var idx = current.indexOf(labelId);
    var next: string[];
    if (idx !== -1) {
      next = current.filter(function (id) { return id !== labelId; });
    } else {
      next = current.concat([labelId]);
    }
    // If removing the default label, clear it
    var nextDefault = labelState.defaultLabelId;
    if (nextDefault && next.indexOf(nextDefault) === -1) {
      nextDefault = undefined;
    }
    props.onChange({
      labels: {
        selectedLabelIds: next,
        defaultLabelId: nextDefault,
        requireLabel: labelState.requireLabel,
      },
    });
  }, [props.onChange, labelState]);

  var handleDefaultChange = React.useCallback(function (e: React.ChangeEvent<HTMLSelectElement>): void {
    var val = (e.target as HTMLSelectElement).value;
    props.onChange({
      labels: {
        selectedLabelIds: labelState.selectedLabelIds,
        defaultLabelId: val || undefined,
        requireLabel: labelState.requireLabel,
      },
    });
  }, [props.onChange, labelState.selectedLabelIds, labelState.requireLabel]);

  var handleRequireToggle = React.useCallback(function (): void {
    props.onChange({
      labels: {
        selectedLabelIds: labelState.selectedLabelIds,
        defaultLabelId: labelState.defaultLabelId,
        requireLabel: !labelState.requireLabel,
      },
    });
  }, [props.onChange, labelState]);

  /** Badge class for retention behavior */
  function getBehaviorBadgeClass(behavior: string): string {
    if (behavior === "retainAsRegulatoryRecord") return styles.badgeRed;
    if (behavior === "retainAsRecord") return styles.badgeGreen;
    return styles.badgeBlue;
  }

  // Build label cards
  var labelCards = availableLabels.map(function (label: IRetentionLabel) {
    var isSelected = labelState.selectedLabelIds.indexOf(label.id) !== -1;

    return React.createElement("div", {
      key: label.id,
      className: isSelected ? styles.labelCardSelected : styles.labelCard,
      onClick: function () { toggleLabel(label.id); },
      role: "checkbox",
      "aria-checked": String(isSelected),
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleLabel(label.id);
        }
      },
    },
      React.createElement("input", {
        type: "checkbox",
        className: styles.labelCheckbox,
        checked: isSelected,
        onChange: function () { toggleLabel(label.id); },
        tabIndex: -1,
        "aria-hidden": "true",
      }),
      React.createElement("span", { className: styles.labelInfo },
        React.createElement("span", { className: styles.labelName }, label.displayName),
        React.createElement("span", { className: styles.labelDescription }, label.descriptionForUsers),
        React.createElement("span", { className: styles.labelMeta },
          React.createElement("span", { className: styles.badgeBlue },
            formatRetentionDuration(label.retentionDuration)
          ),
          React.createElement("span", { className: styles.badgeOrange },
            formatRetentionAction(label.actionAfterRetentionPeriod)
          ),
          React.createElement("span", { className: getBehaviorBadgeClass(label.behaviorDuringRetentionPeriod) },
            formatRetentionBehavior(label.behaviorDuringRetentionPeriod)
          )
        )
      )
    );
  });

  // Default label dropdown options (only from selected labels)
  var defaultOptions: React.ReactElement[] = [
    React.createElement("option", { key: "none", value: "" }, "None (manual only)"),
  ];
  labelState.selectedLabelIds.forEach(function (labelId) {
    var matches = availableLabels.filter(function (l) { return l.id === labelId; });
    if (matches.length > 0) {
      var match = matches[0];
      defaultOptions.push(
        React.createElement("option", { key: match.id, value: match.id }, match.displayName)
      );
    }
  });

  return React.createElement("div", { className: styles.stepContainer },
    // Label selection
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Available Retention Labels"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Select which MS Purview retention labels users can apply to files in this library."
      ),
      labelCards
    ),

    // Default label
    labelState.selectedLabelIds.length > 0
      ? React.createElement("div", { className: styles.stepSection },
          React.createElement("div", { className: styles.stepSectionLabel }, "Default Label"),
          React.createElement("div", { className: styles.stepSectionHint },
            "Automatically apply this label to new uploads (optional)."
          ),
          React.createElement("div", { className: styles.inputGroup },
            React.createElement("select", {
              className: styles.selectInput,
              value: labelState.defaultLabelId || "",
              onChange: handleDefaultChange,
              "aria-label": "Default retention label",
            }, defaultOptions)
          )
        )
      : undefined,

    // Require label toggle
    labelState.selectedLabelIds.length > 0
      ? React.createElement("div", { className: styles.stepSection },
          React.createElement("label", { className: styles.toggleRow },
            React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, "\uD83D\uDD12"),
            React.createElement("span", { className: styles.toggleInfo },
              React.createElement("span", { className: styles.toggleLabel }, "Require Retention Label"),
              React.createElement("span", { className: styles.toggleDesc },
                "Block file uploads unless a retention label is selected. Ensures full compliance coverage."
              )
            ),
            React.createElement("span", { className: styles.toggleSwitch },
              React.createElement("input", {
                type: "checkbox",
                className: styles.toggleInput,
                checked: labelState.requireLabel,
                onChange: handleRequireToggle,
                "aria-label": "Require retention label on upload",
              }),
              React.createElement("span", { className: styles.toggleTrack },
                React.createElement("span", { className: styles.toggleThumb })
              )
            )
          )
        )
      : undefined,

    // Hint
    React.createElement("div", { className: styles.hintBox },
      "In production, retention labels are fetched from MS Purview via the Graph API. " +
      "Ensure the RecordsManagement.Read.All permission is granted."
    )
  );
};
