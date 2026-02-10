import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ITickerWizardState } from "../../models/ITickerWizardState";
import type { TickerDisplayMode, TickerHeightPreset } from "../../models";
import { ALL_DISPLAY_MODES, getDisplayModeDisplayName, getDisplayModeIcon, ALL_HEIGHT_PRESETS, getHeightPresetDisplayName } from "../../models";
import styles from "./WizardSteps.module.scss";

const MODE_DESCRIPTIONS: Record<TickerDisplayMode, string> = {
  scroll: "Continuous horizontal marquee scroll",
  fade: "Cross-fade between items on a timer",
  static: "Show one item with prev/next buttons",
  stacked: "Display all items as horizontal cards",
  vertical: "Scroll items upward continuously",
  typewriter: "Character-by-character text reveal",
  split: "Category label + scrolling content",
  breaking: "Full-width emergency flash with ACK",
};

const DisplayModeStep: React.FC<IWizardStepProps<ITickerWizardState>> = function (props) {
  const onChange = props.onChange;
  const state = props.state;

  // Mode cards
  const modeCards: React.ReactElement[] = [];

  ALL_DISPLAY_MODES.forEach(function (mode: TickerDisplayMode) {
    const isSelected = state.displayMode === mode;
    const cardClass = isSelected ? styles.radioCardSelected : styles.radioCard;

    modeCards.push(
      React.createElement("button", {
        key: mode,
        className: cardClass,
        onClick: function () { onChange({ displayMode: mode }); },
        type: "button",
        role: "option",
        "aria-selected": isSelected,
        "aria-label": getDisplayModeDisplayName(mode),
      },
        React.createElement("div", { className: styles.radioCardIcon, "aria-hidden": "true" }, getDisplayModeIcon(mode)),
        React.createElement("div", { className: styles.radioCardName }, getDisplayModeDisplayName(mode)),
        React.createElement("div", { className: styles.radioCardDesc }, MODE_DESCRIPTIONS[mode])
      )
    );
  });

  // Height preset options
  const heightOptions: React.ReactElement[] = [];
  ALL_HEIGHT_PRESETS.forEach(function (preset: TickerHeightPreset) {
    heightOptions.push(
      React.createElement("option", { key: preset, value: preset },
        getHeightPresetDisplayName(preset)
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Choose a Display Mode"),
      React.createElement("div", {
        className: styles.radioCardGrid,
        role: "listbox",
        "aria-label": "Display modes",
      }, modeCards)
    ),
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Ticker Height"),
      React.createElement("select", {
        className: styles.selectInput,
        value: state.heightPreset,
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
          onChange({ heightPreset: e.target.value as TickerHeightPreset });
        },
        "aria-label": "Height preset",
      }, heightOptions)
    )
  );
};

export default DisplayModeStep;
