import * as React from "react";
import type { DemoPresetId, IDemoPreset } from "../utils/sampleData";
import { DEMO_PRESETS } from "../utils/sampleData";
import styles from "./HyperRollupDemoBar.module.scss";

export interface IHyperRollupDemoBarProps {
  isDemoMode: boolean;
  activePresetId: DemoPresetId;
  onToggleDemo: () => void;
  onSelectPreset: (presetId: DemoPresetId) => void;
  onConfigure?: () => void;
}

var HyperRollupDemoBarInner: React.FC<IHyperRollupDemoBarProps> = function (props) {
  if (!props.isDemoMode) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  return React.createElement(
    "div",
    {
      className: styles.demoBar,
      role: "status",
      "aria-label": "Demo mode active",
    },

    // Demo indicator
    React.createElement(
      "div",
      { className: styles.demoInfo },
      React.createElement("span", { className: styles.demoIcon, "aria-hidden": "true" }, "\uD83D\uDCA1"),
      React.createElement("span", { className: styles.demoLabel }, "Demo Mode"),
      React.createElement("span", { className: styles.demoHint }, "Showing sample data")
    ),

    // Preset selector
    React.createElement(
      "div",
      { className: styles.demoPresets },
      DEMO_PRESETS.map(function (preset: IDemoPreset) {
        var isActive = preset.id === props.activePresetId;
        return React.createElement(
          "button",
          {
            key: preset.id,
            className: styles.presetButton + (isActive ? " " + styles.presetActive : ""),
            onClick: function () { props.onSelectPreset(preset.id); },
            title: preset.description,
            "aria-pressed": isActive,
          },
          React.createElement("span", { className: styles.presetIcon, "aria-hidden": "true" }, preset.icon),
          " ",
          preset.label
        );
      })
    ),

    // Actions
    React.createElement(
      "div",
      { className: styles.demoActions },
      props.onConfigure
        ? React.createElement(
            "button",
            {
              className: styles.connectButton,
              onClick: props.onConfigure,
              title: "Open property pane to connect real data sources",
            },
            "Connect Real Data"
          )
        : undefined,
      React.createElement(
        "button",
        {
          className: styles.exitButton,
          onClick: props.onToggleDemo,
          title: "Exit demo mode",
        },
        "Exit Demo"
      )
    )
  );
};

export var HyperRollupDemoBar = React.memo(HyperRollupDemoBarInner);
