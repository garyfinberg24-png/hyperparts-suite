import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ILinksWizardState, IWizardIconsDisplay } from "../../models/IHyperLinksWizardState";
import type { HyperLinksIconSize } from "../../models";
import styles from "./WizardSteps.module.scss";

var ICON_SIZE_OPTIONS: Array<{ key: HyperLinksIconSize; icon: string; label: string; desc: string }> = [
  { key: "small", icon: "\u2022", label: "Small", desc: "16px — subtle accent" },
  { key: "medium", icon: "\u25CF", label: "Medium", desc: "24px — balanced visibility" },
  { key: "large", icon: "\u2B24", label: "Large", desc: "32px — prominent display" },
];

var DISPLAY_TOGGLES: Array<{
  key: keyof IWizardIconsDisplay;
  icon: string;
  label: string;
  desc: string;
}> = [
  {
    key: "showIcons",
    icon: "\u2B50",
    label: "Show Icons",
    desc: "Display Fluent UI icons, emojis, or custom images next to each link",
  },
  {
    key: "showDescriptions",
    icon: "\uD83D\uDCDD",
    label: "Show Descriptions",
    desc: "Display a short description below the link title",
  },
  {
    key: "showThumbnails",
    icon: "\uD83D\uDDBC",
    label: "Show Thumbnails",
    desc: "Display thumbnail images on card and tiles layouts",
  },
  {
    key: "enableColorCustomization",
    icon: "\uD83C\uDFA8",
    label: "Color Customization",
    desc: "Allow per-link background colors for visual differentiation",
  },
];

var IconsDisplayStep: React.FC<IWizardStepProps<ILinksWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleToggle = React.useCallback(function (key: keyof IWizardIconsDisplay): void {
    var updated: Partial<IWizardIconsDisplay> = {};
    (updated as Record<string, boolean>)[key] = !state.iconsDisplay[key];
    onChange({
      iconsDisplay: Object.assign({}, state.iconsDisplay, updated),
    });
  }, [state.iconsDisplay, onChange]);

  var handleIconSizeChange = React.useCallback(function (size: HyperLinksIconSize): void {
    onChange({
      iconsDisplay: Object.assign({}, state.iconsDisplay, { iconSize: size }),
    });
  }, [state.iconsDisplay, onChange]);

  // Icon size chips
  var sizeChips: React.ReactElement[] = [];
  ICON_SIZE_OPTIONS.forEach(function (opt) {
    var isSelected = state.iconsDisplay.iconSize === opt.key;
    sizeChips.push(
      React.createElement("div", {
        key: opt.key,
        className: isSelected ? styles.optionChipSelected : styles.optionChip,
        onClick: function () { handleIconSizeChange(opt.key); },
        role: "radio",
        "aria-checked": String(isSelected),
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent): void {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleIconSizeChange(opt.key);
          }
        },
      },
        React.createElement("span", { className: styles.optionChipIcon }, opt.icon),
        opt.label
      )
    );
  });

  // Display toggles
  var toggleRows: React.ReactElement[] = [];
  DISPLAY_TOGGLES.forEach(function (opt) {
    var isEnabled = !!state.iconsDisplay[opt.key];
    var toggleId = "displayToggle-" + opt.key;

    toggleRows.push(
      React.createElement("div", {
        key: opt.key,
        className: styles.toggleRow,
        onClick: function () { handleToggle(opt.key); },
        role: "checkbox",
        "aria-checked": String(isEnabled),
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent): void {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle(opt.key);
          }
        },
      },
        React.createElement("span", { className: styles.toggleIcon }, opt.icon),
        React.createElement("div", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, opt.label),
          React.createElement("span", { className: styles.toggleDesc }, opt.desc)
        ),
        React.createElement("div", { className: styles.toggleSwitch },
          React.createElement("input", {
            type: "checkbox",
            id: toggleId,
            className: styles.toggleInput,
            checked: isEnabled,
            onChange: function () { handleToggle(opt.key); },
            tabIndex: -1,
            "aria-hidden": "true",
          }),
          React.createElement("label", {
            className: styles.toggleTrack,
            htmlFor: toggleId,
          },
            React.createElement("span", { className: styles.toggleThumb })
          )
        )
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    // Display options section
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Display Options"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Choose what information to show for each link."
      )
    ),
    React.createElement("div", {
      style: { display: "flex", flexDirection: "column", gap: "8px" },
    }, toggleRows),

    // Icon size section (shown only when icons are enabled)
    state.iconsDisplay.showIcons
      ? React.createElement("div", { className: styles.stepSection },
          React.createElement("div", { className: styles.stepSectionLabel }, "Icon Size"),
          React.createElement("div", { className: styles.stepSectionHint },
            "Controls the visual weight of icons across all link items."
          )
        )
      : undefined,
    state.iconsDisplay.showIcons
      ? React.createElement("div", {
          className: styles.optionGrid,
          role: "radiogroup",
          "aria-label": "Icon size",
        }, sizeChips)
      : undefined,

    // Hint box
    React.createElement("div", { className: styles.hintBox },
      "\uD83D\uDCA1 Tip: You can mix icon types per link \u2014 use Fluent UI icons for apps, emojis for fun links, and custom images for brand logos."
    )
  );
};

export default IconsDisplayStep;
