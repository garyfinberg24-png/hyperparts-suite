import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ISearchWizardState } from "../../models/IHyperSearchWizardState";
import type { SearchBarStyle } from "../../models/IHyperSearchV2";
import styles from "./WizardSteps.module.scss";

/** Accent color presets */
var COLOR_PRESETS: string[] = [
  "#0078d4",
  "#106ebe",
  "#4285f4",
  "#6b21a8",
  "#7c3aed",
  "#d83b01",
  "#107c10",
  "#0097a7",
  "#6264a7",
  "#605e5c",
];

/** Search bar style options */
var BAR_STYLE_OPTIONS: Array<{ key: SearchBarStyle; label: string; preview: string }> = [
  { key: "rounded", label: "Rounded", preview: "\u25AD" },
  { key: "square", label: "Square", preview: "\u25A1" },
  { key: "pill", label: "Pill", preview: "\u2B2D" },
  { key: "underline", label: "Underline", preview: "\u2581\u2581\u2581" },
];

var AppearanceStep: React.FC<IWizardStepProps<ISearchWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleColorChange = function (color: string): void {
    onChange({ accentColor: color });
  };

  var handleBarStyleChange = function (style: SearchBarStyle): void {
    onChange({ searchBarStyle: style });
  };

  var handleBorderRadiusChange = function (e: React.ChangeEvent<HTMLInputElement>): void {
    onChange({ borderRadius: parseInt(e.target.value, 10) });
  };

  var handleDemoModeToggle = function (): void {
    onChange({ enableDemoMode: !state.enableDemoMode });
  };

  // Build color presets
  var colorSwatches: React.ReactElement[] = [];
  COLOR_PRESETS.forEach(function (color) {
    var isSelected = state.accentColor === color;
    colorSwatches.push(
      React.createElement("button", {
        key: color,
        className: isSelected ? styles.colorPresetSelected : styles.colorPreset,
        style: { backgroundColor: color },
        onClick: function () { handleColorChange(color); },
        type: "button",
        title: color,
        "aria-label": "Select color " + color,
      })
    );
  });

  // Build bar style cards
  var barStyleCards: React.ReactElement[] = [];
  BAR_STYLE_OPTIONS.forEach(function (opt) {
    var isSelected = state.searchBarStyle === opt.key;
    barStyleCards.push(
      React.createElement("button", {
        key: opt.key,
        className: isSelected ? styles.barStyleCardSelected : styles.barStyleCard,
        onClick: function () { handleBarStyleChange(opt.key); },
        type: "button",
        role: "option",
        "aria-selected": isSelected,
      },
        React.createElement("div", { className: styles.barStylePreview }, opt.preview),
        React.createElement("div", { className: styles.barStyleName }, opt.label)
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("p", { className: styles.stepDescription },
      "Customize the visual appearance of your search experience to match your intranet brand."
    ),

    // Accent Color
    React.createElement("h4", { className: styles.sectionTitle }, "Accent Color"),
    React.createElement("div", { className: styles.colorRow },
      React.createElement("input", {
        type: "color",
        className: styles.colorInput,
        value: state.accentColor,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleColorChange(e.target.value); },
        "aria-label": "Accent color picker",
      }),
      React.createElement("span", { className: styles.colorValue }, state.accentColor),
      React.createElement("div", { className: styles.colorPresets }, colorSwatches)
    ),

    // Search Bar Style
    React.createElement("h4", { className: styles.sectionTitle }, "Search Bar Style"),
    React.createElement("div", {
      className: styles.barStyleGrid,
      role: "listbox",
      "aria-label": "Search bar styles",
    }, barStyleCards),

    // Border Radius
    React.createElement("h4", { className: styles.sectionTitle }, "Border Radius"),
    React.createElement("div", { className: styles.sliderRow },
      React.createElement("span", { className: styles.sliderLabel }, "Corners"),
      React.createElement("input", {
        type: "range",
        className: styles.sliderInput,
        min: 0,
        max: 24,
        value: state.borderRadius,
        onChange: handleBorderRadiusChange,
        "aria-label": "Border radius",
      }),
      React.createElement("span", { className: styles.sliderValue }, String(state.borderRadius) + "px")
    ),

    // Demo Mode
    React.createElement("h4", { className: styles.sectionTitle }, "Demo Mode"),
    React.createElement("label", { className: styles.demoToggle },
      React.createElement("div", { className: styles.demoToggleInfo },
        React.createElement("div", { className: styles.demoToggleTitle }, "Enable Demo Mode"),
        React.createElement("div", { className: styles.demoToggleDesc },
          "Show sample data when no search is active. Great for previewing your configuration before connecting to live data."
        )
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          type: "checkbox",
          checked: state.enableDemoMode,
          onChange: handleDemoModeToggle,
        }),
        React.createElement("span", { className: styles.toggleTrack },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    )
  );
};

export default AppearanceStep;
