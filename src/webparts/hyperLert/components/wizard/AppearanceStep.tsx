import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ILertWizardState } from "./lertWizardConfig";
import type { LertLayout } from "../../models/IHyperLertV2Enums";
import styles from "./WizardSteps.module.scss";

// ============================================================
// AppearanceStep — Layout gallery + KPI toggle + refresh + history
// 8 layouts in a 4x2 grid, toggles, slider
// ============================================================

interface ILayoutOption {
  key: LertLayout;
  icon: string;
  name: string;
  description: string;
}

var LAYOUT_CHOICES: ILayoutOption[] = [
  { key: "commandCenter", icon: "\uD83D\uDDA5\uFE0F", name: "Command Center", description: "KPI cards + alert feed + side panel" },
  { key: "inbox", icon: "\uD83D\uDCE5", name: "Inbox", description: "Email-style with preview pane" },
  { key: "cardGrid", icon: "\uD83C\uDFB4", name: "Card Grid", description: "Card-based alert grid" },
  { key: "table", icon: "\uD83D\uDCCA", name: "Table", description: "Sortable data table" },
  { key: "timeline", icon: "\uD83D\uDD53", name: "Timeline", description: "Vertical alert timeline" },
  { key: "kanban", icon: "\uD83D\uDCCB", name: "Kanban", description: "Columns by status/severity" },
  { key: "compact", icon: "\uD83D\uDCDD", name: "Compact", description: "Single-line compact list" },
  { key: "split", icon: "\u2B1C", name: "Split", description: "List + detail split view" },
];

var AppearanceStep: React.FC<IWizardStepProps<ILertWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleLayoutSelect = React.useCallback(function (key: LertLayout): void {
    onChange({ layout: key });
  }, [onChange]);

  var handleKpiToggle = React.useCallback(function (): void {
    onChange({ enableKpiDashboard: !state.enableKpiDashboard });
  }, [onChange, state.enableKpiDashboard]);

  var handleAutoCreateToggle = React.useCallback(function (): void {
    onChange({ autoCreateList: !state.autoCreateList });
  }, [onChange, state.autoCreateList]);

  var handleRefreshChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    onChange({ refreshInterval: parseInt(e.target.value, 10) });
  }, [onChange]);

  var handleHistoryListChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    onChange({ historyListName: e.target.value });
  }, [onChange]);

  // Build layout cards
  var layoutCards: React.ReactElement[] = [];
  LAYOUT_CHOICES.forEach(function (layout) {
    var isSelected = layout.key === state.layout;
    var cardClass = isSelected
      ? styles.layoutCard + " " + styles.layoutCardActive
      : styles.layoutCard;

    layoutCards.push(
      React.createElement("button", {
        key: layout.key,
        className: cardClass,
        onClick: function (): void { handleLayoutSelect(layout.key); },
        type: "button",
        role: "option",
        "aria-selected": isSelected,
      },
        React.createElement("div", { className: styles.layoutIcon, "aria-hidden": "true" }, layout.icon),
        React.createElement("div", { className: styles.layoutName }, layout.name),
        React.createElement("div", { className: styles.layoutDesc }, layout.description)
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    // ── Layout section ──
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Choose a Dashboard Layout"),
      React.createElement("div", { className: styles.stepSectionHint }, "Select how your alert dashboard will be displayed.")
    ),
    React.createElement("div", {
      className: styles.layoutGrid,
      role: "listbox",
      "aria-label": "Layout options",
    }, layoutCards),

    // ── KPI Dashboard toggle ──
    React.createElement("div", { className: styles.section },
      React.createElement("div", { className: styles.sectionTitle }, "Dashboard Options"),
      React.createElement("label", { className: styles.toggleRow },
        React.createElement("div", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, "KPI Dashboard Header"),
          React.createElement("span", { className: styles.toggleDesc },
            "Show real-time metrics: active alerts, MTTA, MTTR, resolution rate"
          )
        ),
        React.createElement("div", { className: styles.toggleSwitch },
          React.createElement("input", {
            type: "checkbox",
            className: styles.toggleInput,
            checked: state.enableKpiDashboard,
            onChange: handleKpiToggle,
            "aria-label": "Enable KPI dashboard header",
          }),
          React.createElement("span", { className: styles.toggleTrack },
            React.createElement("span", { className: styles.toggleThumb })
          )
        )
      )
    ),

    // ── Refresh interval slider ──
    React.createElement("div", { className: styles.section },
      React.createElement("div", { className: styles.sectionTitle }, "Refresh & History"),
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("div", { className: styles.sliderLabel },
          React.createElement("span", undefined, "Refresh Interval"),
          React.createElement("span", { className: styles.sliderValue },
            String(state.refreshInterval) + "s"
          )
        ),
        React.createElement("input", {
          type: "range",
          className: styles.slider,
          min: "15",
          max: "300",
          step: "15",
          value: String(state.refreshInterval),
          onChange: handleRefreshChange,
          "aria-label": "Auto-refresh interval in seconds",
        }),
        React.createElement("span", { className: styles.sliderHint },
          "How often the dashboard checks for new alerts (15-300 seconds)"
        )
      ),

      // Auto-create history list toggle
      React.createElement("label", { className: styles.toggleRow },
        React.createElement("div", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, "Auto-Create History List"),
          React.createElement("span", { className: styles.toggleDesc },
            "Automatically create the alert history list if it does not exist"
          )
        ),
        React.createElement("div", { className: styles.toggleSwitch },
          React.createElement("input", {
            type: "checkbox",
            className: styles.toggleInput,
            checked: state.autoCreateList,
            onChange: handleAutoCreateToggle,
            "aria-label": "Auto-create history list",
          }),
          React.createElement("span", { className: styles.toggleTrack },
            React.createElement("span", { className: styles.toggleThumb })
          )
        )
      ),

      // History list name input
      React.createElement("div", { className: styles.sourceInputArea },
        React.createElement("label", { className: styles.sourceInputLabel },
          "History List Name"
        ),
        React.createElement("input", {
          type: "text",
          className: styles.textInput,
          value: state.historyListName,
          onChange: handleHistoryListChange,
          placeholder: "HyperLertHistory",
          "aria-label": "History list name",
        }),
        React.createElement("span", { className: styles.sourceInputHint },
          "Name of the SharePoint list where alert history is stored"
        )
      )
    ),

    // Final hint
    React.createElement("div", { className: styles.stepSectionHint },
      "You can fine-tune all layout and appearance settings in the property pane after the wizard completes."
    )
  );
};

export default AppearanceStep;
