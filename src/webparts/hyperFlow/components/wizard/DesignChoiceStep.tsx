import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperFlowWizardState } from "../../models";
import type { FlowMode } from "../../models";

// ============================================================
// Step 2: Design Choice — Visual Diagram vs Process Stepper
// ============================================================

interface IChoiceCard {
  key: FlowMode;
  title: string;
  description: string;
  tags: string[];
  iconPath: string;
}

var CHOICE_CARDS: IChoiceCard[] = [
  {
    key: "visual",
    title: "Visual Diagram",
    description: "Decorative flowcharts and diagrams \u2014 no backend needed",
    tags: ["5 Styles", "Drag-Drop Designer", "6 Color Themes"],
    iconPath: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 12h8v2H8v-2zm0 4h5v2H8v-2z",
  },
  {
    key: "functional",
    title: "Process Stepper",
    description: "Functional process tracking with status and assignments",
    tags: ["4 Layouts", "Task Tracking", "SharePoint Lists"],
    iconPath: "M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z",
  },
];

var containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "4px 0",
};

var cardBaseStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
  padding: "24px",
  borderRadius: "8px",
  border: "2px solid #e0e0e0",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  transition: "border-color 0.15s, background-color 0.15s",
};

var cardActiveStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
  padding: "24px",
  borderRadius: "8px",
  border: "2px solid #0078d4",
  backgroundColor: "#f0f6ff",
  cursor: "pointer",
  transition: "border-color 0.15s, background-color 0.15s",
};

var iconContainerStyle: React.CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: "12px",
  backgroundColor: "#f0f6ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

var iconContainerActiveStyle: React.CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: "12px",
  backgroundColor: "#d4e8ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

var textContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  flex: "1 1 auto",
};

var titleStyle: React.CSSProperties = {
  fontSize: "17px",
  fontWeight: 600,
  color: "#1a1a1a",
  margin: 0,
  lineHeight: "1.3",
};

var descStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#666666",
  margin: 0,
  lineHeight: "1.4",
};

var tagsContainerStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  marginTop: "4px",
};

var tagStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 500,
  color: "#0078d4",
  backgroundColor: "#e8f2fc",
  padding: "3px 10px",
  borderRadius: "12px",
  lineHeight: "1.4",
};

var checkIconStyle: React.CSSProperties = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  backgroundColor: "#0078d4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  marginTop: "4px",
};

var DesignChoiceStep: React.FC<IWizardStepProps<IHyperFlowWizardState>> = function (props) {
  var state = props.state;

  var handleSelect = React.useCallback(function (mode: FlowMode) {
    props.onChange({ flowMode: mode });
  }, [props]);

  var cards = CHOICE_CARDS.map(function (card) {
    var isActive = state.flowMode === card.key;

    var tagElements = card.tags.map(function (tag, idx) {
      return React.createElement("span", {
        key: String(idx),
        style: tagStyle,
      }, tag);
    });

    return React.createElement("div", {
      key: card.key,
      style: isActive ? cardActiveStyle : cardBaseStyle,
      onClick: function () { handleSelect(card.key); },
      role: "radio",
      "aria-checked": isActive,
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect(card.key);
        }
      },
    },
      // Icon
      React.createElement("div", {
        style: isActive ? iconContainerActiveStyle : iconContainerStyle,
      },
        React.createElement("svg", {
          width: "26",
          height: "26",
          viewBox: "0 0 24 24",
          fill: isActive ? "#0078d4" : "#666666",
          "aria-hidden": "true",
        },
          React.createElement("path", { d: card.iconPath })
        )
      ),

      // Text + tags
      React.createElement("div", { style: textContainerStyle },
        React.createElement("div", { style: titleStyle }, card.title),
        React.createElement("div", { style: descStyle }, card.description),
        React.createElement("div", { style: tagsContainerStyle }, tagElements)
      ),

      // Check indicator
      isActive
        ? React.createElement("div", { style: checkIconStyle },
            React.createElement("svg", {
              width: "14",
              height: "14",
              viewBox: "0 0 24 24",
              fill: "#ffffff",
              "aria-hidden": "true",
            },
              React.createElement("path", { d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" })
            )
          )
        : undefined
    );
  });

  return React.createElement("div", {
    style: containerStyle,
    role: "radiogroup",
    "aria-label": "Flow mode options",
  }, cards);
};

export default DesignChoiceStep;
