import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperFlowWizardState } from "../../models";
import type { FlowCreationPath } from "../../models";

// ============================================================
// Step 1: Creation Path — Choose how to create a flow
// ============================================================

interface IPathCard {
  key: FlowCreationPath;
  title: string;
  description: string;
  iconPath: string;
}

var PATH_CARDS: IPathCard[] = [
  {
    key: "design-your-own",
    title: "Design Your Own",
    description: "Start with a blank canvas and build your flow from scratch",
    iconPath: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
  },
  {
    key: "templates",
    title: "HyperFlow Templates",
    description: "Browse 6 pre-built functional process templates",
    iconPath: "M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 2a2 2 0 114 0 2 2 0 01-4 0zm2-2a4 4 0 100 8 4 4 0 000-8z",
  },
  {
    key: "visual-presets",
    title: "Visual Presets",
    description: "Pick from 5 beautiful visual diagram styles",
    iconPath: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
  },
];

var containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "4px 0",
};

var cardBaseStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "20px",
  borderRadius: "8px",
  border: "2px solid #e0e0e0",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  transition: "border-color 0.15s, background-color 0.15s",
};

var cardActiveStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "20px",
  borderRadius: "8px",
  border: "2px solid #0078d4",
  backgroundColor: "#f0f6ff",
  cursor: "pointer",
  transition: "border-color 0.15s, background-color 0.15s",
};

var iconContainerStyle: React.CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  backgroundColor: "#f0f6ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

var iconContainerActiveStyle: React.CSSProperties = {
  width: "48px",
  height: "48px",
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
  gap: "4px",
  flex: "1 1 auto",
};

var titleStyle: React.CSSProperties = {
  fontSize: "16px",
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

var checkIconStyle: React.CSSProperties = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  backgroundColor: "#0078d4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

var CreationPathStep: React.FC<IWizardStepProps<IHyperFlowWizardState>> = function (props) {
  var state = props.state;

  var handleSelect = React.useCallback(function (path: FlowCreationPath) {
    props.onChange({ creationPath: path });
  }, [props]);

  var cards = PATH_CARDS.map(function (card) {
    var isActive = state.creationPath === card.key;

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
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: isActive ? "#0078d4" : "#666666",
          "aria-hidden": "true",
        },
          React.createElement("path", { d: card.iconPath })
        )
      ),

      // Text
      React.createElement("div", { style: textContainerStyle },
        React.createElement("div", { style: titleStyle }, card.title),
        React.createElement("div", { style: descStyle }, card.description)
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
    "aria-label": "Creation path options",
  }, cards);
};

export default CreationPathStep;
