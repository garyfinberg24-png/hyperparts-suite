import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ILinksWizardState } from "../../models/IHyperLinksWizardState";
import type {
  HyperLinksLayoutMode,
  HyperLinksHoverEffect,
  HyperLinksBorderRadius,
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
];

var RADIUS_OPTIONS: Array<{ key: HyperLinksBorderRadius; label: string }> = [
  { key: "none", label: "Sharp" },
  { key: "small", label: "Slight" },
  { key: "medium", label: "Medium" },
  { key: "large", label: "Rounded" },
  { key: "round", label: "Pill" },
];

var LayoutStyleStep: React.FC<IWizardStepProps<ILinksWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleLayoutChange = React.useCallback(function (mode: HyperLinksLayoutMode): void {
    onChange({
      layoutStyle: Object.assign({}, state.layoutStyle, { layoutMode: mode }),
    });
  }, [state.layoutStyle, onChange]);

  var handleHoverChange = React.useCallback(function (effect: HyperLinksHoverEffect): void {
    onChange({
      layoutStyle: Object.assign({}, state.layoutStyle, { hoverEffect: effect }),
    });
  }, [state.layoutStyle, onChange]);

  var handleRadiusChange = React.useCallback(function (radius: HyperLinksBorderRadius): void {
    onChange({
      layoutStyle: Object.assign({}, state.layoutStyle, { borderRadius: radius }),
    });
  }, [state.layoutStyle, onChange]);

  var handleColumnsChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    onChange({
      layoutStyle: Object.assign({}, state.layoutStyle, {
        gridColumns: parseInt(e.target.value, 10) || 4,
      }),
    });
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

  // Show columns slider for grid-based layouts
  var showColumnsSlider = ["grid", "tiles", "card", "iconGrid"].indexOf(state.layoutStyle.layoutMode) !== -1;

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
        "Visual feedback when users hover over links."
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
    }, radiusChips)
  );
};

export default LayoutStyleStep;
