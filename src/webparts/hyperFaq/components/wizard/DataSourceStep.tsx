import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IFaqWizardState } from "./faqWizardConfig";
import styles from "./WizardSteps.module.scss";

// ============================================================
// DataSourceStep — SharePoint List or Sample Data
// Two big option cards with conditional list name input
// ============================================================

var DataSourceStep: React.FC<IWizardStepProps<IFaqWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleSelectList = React.useCallback(function (): void {
    onChange({ dataSource: "list" });
  }, [onChange]);

  var handleSelectSample = React.useCallback(function (): void {
    onChange({ dataSource: "sample", listName: "" });
  }, [onChange]);

  var handleListNameChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    onChange({ listName: e.target.value });
  }, [onChange]);

  var isListSelected = state.dataSource === "list";
  var isSampleSelected = state.dataSource === "sample";

  var listCardClass = isListSelected
    ? styles.sourceCard + " " + styles.sourceCardActive
    : styles.sourceCard;

  var sampleCardClass = isSampleSelected
    ? styles.sourceCard + " " + styles.sourceCardActive
    : styles.sourceCard;

  // Build list name input (only shown when list is selected)
  var listNameInput: React.ReactElement | undefined;
  if (isListSelected) {
    listNameInput = React.createElement("div", {
      className: styles.sourceInputArea,
      key: "listNameInput",
    },
      React.createElement("label", { className: styles.sourceInputLabel },
        "SharePoint List Name"
      ),
      React.createElement("input", {
        type: "text",
        className: styles.textInput,
        value: state.listName,
        onChange: handleListNameChange,
        placeholder: "e.g. Site FAQ",
        "aria-label": "SharePoint list name",
      }),
      React.createElement("span", { className: styles.sourceInputHint },
        "Enter the name of a SharePoint list with FAQ items (Title, Answer, Category, Tags columns)"
      )
    );
  }

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Where does your FAQ content come from?"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Choose a data source for your FAQ items. You can switch later in the property pane."
      )
    ),

    // Two option cards
    React.createElement("div", { className: styles.sourceCards },
      // SharePoint List card
      React.createElement("button", {
        className: listCardClass,
        onClick: handleSelectList,
        type: "button",
        role: "option",
        "aria-selected": isListSelected,
      },
        React.createElement("div", { className: styles.sourceIcon, "aria-hidden": "true" }, "\uD83D\uDCCB"),
        React.createElement("div", { className: styles.sourceTitle }, "SharePoint List"),
        React.createElement("div", { className: styles.sourceDesc },
          "Connect to an existing FAQ list"
        )
      ),

      // Sample Data card
      React.createElement("button", {
        className: sampleCardClass,
        onClick: handleSelectSample,
        type: "button",
        role: "option",
        "aria-selected": isSampleSelected,
      },
        React.createElement("div", { className: styles.sourceIcon, "aria-hidden": "true" }, "\uD83E\uDDEA"),
        React.createElement("div", { className: styles.sourceTitle }, "Sample Data"),
        React.createElement("div", { className: styles.sourceDesc },
          "Use 30 built-in sample FAQs to explore features"
        )
      )
    ),

    // List name input (conditional)
    listNameInput,

    // Validation hint
    isListSelected && state.listName.length === 0
      ? React.createElement("div", { className: styles.validationHint },
          "Please enter a list name to continue"
        )
      : undefined
  );
};

export default DataSourceStep;
