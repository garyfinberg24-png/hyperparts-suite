import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ILertWizardState } from "./lertWizardConfig";
import type { AlertGroupMode } from "../../models/IHyperLertV2Enums";
import styles from "./WizardSteps.module.scss";

// ============================================================
// RulesStep — Alert grouping, deduplication, escalation
// Dropdown for grouping mode, toggle + slider for dedup,
// toggle for escalation
// ============================================================

/** Grouping mode option definition */
interface IGroupModeOption {
  value: AlertGroupMode;
  label: string;
}

var GROUP_MODE_OPTIONS: IGroupModeOption[] = [
  { value: "none", label: "No Grouping" },
  { value: "severity", label: "Group by Severity" },
  { value: "source", label: "Group by Source" },
  { value: "rule", label: "Group by Rule" },
  { value: "category", label: "Group by Category" },
];

var RulesStep: React.FC<IWizardStepProps<ILertWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  // Grouping mode handler
  var handleGroupModeChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void {
    onChange({ alertGroupMode: e.target.value as AlertGroupMode });
  }, [onChange]);

  // Deduplication toggle handler
  var handleDedupToggle = React.useCallback(function (): void {
    onChange({ enableDeduplication: !state.enableDeduplication });
  }, [onChange, state.enableDeduplication]);

  // Deduplication window slider handler
  var handleDedupWindowChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    onChange({ deduplicationWindowMinutes: parseInt(e.target.value, 10) });
  }, [onChange]);

  // Escalation toggle handler
  var handleEscalationToggle = React.useCallback(function (): void {
    onChange({ enableEscalation: !state.enableEscalation });
  }, [onChange, state.enableEscalation]);

  // Build grouping mode options
  var groupOptions: React.ReactElement[] = [];
  GROUP_MODE_OPTIONS.forEach(function (opt) {
    groupOptions.push(
      React.createElement("option", { key: opt.value, value: opt.value }, opt.label)
    );
  });

  // Build dedup window slider (only shown when dedup is enabled)
  var dedupSlider: React.ReactElement | undefined;
  if (state.enableDeduplication) {
    dedupSlider = React.createElement("div", {
      className: styles.indentArea,
      key: "dedupSlider",
    },
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("div", { className: styles.sliderLabel },
          React.createElement("span", undefined, "Deduplication Window"),
          React.createElement("span", { className: styles.sliderValue },
            String(state.deduplicationWindowMinutes) + " min"
          )
        ),
        React.createElement("input", {
          type: "range",
          className: styles.slider,
          min: "1",
          max: "30",
          step: "1",
          value: String(state.deduplicationWindowMinutes),
          onChange: handleDedupWindowChange,
          "aria-label": "Deduplication window in minutes",
        }),
        React.createElement("span", { className: styles.sliderHint },
          "Suppress duplicate alerts within this time window (1-30 minutes)"
        )
      )
    );
  }

  return React.createElement("div", { className: styles.stepContainer },
    // Header
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Configure Rules & Alert Behavior"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Control how alerts are grouped, deduplicated, and escalated. Fine-tune individual rules later in the rule builder."
      )
    ),

    // ── Alert Grouping ──
    React.createElement("div", { className: styles.section },
      React.createElement("div", { className: styles.sectionTitle }, "Alert Grouping"),
      React.createElement("div", { className: styles.selectRow },
        React.createElement("label", { className: styles.selectLabel }, "Grouping Mode"),
        React.createElement("select", {
          className: styles.select,
          value: state.alertGroupMode,
          onChange: handleGroupModeChange,
          "aria-label": "Alert grouping mode",
        }, groupOptions)
      ),
      React.createElement("div", { className: styles.stepSectionHint },
        "Alerts can be visually grouped in the dashboard to reduce noise and improve triage."
      )
    ),

    // ── Deduplication ──
    React.createElement("div", { className: styles.section },
      React.createElement("div", { className: styles.sectionTitle }, "Deduplication"),
      // Toggle
      React.createElement("label", { className: styles.toggleRow },
        React.createElement("div", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, "Enable Deduplication"),
          React.createElement("span", { className: styles.toggleDesc },
            "Suppress duplicate alerts for the same condition within a time window"
          )
        ),
        React.createElement("div", { className: styles.toggleSwitch },
          React.createElement("input", {
            type: "checkbox",
            className: styles.toggleInput,
            checked: state.enableDeduplication,
            onChange: handleDedupToggle,
            "aria-label": "Enable deduplication",
          }),
          React.createElement("span", { className: styles.toggleTrack },
            React.createElement("span", { className: styles.toggleThumb })
          )
        )
      ),
      // Slider (conditional)
      dedupSlider
    ),

    // ── Escalation ──
    React.createElement("div", { className: styles.section },
      React.createElement("div", { className: styles.sectionTitle }, "Escalation"),
      // Toggle
      React.createElement("label", { className: styles.toggleRow },
        React.createElement("div", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, "Enable 3-Tier Escalation"),
          React.createElement("span", { className: styles.toggleDesc },
            "Unacknowledged alerts escalate: Primary contact (immediate) \u2192 Secondary contact (15 min) \u2192 Manager (30 min)"
          )
        ),
        React.createElement("div", { className: styles.toggleSwitch },
          React.createElement("input", {
            type: "checkbox",
            className: styles.toggleInput,
            checked: state.enableEscalation,
            onChange: handleEscalationToggle,
            "aria-label": "Enable 3-tier escalation",
          }),
          React.createElement("span", { className: styles.toggleTrack },
            React.createElement("span", { className: styles.toggleThumb })
          )
        )
      ),
      state.enableEscalation
        ? React.createElement("div", { className: styles.stepSectionHint },
            "Configure escalation contacts per-rule in the rule builder after setup."
          )
        : undefined
    )
  );
};

export default RulesStep;
