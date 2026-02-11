import * as React from "react";
import type { DemoPresetId, IDemoPreset } from "../utils/sampleData";
import { DEMO_PRESETS } from "../utils/sampleData";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

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

  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // -- Build collapsed summary --
  var summary = props.activePresetId as string;
  DEMO_PRESETS.forEach(function (p) {
    if (p.id === props.activePresetId) {
      summary = p.label;
    }
  });

  // -- Preset chips --
  var presetChips: React.ReactNode[] = [];
  DEMO_PRESETS.forEach(function (preset: IDemoPreset) {
    var isActive = preset.id === props.activePresetId;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    presetChips.push(
      React.createElement("button", {
        key: preset.id,
        className: chipClass,
        type: "button",
        onClick: function (): void { props.onSelectPreset(preset.id); },
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
    "aria-label": "Rollup demo controls",
  },
    // ---- Header row (always visible) ----
    React.createElement("div", { className: styles.headerRow },
      React.createElement("span", { className: styles.demoBadge }, "DEMO"),
      React.createElement("span", { className: styles.wpName }, "HyperRollup Preview"),
      !isExpanded ? React.createElement("span", { className: styles.collapsedSummary }, summary) : undefined,
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
        onClick: props.onToggleDemo,
        "aria-label": "Exit demo mode",
      }, "\u2715 Exit Demo")
    ),

    // ---- Expandable panel ----
    React.createElement("div", { className: panelClass },
      // Preset row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Preset:"),
        React.createElement("div", { className: styles.chipGroup }, presetChips)
      ),

      // Connect real data action (if configure callback provided)
      props.onConfigure
        ? React.createElement("div", { className: styles.chipRow },
            React.createElement("span", { className: styles.chipRowLabel }, "Actions:"),
            React.createElement("div", { className: styles.chipGroup },
              React.createElement("button", {
                className: styles.chip,
                type: "button",
                onClick: props.onConfigure,
                title: "Open property pane to connect real data sources",
              }, "Connect Real Data")
            )
          )
        : undefined
    )
  );
};

export var HyperRollupDemoBar = React.memo(HyperRollupDemoBarInner);
