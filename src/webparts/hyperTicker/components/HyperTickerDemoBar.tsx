import * as React from "react";
import { DEMO_TICKER_PRESETS } from "../utils/sampleData";
import type { DemoTickerPresetId, IDemoTickerPreset } from "../utils/sampleData";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

export interface IHyperTickerDemoBarProps {
  presetId: DemoTickerPresetId;
  itemCount: number;
  onPresetChange: (presetId: DemoTickerPresetId) => void;
  onExitDemo: () => void;
}

var HyperTickerDemoBar: React.FC<IHyperTickerDemoBarProps> = function (props) {
  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // -- Build collapsed summary --
  var summary = props.presetId as string;
  DEMO_TICKER_PRESETS.forEach(function (p) {
    if (p.id === props.presetId) {
      summary = p.icon + " " + p.label;
    }
  });

  // -- Preset chips --
  var presetChips: React.ReactNode[] = [];
  DEMO_TICKER_PRESETS.forEach(function (preset: IDemoTickerPreset) {
    var isActive = preset.id === props.presetId;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    presetChips.push(
      React.createElement("button", {
        key: preset.id,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onPresetChange(preset.id); },
        "aria-pressed": isActive ? "true" : "false",
        title: preset.description,
      }, preset.icon + " " + preset.label)
    );
  });

  // -- Expanded panel class --
  var panelClass = isExpanded
    ? styles.expandPanel + " " + styles.expandPanelOpen
    : styles.expandPanel;

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Ticker demo controls",
  },
    // ---- Header row (always visible) ----
    React.createElement("div", { className: styles.headerRow },
      React.createElement("span", { className: styles.demoBadge }, "DEMO"),
      React.createElement("span", { className: styles.wpName }, "HyperTicker Preview"),
      !isExpanded ? React.createElement("span", { className: styles.collapsedSummary }, summary) : undefined,
      React.createElement("span", { className: styles.itemCount },
        String(props.itemCount) + " items"
      ),
      React.createElement("span", { className: styles.spacer }),
      React.createElement("button", {
        className: styles.expandToggle,
        type: "button",
        onClick: function (): void { setExpanded(!isExpanded); },
        "aria-expanded": isExpanded ? "true" : "false",
      },
        isExpanded ? "Collapse" : "Customize",
        React.createElement("span", {
          className: styles.chevron + (isExpanded ? " " + styles.chevronExpanded : ""),
        }, "\u25BC")
      ),
      React.createElement("button", {
        className: styles.exitButton,
        type: "button",
        onClick: props.onExitDemo,
        "aria-label": "Exit demo mode",
      }, "\u2715 Exit Demo")
    ),

    // ---- Expandable panel ----
    React.createElement("div", { className: panelClass },
      // Preset row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Preset:"),
        React.createElement("div", { className: styles.chipGroup }, presetChips)
      )
    )
  );
};

export default HyperTickerDemoBar;
