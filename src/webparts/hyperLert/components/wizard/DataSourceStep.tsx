import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ILertWizardState } from "./lertWizardConfig";
import styles from "./WizardSteps.module.scss";

// ============================================================
// DataSourceStep — Sample Data, SharePoint List, or Graph API
// Three radio-style cards with conditional input fields
// ============================================================

var DataSourceStep: React.FC<IWizardStepProps<ILertWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleSelectSample = React.useCallback(function (): void {
    onChange({ dataSource: "sample", listName: "", graphEndpoint: "" });
  }, [onChange]);

  var handleSelectList = React.useCallback(function (): void {
    onChange({ dataSource: "spList", graphEndpoint: "" });
  }, [onChange]);

  var handleSelectGraph = React.useCallback(function (): void {
    onChange({ dataSource: "graphApi", listName: "" });
  }, [onChange]);

  var handleListNameChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    onChange({ listName: e.target.value });
  }, [onChange]);

  var handleGraphEndpointChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    onChange({ graphEndpoint: e.target.value });
  }, [onChange]);

  var isSampleSelected = state.dataSource === "sample";
  var isListSelected = state.dataSource === "spList";
  var isGraphSelected = state.dataSource === "graphApi";

  var sampleCardClass = isSampleSelected
    ? styles.sourceCard + " " + styles.sourceCardActive
    : styles.sourceCard;

  var listCardClass = isListSelected
    ? styles.sourceCard + " " + styles.sourceCardActive
    : styles.sourceCard;

  var graphCardClass = isGraphSelected
    ? styles.sourceCard + " " + styles.sourceCardActive
    : styles.sourceCard;

  // Build conditional input for SP list
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
        placeholder: "e.g. AlertMonitorData",
        "aria-label": "SharePoint list name",
      }),
      React.createElement("span", { className: styles.sourceInputHint },
        "Enter the name of a SharePoint list to monitor for changes (must have Title, Status, Category columns)"
      )
    );
  }

  // Build conditional input for Graph endpoint
  var graphEndpointInput: React.ReactElement | undefined;
  if (isGraphSelected) {
    graphEndpointInput = React.createElement("div", {
      className: styles.sourceInputArea,
      key: "graphEndpointInput",
    },
      React.createElement("label", { className: styles.sourceInputLabel },
        "Graph API Endpoint"
      ),
      React.createElement("input", {
        type: "text",
        className: styles.textInput,
        value: state.graphEndpoint,
        onChange: handleGraphEndpointChange,
        placeholder: "e.g. /sites/{siteId}/lists/{listId}/items",
        "aria-label": "Graph API endpoint path",
      }),
      React.createElement("span", { className: styles.sourceInputHint },
        "Enter a Microsoft Graph API endpoint path to monitor (requires appropriate Graph permissions)"
      )
    );
  }

  // Build validation hint
  var validationHint: React.ReactElement | undefined;
  if (isListSelected && state.listName.length === 0) {
    validationHint = React.createElement("div", { className: styles.validationHint },
      "Please enter a list name to continue"
    );
  } else if (isGraphSelected && state.graphEndpoint.length === 0) {
    validationHint = React.createElement("div", { className: styles.validationHint },
      "Please enter a Graph API endpoint to continue"
    );
  }

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Where does your alert data come from?"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Choose a data source for monitoring. You can switch later in the property pane."
      )
    ),

    // Three option cards
    React.createElement("div", { className: styles.sourceCards },
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
          "Use 15 built-in alerts and 5 rules to explore features"
        )
      ),

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
          "Monitor an existing SharePoint list for changes"
        )
      ),

      // Graph API card
      React.createElement("button", {
        className: graphCardClass,
        onClick: handleSelectGraph,
        type: "button",
        role: "option",
        "aria-selected": isGraphSelected,
      },
        React.createElement("div", { className: styles.sourceIcon, "aria-hidden": "true" }, "\uD83C\uDF10"),
        React.createElement("div", { className: styles.sourceTitle }, "Graph API"),
        React.createElement("div", { className: styles.sourceDesc },
          "Connect to Microsoft Graph for cross-service monitoring"
        )
      )
    ),

    // Conditional inputs
    listNameInput,
    graphEndpointInput,

    // Validation hint
    validationHint
  );
};

export default DataSourceStep;
