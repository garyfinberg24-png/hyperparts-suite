import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHeroWizardState } from "./heroWizardConfig";
import type { TransitionEffect } from "../../models";
import styles from "./GeneralSettingsStep.module.scss";

var TRANSITION_OPTIONS: Array<{ value: TransitionEffect; label: string }> = [
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "zoom", label: "Zoom" },
  { value: "kenBurns", label: "Ken Burns" },
  { value: "none", label: "None (instant)" },
];

var GeneralSettingsStep: React.FC<IWizardStepProps<IHeroWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var updateField = React.useCallback(function (field: string, value: unknown): void {
    var partial: Record<string, unknown> = {};
    partial[field] = value;
    onChange(partial as Partial<IHeroWizardState>);
  }, [onChange]);

  // Determine preview height (scaled down: actual / 4, min 40, max 120)
  var previewHeight = Math.max(40, Math.min(120, Math.round(state.heroHeight / 4)));

  return React.createElement("div", { className: styles.settingsContainer },

    // Step header
    React.createElement("div", { className: styles.stepHeader },
      React.createElement("div", { className: styles.stepHeaderIcon, "aria-hidden": "true" }, "\u2699\uFE0F"),
      React.createElement("div", { className: styles.stepHeaderContent },
        React.createElement("h3", { className: styles.stepHeaderTitle }, "General Settings"),
        React.createElement("p", { className: styles.stepHeaderDescription },
          "Fine-tune the hero appearance. All settings can be changed later in the property pane."
        )
      )
    ),

    // ── Title ──
    React.createElement("div", { className: styles.fieldGroup },
      React.createElement("label", { className: styles.fieldLabel }, "Hero Title"),
      React.createElement("span", { className: styles.fieldHint }, "Optional heading displayed above the hero banner"),
      React.createElement("input", {
        type: "text",
        className: styles.textInput,
        value: state.title,
        placeholder: "e.g. Welcome to Contoso",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateField("title", e.target.value);
        },
      })
    ),

    React.createElement("div", { className: styles.sectionDivider }),

    // ── Hero Height ──
    React.createElement("div", { className: styles.fieldGroup },
      React.createElement("label", { className: styles.fieldLabel }, "Hero Height"),
      React.createElement("span", { className: styles.fieldHint }, "Height of the banner area in pixels"),
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("input", {
          type: "range",
          className: styles.sliderInput,
          min: 200,
          max: 800,
          step: 25,
          value: state.heroHeight,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateField("heroHeight", parseInt(e.target.value, 10));
          },
        }),
        React.createElement("span", { className: styles.sliderValue }, state.heroHeight + "px")
      )
    ),

    // ── Aspect Ratio ──
    React.createElement("div", { className: styles.fieldGroup },
      React.createElement("label", { className: styles.fieldLabel }, "Aspect Ratio"),
      React.createElement("span", { className: styles.fieldHint }, "Constrains the hero to a specific aspect ratio"),
      React.createElement("div", { className: styles.aspectRatioGroup, role: "radiogroup", "aria-label": "Aspect ratio" },
        ["16:9", "4:3", "21:9", "custom"].map(function (ratio) {
          var isActive = state.aspectRatio === ratio;
          return React.createElement("button", {
            key: ratio,
            type: "button",
            className: styles.aspectRatioBtn + (isActive ? " " + styles.aspectRatioBtnActive : ""),
            onClick: function (): void {
              updateField("aspectRatio", ratio);
            },
            role: "radio",
            "aria-checked": String(isActive),
          }, ratio === "custom" ? "Custom" : ratio);
        })
      )
    ),

    // ── Border Radius ──
    React.createElement("div", { className: styles.fieldGroup },
      React.createElement("label", { className: styles.fieldLabel }, "Corner Rounding"),
      React.createElement("span", { className: styles.fieldHint }, "Rounded corners on the hero container"),
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("input", {
          type: "range",
          className: styles.sliderInput,
          min: 0,
          max: 32,
          step: 2,
          value: state.borderRadius,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateField("borderRadius", parseInt(e.target.value, 10));
          },
        }),
        React.createElement("span", { className: styles.sliderValue },
          state.borderRadius === 0 ? "None" : state.borderRadius + "px"
        )
      )
    ),

    // ── Live mini-preview ──
    React.createElement("div", { className: styles.previewCard },
      React.createElement("div", {
        className: styles.previewHero,
        style: {
          height: previewHeight + "px",
          borderRadius: state.borderRadius > 0 ? state.borderRadius + "px" : undefined,
        },
      },
        React.createElement("span", { className: styles.previewHeading },
          state.title || "Your Hero"
        )
      ),
      React.createElement("div", { className: styles.previewLabel },
        React.createElement("span", undefined, state.heroHeight + "px tall"),
        React.createElement("span", undefined, state.aspectRatio),
        React.createElement("span", undefined, state.borderRadius > 0 ? state.borderRadius + "px radius" : "Sharp corners"),
        state.fullBleed ? React.createElement("span", undefined, "Full bleed") : undefined
      )
    ),

    React.createElement("div", { className: styles.sectionDivider }),

    // ── Full Bleed ──
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, "Full Bleed"),
        React.createElement("span", { className: styles.toggleHint }, "Stretch the hero edge-to-edge, removing page padding")
      ),
      React.createElement("button", {
        className: state.fullBleed
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void {
          updateField("fullBleed", !state.fullBleed);
        },
        type: "button",
        role: "switch",
        "aria-checked": String(state.fullBleed),
        "aria-label": "Full bleed toggle",
      })
    ),

    // ── Auto-Rotation (only for manual mode, not list) ──
    state.mode !== "list"
      ? React.createElement(React.Fragment, undefined,
          React.createElement("div", { className: styles.toggleRow },
            React.createElement("div", { className: styles.toggleInfo },
              React.createElement("span", { className: styles.toggleLabel }, "Auto-Rotation"),
              React.createElement("span", { className: styles.toggleHint }, "Automatically cycle through slides with a transition effect")
            ),
            React.createElement("button", {
              className: state.rotationEnabled
                ? styles.toggleSwitch + " " + styles.toggleSwitchOn
                : styles.toggleSwitch,
              onClick: function (): void {
                updateField("rotationEnabled", !state.rotationEnabled);
              },
              type: "button",
              role: "switch",
              "aria-checked": String(state.rotationEnabled),
              "aria-label": "Auto-rotation toggle",
            })
          ),

          state.rotationEnabled
            ? React.createElement("div", { className: styles.subFields },
                // Interval
                React.createElement("div", { className: styles.fieldGroup },
                  React.createElement("label", { className: styles.fieldLabel }, "Rotation Interval"),
                  React.createElement("div", { className: styles.sliderRow },
                    React.createElement("input", {
                      type: "range",
                      className: styles.sliderInput,
                      min: 2000,
                      max: 15000,
                      step: 500,
                      value: state.rotationInterval,
                      onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                        updateField("rotationInterval", parseInt(e.target.value, 10));
                      },
                    }),
                    React.createElement("span", { className: styles.sliderValue },
                      (state.rotationInterval / 1000) + "s"
                    )
                  )
                ),

                // Transition effect
                React.createElement("div", { className: styles.fieldGroup },
                  React.createElement("label", { className: styles.fieldLabel }, "Transition Effect"),
                  React.createElement("select", {
                    className: styles.selectInput,
                    value: state.rotationEffect,
                    onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
                      updateField("rotationEffect", e.target.value);
                    },
                  },
                    TRANSITION_OPTIONS.map(function (opt) {
                      return React.createElement("option", { key: opt.value, value: opt.value }, opt.label);
                    })
                  )
                ),

                // Pause on hover
                React.createElement("div", { className: styles.toggleRow },
                  React.createElement("div", { className: styles.toggleInfo },
                    React.createElement("span", { className: styles.toggleLabel }, "Pause on Hover"),
                    React.createElement("span", { className: styles.toggleHint }, "Stop cycling when the user hovers over the hero")
                  ),
                  React.createElement("button", {
                    className: state.pauseOnHover
                      ? styles.toggleSwitch + " " + styles.toggleSwitchOn
                      : styles.toggleSwitch,
                    onClick: function (): void {
                      updateField("pauseOnHover", !state.pauseOnHover);
                    },
                    type: "button",
                    role: "switch",
                    "aria-checked": String(state.pauseOnHover),
                    "aria-label": "Pause on hover toggle",
                  })
                ),

                // Show dots
                React.createElement("div", { className: styles.toggleRow },
                  React.createElement("div", { className: styles.toggleInfo },
                    React.createElement("span", { className: styles.toggleLabel }, "Navigation Dots"),
                    React.createElement("span", { className: styles.toggleHint }, "Show dot indicators for each slide")
                  ),
                  React.createElement("button", {
                    className: state.showDots
                      ? styles.toggleSwitch + " " + styles.toggleSwitchOn
                      : styles.toggleSwitch,
                    onClick: function (): void {
                      updateField("showDots", !state.showDots);
                    },
                    type: "button",
                    role: "switch",
                    "aria-checked": String(state.showDots),
                    "aria-label": "Navigation dots toggle",
                  })
                ),

                // Show arrows
                React.createElement("div", { className: styles.toggleRow },
                  React.createElement("div", { className: styles.toggleInfo },
                    React.createElement("span", { className: styles.toggleLabel }, "Navigation Arrows"),
                    React.createElement("span", { className: styles.toggleHint }, "Show left/right arrow buttons")
                  ),
                  React.createElement("button", {
                    className: state.showArrows
                      ? styles.toggleSwitch + " " + styles.toggleSwitchOn
                      : styles.toggleSwitch,
                    onClick: function (): void {
                      updateField("showArrows", !state.showArrows);
                    },
                    type: "button",
                    role: "switch",
                    "aria-checked": String(state.showArrows),
                    "aria-label": "Navigation arrows toggle",
                  })
                )
              )
            : undefined
        )
      : undefined
  );
};

export default GeneralSettingsStep;
