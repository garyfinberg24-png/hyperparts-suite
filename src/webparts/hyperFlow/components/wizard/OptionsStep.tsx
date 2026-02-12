import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperFlowWizardState } from "../../models";

// ============================================================
// Step 5: Options — Title and display preferences
// ============================================================

// Styles
var containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "4px 0",
};

var sectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

var sectionLabelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#1a1a1a",
};

var sectionHintStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#666666",
  marginBottom: "4px",
};

var inputStyle: React.CSSProperties = {
  fontSize: "14px",
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid #d0d0d0",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
  color: "#1a1a1a",
  backgroundColor: "#ffffff",
};

var toggleGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

var toggleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 14px",
  borderRadius: "6px",
  backgroundColor: "#fafafa",
  border: "1px solid #eeeeee",
};

var checkboxStyle: React.CSSProperties = {
  width: "18px",
  height: "18px",
  accentColor: "#0078d4",
  cursor: "pointer",
  flexShrink: 0,
};

var toggleTextContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  flex: "1 1 auto",
};

var toggleLabelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#1a1a1a",
  cursor: "pointer",
};

var toggleDescStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#888888",
};

interface IToggleDef {
  key: "showStepNumbers" | "enableAnimation" | "showConnectorLabels";
  label: string;
  description: string;
}

var TOGGLES: IToggleDef[] = [
  {
    key: "showStepNumbers",
    label: "Show Step Numbers",
    description: "Display numbered badges on each flow node",
  },
  {
    key: "enableAnimation",
    label: "Enable Animations",
    description: "Animate transitions and connector paths when the flow renders",
  },
  {
    key: "showConnectorLabels",
    label: "Show Connector Labels",
    description: "Display text labels on the lines connecting flow nodes",
  },
];

var OptionsStep: React.FC<IWizardStepProps<IHyperFlowWizardState>> = function (props) {
  var state = props.state;

  var handleTitleChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>) {
    props.onChange({ title: e.target.value });
  }, [props]);

  var handleToggle = React.useCallback(function (key: IToggleDef["key"]) {
    var update: Partial<IHyperFlowWizardState> = {};
    update[key] = !state[key];
    props.onChange(update);
  }, [props, state]);

  // Title input section
  var titleSection = React.createElement("div", { style: sectionStyle },
    React.createElement("label", {
      style: sectionLabelStyle,
      htmlFor: "flow-title-input",
    }, "Flow Title"),
    React.createElement("div", { style: sectionHintStyle },
      "Give your flow a descriptive title. This is displayed above the diagram."
    ),
    React.createElement("input", {
      id: "flow-title-input",
      type: "text",
      value: state.title,
      onChange: handleTitleChange,
      placeholder: "e.g. Approval Process, Sales Pipeline",
      style: inputStyle,
      autoComplete: "off",
    })
  );

  // Toggle switches section
  var toggleElements = TOGGLES.map(function (toggle) {
    var isChecked = state[toggle.key];
    var toggleId = "flow-toggle-" + toggle.key;

    return React.createElement("div", {
      key: toggle.key,
      style: toggleRowStyle,
    },
      React.createElement("input", {
        id: toggleId,
        type: "checkbox",
        checked: isChecked,
        onChange: function () { handleToggle(toggle.key); },
        style: checkboxStyle,
        "aria-describedby": toggleId + "-desc",
      }),
      React.createElement("div", { style: toggleTextContainerStyle },
        React.createElement("label", {
          htmlFor: toggleId,
          style: toggleLabelStyle,
        }, toggle.label),
        React.createElement("span", {
          id: toggleId + "-desc",
          style: toggleDescStyle,
        }, toggle.description)
      )
    );
  });

  var togglesSection = React.createElement("div", { style: sectionStyle },
    React.createElement("div", { style: sectionLabelStyle }, "Display Options"),
    React.createElement("div", { style: sectionHintStyle },
      "Configure how the flow is presented on the page."
    ),
    React.createElement("div", { style: toggleGroupStyle }, toggleElements)
  );

  return React.createElement("div", { style: containerStyle },
    titleSection,
    togglesSection
  );
};

export default OptionsStep;
