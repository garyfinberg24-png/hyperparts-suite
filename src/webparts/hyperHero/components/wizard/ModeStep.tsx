import * as React from "react";
import styles from "./ModeStep.module.scss";

export type WizardMode = "manual" | "list";

export interface IModeStepProps {
  selectedMode: WizardMode | undefined;
  onModeSelect: (mode: WizardMode) => void;
}

const ModeStep: React.FC<IModeStepProps> = function (props) {
  const handleManualClick = React.useCallback(function () {
    props.onModeSelect("manual");
  }, [props.onModeSelect]);

  const handleListClick = React.useCallback(function () {
    props.onModeSelect("list");
  }, [props.onModeSelect]);

  const handleKeyDown = React.useCallback(function (mode: WizardMode, e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      props.onModeSelect(mode);
    }
  }, [props.onModeSelect]);

  // Manual card classes
  const manualClasses = styles.modeCard +
    (props.selectedMode === "manual" ? " " + styles.modeCardSelected : "");

  // List card classes
  const listClasses = styles.modeCard +
    (props.selectedMode === "list" ? " " + styles.modeCardSelected : "");

  return React.createElement("div", { className: styles.modeStepContainer },
    React.createElement("h3", { className: styles.modeStepTitle }, "How do you want to manage your hero content?"),
    React.createElement("p", { className: styles.modeStepDescription },
      "Choose how tiles are populated. You can change this later in the property pane."
    ),
    React.createElement("div", { className: styles.modeCards },
      // Manual card
      React.createElement("div", {
        className: manualClasses,
        onClick: handleManualClick,
        onKeyDown: function (e: React.KeyboardEvent<HTMLDivElement>) { handleKeyDown("manual", e); },
        role: "radio",
        "aria-checked": props.selectedMode === "manual" ? "true" : "false",
        tabIndex: 0,
      },
        React.createElement("span", { className: styles.modeCardIcon, "aria-hidden": "true" }, "\uD83C\uDFA8"),
        React.createElement("h4", { className: styles.modeCardTitle }, "Manual Tiles"),
        React.createElement("p", { className: styles.modeCardDescription },
          "Create custom tiles with images, videos, and call-to-action buttons. Full control over every tile."
        )
      ),
      // List binding card
      React.createElement("div", {
        className: listClasses,
        onClick: handleListClick,
        onKeyDown: function (e: React.KeyboardEvent<HTMLDivElement>) { handleKeyDown("list", e); },
        role: "radio",
        "aria-checked": props.selectedMode === "list" ? "true" : "false",
        tabIndex: 0,
      },
        React.createElement("span", { className: styles.modeCardIcon, "aria-hidden": "true" }, "\uD83D\uDCCB"),
        React.createElement("h4", { className: styles.modeCardTitle }, "SharePoint List"),
        React.createElement("p", { className: styles.modeCardDescription },
          "Pull content dynamically from a SharePoint list. Great for team-managed rotating content."
        )
      )
    )
  );
};

export default ModeStep;
