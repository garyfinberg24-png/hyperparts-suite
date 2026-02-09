import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IBirthdaysWizardState } from "../../models/IHyperBirthdaysWizardState";
import styles from "./WizardSteps.module.scss";

var DataSourcesStep: React.FC<IWizardStepProps<IBirthdaysWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleEntraIdToggle = React.useCallback(function (): void {
    onChange({
      dataSources: Object.assign({}, state.dataSources, {
        enableEntraId: !state.dataSources.enableEntraId,
      }),
    });
  }, [state.dataSources, onChange]);

  var handleSpListToggle = React.useCallback(function (): void {
    onChange({
      dataSources: Object.assign({}, state.dataSources, {
        enableSpList: !state.dataSources.enableSpList,
      }),
    });
  }, [state.dataSources, onChange]);

  var handleListNameChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    onChange({
      dataSources: Object.assign({}, state.dataSources, {
        spListName: e.target.value,
      }),
    });
  }, [state.dataSources, onChange]);

  var entraToggleId = "ds-entra";
  var spListToggleId = "ds-splist";

  return React.createElement("div", { className: styles.stepContainer },
    // Entra ID source card
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Data Sources"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Select at least one data source. You can combine both for a complete view."
      )
    ),

    // Entra ID toggle
    React.createElement("div", {
      className: state.dataSources.enableEntraId ? styles.sourceCardActive : styles.sourceCardOption,
      onClick: handleEntraIdToggle,
      role: "checkbox",
      "aria-checked": String(state.dataSources.enableEntraId),
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent): void {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleEntraIdToggle();
        }
      },
    },
      React.createElement("div", { className: styles.sourceCardLeft },
        React.createElement("span", { className: styles.sourceCardIcon }, "\uD83D\uDD11"),
        React.createElement("div", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, "Entra ID (Microsoft 365)"),
          React.createElement("span", { className: styles.toggleDesc },
            "Auto-detect birthdays and hire dates from your Azure AD directory. Requires User.Read.All permission."
          )
        )
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          type: "checkbox",
          id: entraToggleId,
          className: styles.toggleInput,
          checked: state.dataSources.enableEntraId,
          onChange: handleEntraIdToggle,
          tabIndex: -1,
          "aria-hidden": "true",
        }),
        React.createElement("label", { className: styles.toggleTrack, htmlFor: entraToggleId },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    ),

    state.dataSources.enableEntraId
      ? React.createElement("div", { className: styles.sourceHint },
          "\u2139\uFE0F Entra ID provides birthday and employeeHireDate fields. Other celebration types require a SharePoint list."
        )
      : undefined,

    // SharePoint List toggle
    React.createElement("div", {
      className: state.dataSources.enableSpList ? styles.sourceCardActive : styles.sourceCardOption,
      onClick: handleSpListToggle,
      role: "checkbox",
      "aria-checked": String(state.dataSources.enableSpList),
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent): void {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSpListToggle();
        }
      },
    },
      React.createElement("div", { className: styles.sourceCardLeft },
        React.createElement("span", { className: styles.sourceCardIcon }, "\uD83D\uDCCB"),
        React.createElement("div", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, "SharePoint List"),
          React.createElement("span", { className: styles.toggleDesc },
            "Use a custom list with columns for all celebration types: weddings, babies, promotions, and more."
          )
        )
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          type: "checkbox",
          id: spListToggleId,
          className: styles.toggleInput,
          checked: state.dataSources.enableSpList,
          onChange: handleSpListToggle,
          tabIndex: -1,
          "aria-hidden": "true",
        }),
        React.createElement("label", { className: styles.toggleTrack, htmlFor: spListToggleId },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    ),

    // SP List name field (conditional)
    state.dataSources.enableSpList
      ? React.createElement("div", { className: styles.inputRow },
          React.createElement("label", { className: styles.inputLabel, htmlFor: "spListName" }, "List Name"),
          React.createElement("input", {
            id: "spListName",
            type: "text",
            className: styles.textInput,
            value: state.dataSources.spListName,
            onChange: handleListNameChange,
            placeholder: "e.g. Celebrations, Employee Milestones",
          }),
          React.createElement("span", { className: styles.inputHint },
            "Required columns: Title, Email, CelebrationType, CelebrationDate (MM-DD), CelebrationYear, CustomLabel, UserId"
          )
        )
      : undefined,

    // Validation warning
    !state.dataSources.enableEntraId && !state.dataSources.enableSpList
      ? React.createElement("div", { className: styles.validationWarning },
          "\u26A0\uFE0F Please enable at least one data source to continue."
        )
      : undefined
  );
};

export default DataSourcesStep;
