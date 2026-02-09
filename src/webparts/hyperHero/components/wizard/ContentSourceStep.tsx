import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHeroWizardState } from "./heroWizardConfig";
import styles from "./ContentSourceStep.module.scss";

/**
 * Content Source step — two large cards: "Manual Slides" vs "SharePoint List".
 * Sets state.mode to "manual" or "list".
 */
var ContentSourceStep: React.FC<IWizardStepProps<IHeroWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleManualClick = React.useCallback(function (): void {
    onChange({ mode: "manual" });
  }, [onChange]);

  var handleListClick = React.useCallback(function (): void {
    onChange({ mode: "list" });
  }, [onChange]);

  var handleKeyDown = React.useCallback(function (mode: "manual" | "list", e: React.KeyboardEvent<HTMLDivElement>): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange({ mode: mode });
    }
  }, [onChange]);

  var manualClasses = styles.modeCard +
    (state.mode === "manual" ? " " + styles.modeCardSelected : "");

  var listClasses = styles.modeCard +
    (state.mode === "list" ? " " + styles.modeCardSelected : "");

  return React.createElement("div", { className: styles.modeStepContainer },
    // Step header
    React.createElement("div", { className: styles.stepHeader },
      React.createElement("div", { className: styles.stepHeaderIcon, "aria-hidden": "true" }, "\uD83D\uDD00"),
      React.createElement("div", { className: styles.stepHeaderContent },
        React.createElement("h3", { className: styles.stepHeaderTitle }, "Choose Content Source"),
        React.createElement("p", { className: styles.stepHeaderDescription },
          "How do you want to manage your hero content? You can change this later in the property pane."
        )
      )
    ),
    React.createElement("div", { className: styles.modeCards },
      // Manual card
      React.createElement("div", {
        className: manualClasses,
        onClick: handleManualClick,
        onKeyDown: function (e: React.KeyboardEvent<HTMLDivElement>): void { handleKeyDown("manual", e); },
        role: "radio",
        "aria-checked": state.mode === "manual" ? "true" : "false",
        tabIndex: 0,
      },
        React.createElement("span", { className: styles.modeCardIcon, "aria-hidden": "true" }, "\uD83C\uDFA8"),
        React.createElement("h4", { className: styles.modeCardTitle }, "Manual Slides"),
        React.createElement("p", { className: styles.modeCardDescription },
          "Create custom slides with images, videos, and call-to-action buttons. Full control over every slide."
        )
      ),
      // List binding card
      React.createElement("div", {
        className: listClasses,
        onClick: handleListClick,
        onKeyDown: function (e: React.KeyboardEvent<HTMLDivElement>): void { handleKeyDown("list", e); },
        role: "radio",
        "aria-checked": state.mode === "list" ? "true" : "false",
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

export default ContentSourceStep;
