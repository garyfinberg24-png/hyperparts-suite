import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ILinksWizardState } from "../../models/IHyperLinksWizardState";
import type {
  HyperLinksLayoutMode,
  HyperLinksHoverEffect,
  HyperLinksBorderRadius,
  HyperLinksBackgroundMode,
} from "../../models";
import styles from "./WizardSteps.module.scss";

// Layout options with icons and descriptions
var LAYOUT_OPTIONS: Array<{
  key: HyperLinksLayoutMode;
  icon: string;
  name: string;
  desc: string;
}> = [
  { key: "grid", icon: "\u25A6", name: "Grid", desc: "Cards in columns" },
  { key: "compact", icon: "\u2630", name: "Compact", desc: "Minimal inline" },
  { key: "list", icon: "\u2261", name: "List", desc: "Vertical rows" },
  { key: "button", icon: "\u25CF", name: "Button", desc: "Pill buttons" },
  { key: "filmstrip", icon: "\u25B6", name: "Filmstrip", desc: "Horizontal scroll" },
  { key: "tiles", icon: "\u25A3", name: "Tiles", desc: "Image backgrounds" },
  { key: "card", icon: "\u2750", name: "Card", desc: "Rich metadata" },
  { key: "iconGrid", icon: "\u2B50", name: "Icon Grid", desc: "App launcher" },
];

var HOVER_OPTIONS: Array<{ key: HyperLinksHoverEffect; icon: string; label: string }> = [
  { key: "none", icon: "\u2014", label: "None" },
  { key: "lift", icon: "\u2B06", label: "Lift" },
  { key: "glow", icon: "\u2728", label: "Glow" },
  { key: "zoom", icon: "\uD83D\uDD0D", label: "Zoom" },
  { key: "darken", icon: "\uD83C\uDF11", label: "Darken" },
  { key: "pulse", icon: "\uD83D\uDCAB", label: "Pulse" },
  { key: "bounce", icon: "\u26A1", label: "Bounce" },
  { key: "shake", icon: "\uD83C\uDF0A", label: "Shake" },
  { key: "rotate", icon: "\uD83D\uDD04", label: "Rotate" },
  { key: "shimmer", icon: "\u2B50", label: "Shimmer" },
];

var RADIUS_OPTIONS: Array<{ key: HyperLinksBorderRadius; label: string }> = [
  { key: "none", label: "Sharp" },
  { key: "small", label: "Slight" },
  { key: "medium", label: "Medium" },
  { key: "large", label: "Rounded" },
  { key: "round", label: "Pill" },
];

var BG_MODE_OPTIONS: Array<{ key: HyperLinksBackgroundMode; icon: string; label: string }> = [
  { key: "none", icon: "\u2014", label: "None" },
  { key: "color", icon: "\uD83C\uDFA8", label: "Color" },
  { key: "gradient", icon: "\uD83C\uDF08", label: "Gradient" },
  { key: "image", icon: "\uD83D\uDDBC", label: "Image" },
];

var GRADIENT_PRESETS: Array<{ label: string; value: string }> = [
  { label: "Ocean", value: "linear-gradient(135deg, #667eea, #764ba2)" },
  { label: "Sunset", value: "linear-gradient(135deg, #f093fb, #f5576c)" },
  { label: "Forest", value: "linear-gradient(135deg, #11998e, #38ef7d)" },
  { label: "Midnight", value: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" },
  { label: "Pastel", value: "linear-gradient(135deg, #a8edea, #fed6e3)" },
  { label: "Warm", value: "linear-gradient(135deg, #f5e6ca, #e8d5b7)" },
];

var LayoutStyleStep: React.FC<IWizardStepProps<ILinksWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  function updateLayoutStyle(partial: Record<string, unknown>): void {
    onChange({
      layoutStyle: Object.assign({}, state.layoutStyle, partial),
    });
  }

  var handleLayoutChange = React.useCallback(function (mode: HyperLinksLayoutMode): void {
    updateLayoutStyle({ layoutMode: mode });
  }, [state.layoutStyle, onChange]);

  var handleHoverChange = React.useCallback(function (effect: HyperLinksHoverEffect): void {
    updateLayoutStyle({ hoverEffect: effect });
  }, [state.layoutStyle, onChange]);

  var handleRadiusChange = React.useCallback(function (radius: HyperLinksBorderRadius): void {
    updateLayoutStyle({ borderRadius: radius });
  }, [state.layoutStyle, onChange]);

  var handleColumnsChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    updateLayoutStyle({ gridColumns: parseInt(e.target.value, 10) || 4 });
  }, [state.layoutStyle, onChange]);

  var handleBgModeChange = React.useCallback(function (mode: HyperLinksBackgroundMode): void {
    updateLayoutStyle({ backgroundMode: mode, activePresetId: "" });
  }, [state.layoutStyle, onChange]);

  var handleBgColorChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    updateLayoutStyle({ backgroundColor: e.target.value, activePresetId: "" });
  }, [state.layoutStyle, onChange]);

  var handleBgGradientChange = React.useCallback(function (val: string): void {
    updateLayoutStyle({ backgroundGradient: val, activePresetId: "" });
  }, [state.layoutStyle, onChange]);

  var handleBgGradientInput = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    updateLayoutStyle({ backgroundGradient: e.target.value, activePresetId: "" });
  }, [state.layoutStyle, onChange]);

  var handleBgImageChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    updateLayoutStyle({ backgroundImageUrl: e.target.value, activePresetId: "" });
  }, [state.layoutStyle, onChange]);

  var handleBgDarkenToggle = React.useCallback(function (): void {
    updateLayoutStyle({ backgroundImageDarken: !state.layoutStyle.backgroundImageDarken });
  }, [state.layoutStyle, onChange]);

  var handleTextColorChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    updateLayoutStyle({ textColor: e.target.value, activePresetId: "" });
  }, [state.layoutStyle, onChange]);

  var handleIconColorChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    updateLayoutStyle({ iconColor: e.target.value, activePresetId: "" });
  }, [state.layoutStyle, onChange]);

  // Layout cards
  var layoutCards: React.ReactElement[] = [];
  LAYOUT_OPTIONS.forEach(function (opt) {
    var isSelected = state.layoutStyle.layoutMode === opt.key;
    layoutCards.push(
      React.createElement("div", {
        key: opt.key,
        className: isSelected ? styles.layoutCardSelected : styles.layoutCard,
        onClick: function () { handleLayoutChange(opt.key); },
        role: "radio",
        "aria-checked": String(isSelected),
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent): void {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleLayoutChange(opt.key);
          }
        },
      },
        React.createElement("span", { className: styles.layoutCardIcon }, opt.icon),
        React.createElement("span", { className: styles.layoutCardName }, opt.name),
        React.createElement("span", { className: styles.layoutCardDesc }, opt.desc)
      )
    );
  });

  // Hover effect chips
  var hoverChips: React.ReactElement[] = [];
  HOVER_OPTIONS.forEach(function (opt) {
    var isSelected = state.layoutStyle.hoverEffect === opt.key;
    hoverChips.push(
      React.createElement("div", {
        key: opt.key,
        className: isSelected ? styles.optionChipSelected : styles.optionChip,
        onClick: function () { handleHoverChange(opt.key); },
        role: "radio",
        "aria-checked": String(isSelected),
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent): void {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleHoverChange(opt.key);
          }
        },
      },
        React.createElement("span", { className: styles.optionChipIcon }, opt.icon),
        opt.label
      )
    );
  });

  // Border radius chips
  var radiusChips: React.ReactElement[] = [];
  RADIUS_OPTIONS.forEach(function (opt) {
    var isSelected = state.layoutStyle.borderRadius === opt.key;
    radiusChips.push(
      React.createElement("div", {
        key: opt.key,
        className: isSelected ? styles.optionChipSelected : styles.optionChip,
        onClick: function () { handleRadiusChange(opt.key); },
        role: "radio",
        "aria-checked": String(isSelected),
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent): void {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRadiusChange(opt.key);
          }
        },
      }, opt.label)
    );
  });

  // Background mode chips
  var bgModeChips: React.ReactElement[] = [];
  BG_MODE_OPTIONS.forEach(function (opt) {
    var isSelected = state.layoutStyle.backgroundMode === opt.key;
    bgModeChips.push(
      React.createElement("div", {
        key: opt.key,
        className: isSelected ? styles.optionChipSelected : styles.optionChip,
        onClick: function () { handleBgModeChange(opt.key); },
        role: "radio",
        "aria-checked": String(isSelected),
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent): void {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleBgModeChange(opt.key);
          }
        },
      },
        React.createElement("span", { className: styles.optionChipIcon }, opt.icon),
        opt.label
      )
    );
  });

  // Gradient preset chips
  var gradientChips: React.ReactElement[] = [];
  GRADIENT_PRESETS.forEach(function (gp) {
    var isSelected = state.layoutStyle.backgroundGradient === gp.value;
    gradientChips.push(
      React.createElement("div", {
        key: gp.label,
        className: isSelected ? styles.optionChipSelected : styles.optionChip,
        onClick: function () { handleBgGradientChange(gp.value); },
        style: { position: "relative" as "relative" },
        role: "radio",
        "aria-checked": String(isSelected),
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent): void {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleBgGradientChange(gp.value);
          }
        },
      },
        React.createElement("span", {
          style: {
            display: "inline-block",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: gp.value,
            border: "1px solid rgba(0,0,0,0.1)",
            flexShrink: 0,
          },
        }),
        gp.label
      )
    );
  });

  // Show columns slider for grid-based layouts
  var showColumnsSlider = ["grid", "tiles", "card", "iconGrid"].indexOf(state.layoutStyle.layoutMode) !== -1;
  var bgMode = state.layoutStyle.backgroundMode;

  return React.createElement("div", { className: styles.stepContainer },
    // Layout section
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Choose Layout"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Select how your links are displayed. Each layout serves a different purpose."
      )
    ),
    React.createElement("div", {
      className: styles.layoutGrid,
      role: "radiogroup",
      "aria-label": "Layout mode",
    }, layoutCards),

    // Columns slider (conditional)
    showColumnsSlider
      ? React.createElement("div", { className: styles.sliderRow },
          React.createElement("span", { className: styles.sliderLabel }, "Columns"),
          React.createElement("input", {
            type: "range",
            className: styles.sliderInput,
            min: 2,
            max: 6,
            step: 1,
            value: state.layoutStyle.gridColumns,
            onChange: handleColumnsChange,
            "aria-label": "Number of grid columns",
          }),
          React.createElement("span", { className: styles.sliderValue },
            String(state.layoutStyle.gridColumns)
          )
        )
      : undefined,

    // Hover effect section
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Hover Effect"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Visual feedback when users hover over links. Choose from classic effects or shape animations."
      )
    ),
    React.createElement("div", {
      className: styles.optionGrid,
      role: "radiogroup",
      "aria-label": "Hover effect",
    }, hoverChips),

    // Border radius section
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Corner Style"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Control the roundness of link card corners."
      )
    ),
    React.createElement("div", {
      className: styles.optionGrid,
      role: "radiogroup",
      "aria-label": "Border radius",
    }, radiusChips),

    // Background section
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Background"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Set a background color, gradient, or image for the links container."
      )
    ),
    React.createElement("div", {
      className: styles.optionGrid,
      role: "radiogroup",
      "aria-label": "Background mode",
    }, bgModeChips),

    // Background color input
    bgMode === "color"
      ? React.createElement("div", { className: styles.textInputRow },
          React.createElement("span", { className: styles.textInputLabel }, "Background Color"),
          React.createElement("div", { className: styles.inputWithPreview },
            React.createElement("input", {
              type: "text",
              className: styles.textInput,
              value: state.layoutStyle.backgroundColor,
              onChange: handleBgColorChange,
              placeholder: "#0078d4 or rgb(0,120,212)",
              "aria-label": "Background color",
            }),
            state.layoutStyle.backgroundColor
              ? React.createElement("span", {
                  className: styles.colorPreview,
                  style: { backgroundColor: state.layoutStyle.backgroundColor },
                })
              : undefined
          )
        )
      : undefined,

    // Gradient controls
    bgMode === "gradient"
      ? React.createElement("div", { className: styles.stepSection },
          React.createElement("div", { className: styles.stepSectionLabel }, "Gradient Presets"),
          React.createElement("div", { className: styles.optionGrid }, gradientChips),
          React.createElement("div", { className: styles.textInputRow, style: { marginTop: 8 } },
            React.createElement("span", { className: styles.textInputLabel }, "Custom Gradient CSS"),
            React.createElement("input", {
              type: "text",
              className: styles.textInput,
              value: state.layoutStyle.backgroundGradient,
              onChange: handleBgGradientInput,
              placeholder: "linear-gradient(135deg, #667eea, #764ba2)",
              "aria-label": "Custom gradient CSS",
            })
          )
        )
      : undefined,

    // Image URL input
    bgMode === "image"
      ? React.createElement("div", { className: styles.stepSection },
          React.createElement("div", { className: styles.textInputRow },
            React.createElement("span", { className: styles.textInputLabel }, "Image URL"),
            React.createElement("input", {
              type: "text",
              className: styles.textInput,
              value: state.layoutStyle.backgroundImageUrl,
              onChange: handleBgImageChange,
              placeholder: "https://example.com/background.jpg",
              "aria-label": "Background image URL",
            })
          ),
          React.createElement("label", { className: styles.toggleRow },
            React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, "\uD83C\uDF11"),
            React.createElement("span", { className: styles.toggleInfo },
              React.createElement("span", { className: styles.toggleLabel }, "Darken Overlay"),
              React.createElement("span", { className: styles.toggleDesc }, "Add dark overlay for better text readability")
            ),
            React.createElement("span", { className: styles.toggleSwitch },
              React.createElement("input", {
                type: "checkbox",
                className: styles.toggleInput,
                checked: state.layoutStyle.backgroundImageDarken,
                onChange: handleBgDarkenToggle,
                "aria-label": "Enable dark overlay",
              }),
              React.createElement("span", { className: styles.toggleTrack },
                React.createElement("span", { className: styles.toggleThumb })
              )
            )
          )
        )
      : undefined,

    // Text & icon color overrides (visible when background is set)
    bgMode !== "none"
      ? React.createElement("div", { className: styles.stepSection },
          React.createElement("div", { className: styles.stepSectionLabel }, "Text & Icon Colors"),
          React.createElement("div", { className: styles.stepSectionHint },
            "Override text and icon colors to ensure readability on your background."
          ),
          React.createElement("div", { className: styles.textInputRow },
            React.createElement("span", { className: styles.textInputLabel }, "Text Color"),
            React.createElement("div", { className: styles.inputWithPreview },
              React.createElement("input", {
                type: "text",
                className: styles.textInput,
                value: state.layoutStyle.textColor,
                onChange: handleTextColorChange,
                placeholder: "#ffffff or #323130",
                "aria-label": "Text color",
              }),
              state.layoutStyle.textColor
                ? React.createElement("span", {
                    className: styles.colorPreview,
                    style: { backgroundColor: state.layoutStyle.textColor },
                  })
                : undefined
            )
          ),
          React.createElement("div", { className: styles.textInputRow },
            React.createElement("span", { className: styles.textInputLabel }, "Icon Color"),
            React.createElement("div", { className: styles.inputWithPreview },
              React.createElement("input", {
                type: "text",
                className: styles.textInput,
                value: state.layoutStyle.iconColor,
                onChange: handleIconColorChange,
                placeholder: "#ffffff or #0078d4",
                "aria-label": "Icon color",
              }),
              state.layoutStyle.iconColor
                ? React.createElement("span", {
                    className: styles.colorPreview,
                    style: { backgroundColor: state.layoutStyle.iconColor },
                  })
                : undefined
            )
          )
        )
      : undefined
  );
};

export default LayoutStyleStep;
