import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ITickerWizardState } from "../../models/ITickerWizardState";
import type { TickerSeverity } from "../../models";
import styles from "./WizardSteps.module.scss";

const AppearanceStep: React.FC<IWizardStepProps<ITickerWizardState>> = function (props) {
  const onChange = props.onChange;
  const state = props.state;

  return React.createElement("div", { className: styles.stepContainer },
    // Speed slider
    React.createElement("div", { className: styles.sliderRow },
      React.createElement("span", { className: styles.sliderLabel }, "Speed"),
      React.createElement("input", {
        className: styles.sliderInput,
        type: "range",
        min: 1,
        max: 10,
        step: 1,
        value: state.speed,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
          onChange({ speed: Number(e.target.value) });
        },
        "aria-label": "Ticker speed",
      }),
      React.createElement("span", { className: styles.sliderValue }, String(state.speed))
    ),

    // Default severity
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Default Severity"),
      React.createElement("select", {
        className: styles.selectInput,
        value: state.defaultSeverity,
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
          onChange({ defaultSeverity: e.target.value as TickerSeverity });
        },
        "aria-label": "Default severity",
      },
        React.createElement("option", { value: "normal" }, "Normal"),
        React.createElement("option", { value: "warning" }, "Warning"),
        React.createElement("option", { value: "critical" }, "Critical")
      )
    ),

    // Pause on hover
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("div", { className: styles.toggleLabel }, "Pause on Hover"),
        React.createElement("div", { className: styles.toggleDesc }, "Pause ticker animation when mouse hovers over it")
      ),
      React.createElement("label", { className: styles.toggleSwitch, htmlFor: "appearance-pause" },
        React.createElement("input", {
          id: "appearance-pause",
          className: styles.toggleInput,
          type: "checkbox",
          checked: state.pauseOnHover,
          onChange: function () { onChange({ pauseOnHover: !state.pauseOnHover }); },
          "aria-label": "Pause on hover",
        }),
        React.createElement("div", { className: styles.toggleTrack },
          React.createElement("div", { className: styles.toggleThumb })
        )
      )
    ),

    // Gradient fade
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("div", { className: styles.toggleLabel }, "Gradient Edge Fade"),
        React.createElement("div", { className: styles.toggleDesc }, "Add a transparent gradient at the edges for a smoother look")
      ),
      React.createElement("label", { className: styles.toggleSwitch, htmlFor: "appearance-gradient" },
        React.createElement("input", {
          id: "appearance-gradient",
          className: styles.toggleInput,
          type: "checkbox",
          checked: state.enableGradientFade,
          onChange: function () { onChange({ enableGradientFade: !state.enableGradientFade }); },
          "aria-label": "Gradient edge fade",
        }),
        React.createElement("div", { className: styles.toggleTrack },
          React.createElement("div", { className: styles.toggleThumb })
        )
      )
    ),

    // Background gradient
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.fieldRow },
        React.createElement("label", { className: styles.fieldLabel }, "Background (CSS gradient or color)"),
        React.createElement("input", {
          className: styles.textInput,
          type: "text",
          value: state.backgroundGradient,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
            onChange({ backgroundGradient: e.target.value });
          },
          placeholder: "e.g., #0f1b2d or linear-gradient(90deg, #0f1b2d, #1a1a2e)",
        })
      )
    )
  );
};

export default AppearanceStep;
