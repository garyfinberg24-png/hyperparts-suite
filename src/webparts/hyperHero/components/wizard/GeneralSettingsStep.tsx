import * as React from "react";
import type { TransitionEffect } from "../../models";
import styles from "./GeneralSettingsStep.module.scss";

export interface IGeneralSettings {
  title: string;
  heroHeight: number;
  borderRadius: number;
  fullBleed: boolean;
  rotationEnabled: boolean;
  rotationInterval: number;
  rotationEffect: TransitionEffect;
  pauseOnHover: boolean;
  showDots: boolean;
  showArrows: boolean;
}

export const DEFAULT_GENERAL_SETTINGS: IGeneralSettings = {
  title: "",
  heroHeight: 400,
  borderRadius: 0,
  fullBleed: false,
  rotationEnabled: false,
  rotationInterval: 5000,
  rotationEffect: "fade",
  pauseOnHover: true,
  showDots: true,
  showArrows: true,
};

export interface IGeneralSettingsStepProps {
  settings: IGeneralSettings;
  onSettingsChange: (settings: IGeneralSettings) => void;
  mode: "manual" | "list" | undefined;
}

const TRANSITION_OPTIONS: Array<{ value: TransitionEffect; label: string }> = [
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "zoom", label: "Zoom" },
  { value: "kenBurns", label: "Ken Burns" },
  { value: "none", label: "None (instant)" },
];

const GeneralSettingsStep: React.FC<IGeneralSettingsStepProps> = function (props) {
  const { settings, onSettingsChange, mode } = props;

  const updateField = React.useCallback(function (field: string, value: unknown): void {
    const updated = { ...settings };
    (updated as unknown as Record<string, unknown>)[field] = value;
    onSettingsChange(updated as IGeneralSettings);
  }, [settings, onSettingsChange]);

  // Determine preview height (scaled down: actual / 4, min 40, max 120)
  const previewHeight = Math.max(40, Math.min(120, Math.round(settings.heroHeight / 4)));

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
        value: settings.title,
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
          value: settings.heroHeight,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateField("heroHeight", parseInt(e.target.value, 10));
          },
        }),
        React.createElement("span", { className: styles.sliderValue }, settings.heroHeight + "px")
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
          value: settings.borderRadius,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateField("borderRadius", parseInt(e.target.value, 10));
          },
        }),
        React.createElement("span", { className: styles.sliderValue },
          settings.borderRadius === 0 ? "None" : settings.borderRadius + "px"
        )
      )
    ),

    // ── Live mini-preview ──
    React.createElement("div", { className: styles.previewCard },
      React.createElement("div", {
        className: styles.previewHero,
        style: {
          height: previewHeight + "px",
          borderRadius: settings.borderRadius > 0 ? settings.borderRadius + "px" : undefined,
        },
      },
        React.createElement("span", { className: styles.previewHeading },
          settings.title || "Your Hero"
        )
      ),
      React.createElement("div", { className: styles.previewLabel },
        React.createElement("span", undefined, settings.heroHeight + "px tall"),
        React.createElement("span", undefined, settings.borderRadius > 0 ? settings.borderRadius + "px radius" : "Sharp corners"),
        settings.fullBleed ? React.createElement("span", undefined, "Full bleed") : undefined
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
        className: settings.fullBleed
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void {
          updateField("fullBleed", !settings.fullBleed);
        },
        type: "button",
        role: "switch",
        "aria-checked": String(settings.fullBleed),
        "aria-label": "Full bleed toggle",
      })
    ),

    // ── Auto-Rotation ──
    mode !== "list"
      ? React.createElement(React.Fragment, undefined,
          React.createElement("div", { className: styles.toggleRow },
            React.createElement("div", { className: styles.toggleInfo },
              React.createElement("span", { className: styles.toggleLabel }, "Auto-Rotation"),
              React.createElement("span", { className: styles.toggleHint }, "Automatically cycle through slides with a transition effect")
            ),
            React.createElement("button", {
              className: settings.rotationEnabled
                ? styles.toggleSwitch + " " + styles.toggleSwitchOn
                : styles.toggleSwitch,
              onClick: function (): void {
                updateField("rotationEnabled", !settings.rotationEnabled);
              },
              type: "button",
              role: "switch",
              "aria-checked": String(settings.rotationEnabled),
              "aria-label": "Auto-rotation toggle",
            })
          ),

          settings.rotationEnabled
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
                      value: settings.rotationInterval,
                      onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                        updateField("rotationInterval", parseInt(e.target.value, 10));
                      },
                    }),
                    React.createElement("span", { className: styles.sliderValue },
                      (settings.rotationInterval / 1000) + "s"
                    )
                  )
                ),

                // Transition effect
                React.createElement("div", { className: styles.fieldGroup },
                  React.createElement("label", { className: styles.fieldLabel }, "Transition Effect"),
                  React.createElement("select", {
                    className: styles.selectInput,
                    value: settings.rotationEffect,
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
                    className: settings.pauseOnHover
                      ? styles.toggleSwitch + " " + styles.toggleSwitchOn
                      : styles.toggleSwitch,
                    onClick: function (): void {
                      updateField("pauseOnHover", !settings.pauseOnHover);
                    },
                    type: "button",
                    role: "switch",
                    "aria-checked": String(settings.pauseOnHover),
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
                    className: settings.showDots
                      ? styles.toggleSwitch + " " + styles.toggleSwitchOn
                      : styles.toggleSwitch,
                    onClick: function (): void {
                      updateField("showDots", !settings.showDots);
                    },
                    type: "button",
                    role: "switch",
                    "aria-checked": String(settings.showDots),
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
                    className: settings.showArrows
                      ? styles.toggleSwitch + " " + styles.toggleSwitchOn
                      : styles.toggleSwitch,
                    onClick: function (): void {
                      updateField("showArrows", !settings.showArrows);
                    },
                    type: "button",
                    role: "switch",
                    "aria-checked": String(settings.showArrows),
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
