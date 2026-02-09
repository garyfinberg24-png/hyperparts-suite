import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ILinksWizardState } from "../../models/IHyperLinksWizardState";
import type { IHyperLinkPresetStyle } from "../../models/IHyperLink";
import { PRESET_STYLES } from "../../utils/presetStyles";
import styles from "./WizardSteps.module.scss";

// ============================================================
// PresetGalleryStep — Prestyled link gallery picker
// ============================================================

var PresetGalleryStep: React.FC<IWizardStepProps<ILinksWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleSelect = React.useCallback(function (preset: IHyperLinkPresetStyle): void {
    onChange({
      layoutStyle: Object.assign({}, state.layoutStyle, {
        activePresetId: preset.id,
        hoverEffect: preset.hoverEffect,
        borderRadius: preset.borderRadius,
        backgroundMode: preset.background.mode,
        backgroundColor: preset.background.color || "",
        backgroundGradient: preset.background.gradient || "",
        backgroundImageUrl: preset.background.imageUrl || "",
        backgroundImageDarken: !!preset.background.imageDarken,
        textColor: preset.textColor || "",
        iconColor: preset.iconColor || "",
      }),
    });
  }, [state.layoutStyle, onChange]);

  var handleClear = React.useCallback(function (): void {
    onChange({
      layoutStyle: Object.assign({}, state.layoutStyle, {
        activePresetId: "",
        backgroundMode: "none",
        backgroundColor: "",
        backgroundGradient: "",
        backgroundImageUrl: "",
        backgroundImageDarken: false,
        textColor: "",
        iconColor: "",
      }),
    });
  }, [state.layoutStyle, onChange]);

  var presetCards: React.ReactElement[] = [];

  // "Custom / No preset" card
  var isCustom = !state.layoutStyle.activePresetId;
  presetCards.push(
    React.createElement("div", {
      key: "custom",
      className: isCustom ? styles.presetCardSelected : styles.presetCard,
      onClick: handleClear,
      role: "radio",
      "aria-checked": String(isCustom),
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent): void {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClear();
        }
      },
    },
      React.createElement("div", {
        className: styles.presetPreview,
        style: {
          background: "#ffffff",
          border: "2px dashed #c8c6c4",
        },
      },
        React.createElement("span", { className: styles.presetPreviewText }, "Custom")
      ),
      React.createElement("span", { className: styles.presetName }, "Custom"),
      React.createElement("span", { className: styles.presetDesc }, "Configure manually")
    )
  );

  PRESET_STYLES.forEach(function (preset) {
    var isSelected = state.layoutStyle.activePresetId === preset.id;

    // Determine preview background
    var previewStyle: React.CSSProperties = {};
    if (preset.preview.indexOf("gradient") !== -1 || preset.preview.indexOf("rgba") !== -1) {
      previewStyle.background = preset.preview;
    } else {
      previewStyle.backgroundColor = preset.preview;
    }

    // Show text color preview
    var textPreviewColor = preset.textColor || "#323130";

    presetCards.push(
      React.createElement("div", {
        key: preset.id,
        className: isSelected ? styles.presetCardSelected : styles.presetCard,
        onClick: function () { handleSelect(preset); },
        role: "radio",
        "aria-checked": String(isSelected),
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent): void {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSelect(preset);
          }
        },
      },
        React.createElement("div", {
          className: styles.presetPreview,
          style: previewStyle,
        },
          React.createElement("span", {
            className: styles.presetPreviewText,
            style: { color: textPreviewColor },
          }, "Aa")
        ),
        React.createElement("span", { className: styles.presetName }, preset.name),
        React.createElement("span", { className: styles.presetDesc }, preset.description)
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Preset Styles Gallery"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Choose a preset theme to instantly style your links. Select \"Custom\" to configure background, colors, and effects manually."
      )
    ),
    React.createElement("div", {
      className: styles.presetGrid,
      role: "radiogroup",
      "aria-label": "Preset style",
    }, presetCards),

    // Show selected preset info
    state.layoutStyle.activePresetId
      ? React.createElement("div", { className: styles.hintBox },
          "Preset applied: hover effect, corner style, background, and colors have been updated. " +
          "You can further customize in the Layout & Style step."
        )
      : undefined
  );
};

export default PresetGalleryStep;
