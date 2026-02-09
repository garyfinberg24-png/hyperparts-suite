import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHeroWizardState } from "./heroWizardConfig";
import styles from "./ModeStep.module.scss";

/**
 * Slider Mode step — two large cards: "Simple Slider" vs "Hyper Slider".
 * Sets state.sliderMode to "simple" or "hyper".
 *
 * - Simple = 4 editor tabs (Background/Content/Buttons/Fonts)
 * - Hyper  = 7 tabs (+ Advanced/Animations/A11y) + Quick Styles bar + templates
 */
var SliderModeStep: React.FC<IWizardStepProps<IHeroWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleSimpleClick = React.useCallback(function (): void {
    onChange({ sliderMode: "simple" });
  }, [onChange]);

  var handleHyperClick = React.useCallback(function (): void {
    onChange({ sliderMode: "hyper" });
  }, [onChange]);

  var handleKeyDown = React.useCallback(function (
    mode: "simple" | "hyper",
    e: React.KeyboardEvent<HTMLDivElement>
  ): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange({ sliderMode: mode });
    }
  }, [onChange]);

  var simpleClasses = styles.modeCard +
    (state.sliderMode === "simple" ? " " + styles.modeCardSelected : "");

  var hyperClasses = styles.modeCard +
    (state.sliderMode === "hyper" ? " " + styles.modeCardSelected : "");

  return React.createElement("div", { className: styles.modeStepContainer },
    // Step header
    React.createElement("div", { className: styles.stepHeader },
      React.createElement("div", { className: styles.stepHeaderIcon, "aria-hidden": "true" }, "\u2699\uFE0F"),
      React.createElement("div", { className: styles.stepHeaderContent },
        React.createElement("h3", { className: styles.stepHeaderTitle }, "Choose Slider Mode"),
        React.createElement("p", { className: styles.stepHeaderDescription },
          "Select how powerful your hero slider should be. Simple mode is quick to set up; Hyper mode unlocks every feature."
        )
      )
    ),
    React.createElement("div", { className: styles.modeCards, role: "radiogroup", "aria-label": "Slider mode" },
      // Simple card
      React.createElement("div", {
        className: simpleClasses,
        onClick: handleSimpleClick,
        onKeyDown: function (e: React.KeyboardEvent<HTMLDivElement>): void { handleKeyDown("simple", e); },
        role: "radio",
        "aria-checked": state.sliderMode === "simple" ? "true" : "false",
        tabIndex: 0,
      },
        React.createElement("span", { className: styles.modeCardIcon, "aria-hidden": "true" }, "\uD83D\uDDBC\uFE0F"),
        React.createElement("h4", { className: styles.modeCardTitle }, "Simple Slider"),
        React.createElement("p", { className: styles.modeCardDescription },
          "Quick setup with 4 editor tabs: Background, Content, Buttons, and Fonts. Perfect for straightforward hero banners."
        )
      ),
      // Hyper card
      React.createElement("div", {
        className: hyperClasses,
        onClick: handleHyperClick,
        onKeyDown: function (e: React.KeyboardEvent<HTMLDivElement>): void { handleKeyDown("hyper", e); },
        role: "radio",
        "aria-checked": state.sliderMode === "hyper" ? "true" : "false",
        tabIndex: 0,
      },
        React.createElement("span", { className: styles.modeCardIcon, "aria-hidden": "true" }, "\u26A1"),
        React.createElement("h4", { className: styles.modeCardTitle }, "Hyper Slider"),
        React.createElement("p", { className: styles.modeCardDescription },
          "Full power with 7 tabs, animations timeline, accessibility checks, Quick Styles bar, and template gallery."
        )
      )
    )
  );
};

export default SliderModeStep;
