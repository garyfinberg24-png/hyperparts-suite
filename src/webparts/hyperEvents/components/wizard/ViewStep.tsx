import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IEventsWizardState } from "../../models/IHyperEventsWizardState";
import type { HyperEventsViewMode } from "../../models/IHyperEventsWebPartProps";
import styles from "./WizardSteps.module.scss";

// ============================================================
// Step 2: Default View & Display
// ============================================================

var VIEW_OPTIONS: Array<{ key: HyperEventsViewMode; icon: string; label: string; desc: string }> = [
  { key: "month", icon: "\uD83D\uDCC5", label: "Month", desc: "Traditional month grid calendar" },
  { key: "week", icon: "\uD83D\uDDD3\uFE0F", label: "Week", desc: "7-day view with time slots" },
  { key: "day", icon: "\uD83D\uDD52", label: "Day", desc: "Single day hourly breakdown" },
  { key: "agenda", icon: "\uD83D\uDCCB", label: "Agenda", desc: "Scrollable list by date" },
  { key: "timeline", icon: "\u2500\u2500", label: "Timeline", desc: "Horizontal event bars" },
  { key: "cardGrid", icon: "\uD83C\uDFB4", label: "Card Grid", desc: "Event cards in a grid" },
];

var ViewStep: React.FC<IWizardStepProps<IEventsWizardState>> = function (props) {
  var selected = props.state.defaultView;

  // View picker cards
  var cards = VIEW_OPTIONS.map(function (opt) {
    var isActive = selected === opt.key;
    var cardClass = isActive ? styles.layoutCardSelected : styles.layoutCard;

    return React.createElement("button", {
      key: opt.key,
      type: "button",
      className: cardClass,
      onClick: function () { props.onChange({ defaultView: opt.key }); },
      "aria-pressed": isActive ? "true" : "false",
      role: "option",
    },
      React.createElement("span", { className: styles.layoutCardIcon, "aria-hidden": "true" }, opt.icon),
      React.createElement("span", { className: styles.layoutCardName }, opt.label),
      React.createElement("span", { className: styles.layoutCardDesc }, opt.desc)
    );
  });

  // Find selected label
  var selectedLabel = "";
  var selectedIcon = "";
  VIEW_OPTIONS.forEach(function (opt) {
    if (opt.key === selected) {
      selectedLabel = opt.label + " \u2014 " + opt.desc;
      selectedIcon = opt.icon;
    }
  });

  return React.createElement("div", { className: styles.stepContainer },
    // Title input
    React.createElement("div", { className: styles.inputRow },
      React.createElement("label", { className: styles.inputLabel }, "Calendar Title"),
      React.createElement("input", {
        className: styles.textInput,
        type: "text",
        value: props.state.display.title,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
          var updated: Record<string, unknown> = {};
          var keys = Object.keys(props.state.display);
          keys.forEach(function (k) { updated[k] = (props.state.display as unknown as Record<string, unknown>)[k]; });
          updated.title = e.target.value;
          props.onChange({ display: updated as unknown as IEventsWizardState["display"] });
        },
        "aria-label": "Calendar title",
      })
    ),

    // Section label
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Default View"),
      React.createElement("div", { className: styles.stepSectionHint }, "Select how the calendar is displayed by default. Users can switch views at any time.")
    ),

    // View picker grid
    React.createElement("div", { className: styles.layoutGrid }, cards),

    // Selected info bar
    selectedLabel
      ? React.createElement("div", { className: styles.layoutSelectedInfo },
          React.createElement("span", undefined, selectedIcon),
          React.createElement("span", { className: styles.layoutSelectedLabel }, "Selected: " + selectedLabel)
        )
      : undefined
  );
};

export default ViewStep;
