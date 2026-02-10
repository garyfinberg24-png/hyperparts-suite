import * as React from "react";
import type { IFilterConfig } from "../../models/IHyperImageFilter";
import { FilterPreset, FILTER_PRESET_OPTIONS } from "../../models/IHyperImageFilter";
import styles from "./HyperImageEditorModal.module.scss";

export interface IFiltersPanelProps {
  currentPreset: FilterPreset;
  customConfig: IFilterConfig;
  onPresetChange: (preset: FilterPreset) => void;
  onCustomConfigChange: (config: IFilterConfig) => void;
}

/** Filter slider configs */
var SLIDERS: Array<{ key: keyof IFilterConfig; label: string; min: number; max: number; unit: string }> = [
  { key: "grayscale", label: "Grayscale", min: 0, max: 100, unit: "%" },
  { key: "sepia", label: "Sepia", min: 0, max: 100, unit: "%" },
  { key: "blur", label: "Blur", min: 0, max: 20, unit: "px" },
  { key: "brightness", label: "Brightness", min: 0, max: 200, unit: "%" },
  { key: "contrast", label: "Contrast", min: 0, max: 200, unit: "%" },
  { key: "saturate", label: "Saturate", min: 0, max: 200, unit: "%" },
  { key: "hueRotate", label: "Hue Rotate", min: 0, max: 360, unit: "deg" },
  { key: "invert", label: "Invert", min: 0, max: 100, unit: "%" },
  { key: "opacity", label: "Opacity", min: 0, max: 100, unit: "%" },
];

var FiltersPanel: React.FC<IFiltersPanelProps> = function (props) {
  var children: React.ReactNode[] = [];

  // Preset buttons
  children.push(React.createElement("h4", {
    key: "presetTitle",
    className: styles.propSectionTitle,
  }, "Filter Presets"));

  var presetBtns = FILTER_PRESET_OPTIONS.map(function (opt) {
    var isActive = props.currentPreset === opt.key;
    var btnClass = styles.filterPresetBtn + (isActive ? " " + styles.filterPresetBtnActive : "");
    return React.createElement("button", {
      key: opt.key,
      className: btnClass,
      onClick: function () { props.onPresetChange(opt.key as FilterPreset); },
      type: "button",
    }, opt.text);
  });

  children.push(React.createElement("div", {
    key: "presets",
    className: styles.filterGrid,
    style: { marginBottom: "20px" },
  }, presetBtns));

  // Custom sliders
  children.push(React.createElement("h4", {
    key: "customTitle",
    className: styles.propSectionTitle,
  }, "Custom Adjustments"));

  SLIDERS.forEach(function (slider) {
    var val = props.customConfig[slider.key];
    children.push(React.createElement("div", {
      key: slider.key,
      className: styles.propField,
    },
      React.createElement("label", { className: styles.propLabel },
        slider.label + ": " + val + slider.unit
      ),
      React.createElement("input", {
        type: "range",
        className: styles.propSlider,
        min: slider.min,
        max: slider.max,
        value: val,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
          var updated: Record<string, number> = {};
          var keys = Object.keys(props.customConfig);
          keys.forEach(function (k) {
            updated[k] = (props.customConfig as unknown as Record<string, number>)[k];
          });
          updated[slider.key] = parseInt(e.target.value, 10);
          props.onCustomConfigChange(updated as unknown as IFilterConfig);
          // Switch to "none" preset when custom adjusting
          props.onPresetChange(FilterPreset.None);
        },
      })
    ));
  });

  return React.createElement("div", undefined, children);
};

export default FiltersPanel;
