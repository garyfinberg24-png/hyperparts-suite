import * as React from "react";
import { DEMO_TICKER_PRESETS } from "../utils/sampleData";
import type { DemoTickerPresetId } from "../utils/sampleData";
import styles from "./wizard/WizardSteps.module.scss";

export interface IHyperTickerDemoBarProps {
  presetId: DemoTickerPresetId;
  itemCount: number;
  onPresetChange: (presetId: DemoTickerPresetId) => void;
  onExitDemo: () => void;
}

const HyperTickerDemoBar: React.FC<IHyperTickerDemoBarProps> = function (props) {
  const presetOptions: React.ReactElement[] = [];

  DEMO_TICKER_PRESETS.forEach(function (preset) {
    presetOptions.push(
      React.createElement("option", {
        key: preset.id,
        value: preset.id,
      }, preset.icon + " " + preset.label)
    );
  });

  return React.createElement("div", {
    className: styles.demoBar,
    role: "status",
    "aria-label": "Demo mode active",
  },
    React.createElement("span", { className: styles.demoBarLabel }, "DEMO MODE"),
    React.createElement("select", {
      className: styles.demoBarSelect,
      value: props.presetId,
      onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
        props.onPresetChange(e.target.value as DemoTickerPresetId);
      },
      "aria-label": "Demo preset",
    }, presetOptions),
    React.createElement("span", { className: styles.demoBarBadge }, String(props.itemCount) + " items"),
    React.createElement("button", {
      className: styles.demoBarExitBtn,
      onClick: props.onExitDemo,
      type: "button",
      "aria-label": "Exit demo mode",
    }, "Exit Demo")
  );
};

export default HyperTickerDemoBar;
