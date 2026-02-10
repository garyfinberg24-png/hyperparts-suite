import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperPollWizardState } from "../../models/IHyperPollWizardState";
import type { PollType, PollLayout, RecurrenceFrequency } from "../../models/IHyperPollWizardState";
import type { ResultsVisibility } from "../../models/IHyperPoll";
import styles from "./WizardSteps.module.scss";

// ============================================================
// Step 1: Poll Type & Settings
// ============================================================

var POLL_TYPES: Array<{ key: PollType; icon: string; name: string; desc: string }> = [
  { key: "poll", icon: "\uD83D\uDCCA", name: "Standard Poll", desc: "Vote on choices and see results" },
  { key: "quiz", icon: "\uD83E\uDDE0", name: "Quiz Mode", desc: "Correct answers, scoring, leaderboard" },
  { key: "pulse", icon: "\uD83D\uDC9A", name: "Quick Pulse", desc: "Single-question mood/sentiment check" },
  { key: "survey", icon: "\uD83D\uDCDD", name: "Survey", desc: "Multi-question form with progress" },
];

var POLL_LAYOUTS: Array<{ key: PollLayout; icon: string; name: string }> = [
  { key: "card", icon: "\uD83D\uDCCB", name: "Card" },
  { key: "carousel", icon: "\uD83C\uDFA0", name: "Carousel" },
  { key: "stacked", icon: "\uD83D\uDCDA", name: "Stacked" },
  { key: "compact", icon: "\uD83D\uDCCF", name: "Compact" },
  { key: "fullPage", icon: "\uD83D\uDCBB", name: "Full Page" },
  { key: "slideshow", icon: "\uD83C\uDFAC", name: "Slideshow" },
];

var VISIBILITY_OPTIONS: Array<{ key: ResultsVisibility; label: string }> = [
  { key: "afterVote", label: "After voting" },
  { key: "afterClose", label: "After poll closes" },
  { key: "adminOnly", label: "Admin only" },
];

var RECURRENCE_OPTIONS: Array<{ key: RecurrenceFrequency; label: string }> = [
  { key: "none", label: "One-time (no recurrence)" },
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "biweekly", label: "Bi-weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "quarterly", label: "Quarterly" },
];

var SettingsStep: React.FC<IWizardStepProps<IHyperPollWizardState>> = function (props) {
  var state = props.state;

  // ── Poll Type picker ──
  var pollTypeCards = POLL_TYPES.map(function (pt) {
    var isSelected = state.pollType === pt.key;
    return React.createElement("div", {
      key: pt.key,
      className: isSelected ? styles.pickerCardSelected : styles.pickerCard,
      onClick: function () {
        var updates: Partial<IHyperPollWizardState> = { pollType: pt.key };
        // Auto-enable leaderboard for quiz mode
        if (pt.key === "quiz") {
          updates.enableLeaderboard = true;
          updates.enableConfetti = true;
          updates.layout = "slideshow";
        }
        // Auto-set layout for pulse
        if (pt.key === "pulse") {
          updates.layout = "card";
        }
        props.onChange(updates);
      },
      role: "radio",
      "aria-checked": isSelected,
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          var updates2: Partial<IHyperPollWizardState> = { pollType: pt.key };
          if (pt.key === "quiz") {
            updates2.enableLeaderboard = true;
            updates2.enableConfetti = true;
            updates2.layout = "slideshow";
          }
          if (pt.key === "pulse") { updates2.layout = "card"; }
          props.onChange(updates2);
        }
      },
    },
      React.createElement("span", { className: styles.pickerCardIcon, "aria-hidden": "true" }, pt.icon),
      React.createElement("span", { className: styles.pickerCardName }, pt.name),
      React.createElement("span", { className: styles.pickerCardDesc }, pt.desc)
    );
  });

  // ── Layout picker ──
  var layoutCards = POLL_LAYOUTS.map(function (pl) {
    var isSelected = state.layout === pl.key;
    return React.createElement("div", {
      key: pl.key,
      className: isSelected ? styles.miniPickerCardSelected : styles.miniPickerCard,
      onClick: function () { props.onChange({ layout: pl.key }); },
      role: "radio",
      "aria-checked": isSelected,
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          props.onChange({ layout: pl.key });
        }
      },
    },
      React.createElement("span", { className: styles.miniPickerIcon, "aria-hidden": "true" }, pl.icon),
      React.createElement("span", { className: styles.miniPickerLabel }, pl.name)
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    // Poll Type
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Poll Type"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Choose the type of poll. This affects scoring, question behavior, and display options."
      )
    ),
    React.createElement("div", {
      className: styles.pickerGrid,
      role: "radiogroup",
      "aria-label": "Poll type",
    }, pollTypeCards),

    // Title & Description
    React.createElement("div", { className: styles.inputRow },
      React.createElement("label", { className: styles.inputLabel }, "Poll Title"),
      React.createElement("input", {
        className: styles.textInput,
        type: "text",
        value: state.title,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { props.onChange({ title: e.target.value }); },
        placeholder: "Enter a poll title",
      })
    ),
    React.createElement("div", { className: styles.inputRow },
      React.createElement("label", { className: styles.inputLabel }, "Description"),
      React.createElement("span", { className: styles.inputHint }, "Optional \u2014 shown above the questions"),
      React.createElement("textarea", {
        className: styles.textArea,
        value: state.description,
        onChange: function (e: React.ChangeEvent<HTMLTextAreaElement>) { props.onChange({ description: e.target.value }); },
        placeholder: "Describe the purpose of this poll...",
        rows: 2,
      })
    ),

    // Layout
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Display Layout"),
      React.createElement("div", { className: styles.stepSectionHint },
        "How the poll appears to users."
      )
    ),
    React.createElement("div", {
      className: styles.miniPickerGrid,
      role: "radiogroup",
      "aria-label": "Display layout",
    }, layoutCards),

    // Settings row
    React.createElement("div", { className: styles.twoColRow },
      // Results visibility
      React.createElement("div", { className: styles.sourceFieldRow },
        React.createElement("label", { className: styles.sourceFieldLabel }, "Results Visibility"),
        React.createElement("select", {
          className: styles.selectInput,
          value: state.resultsVisibility,
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>) { props.onChange({ resultsVisibility: e.target.value as ResultsVisibility }); },
        }, VISIBILITY_OPTIONS.map(function (vo) {
          return React.createElement("option", { key: vo.key, value: vo.key }, vo.label);
        }))
      ),
      // Recurrence
      React.createElement("div", { className: styles.sourceFieldRow },
        React.createElement("label", { className: styles.sourceFieldLabel }, "Recurrence"),
        React.createElement("select", {
          className: styles.selectInput,
          value: state.recurrence,
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>) { props.onChange({ recurrence: e.target.value as RecurrenceFrequency }); },
        }, RECURRENCE_OPTIONS.map(function (ro) {
          return React.createElement("option", { key: ro.key, value: ro.key }, ro.label);
        }))
      )
    ),

    // Toggle settings
    React.createElement("label", { className: styles.toggleRow },
      React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, "\uD83D\uDD75\uFE0F"),
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, "Anonymous Responses"),
        React.createElement("span", { className: styles.toggleDesc }, "Hide respondent identity from results")
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          className: styles.toggleInput,
          type: "checkbox",
          checked: state.isAnonymous,
          onChange: function () { props.onChange({ isAnonymous: !state.isAnonymous }); },
          "aria-label": "Anonymous responses",
        }),
        React.createElement("span", { className: styles.toggleTrack },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    ),

    React.createElement("label", { className: styles.toggleRow },
      React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, "\uD83D\uDD04"),
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, "Allow Changing Answers"),
        React.createElement("span", { className: styles.toggleDesc }, "Let respondents update their vote after submitting")
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          className: styles.toggleInput,
          type: "checkbox",
          checked: state.allowChangeAnswer,
          onChange: function () { props.onChange({ allowChangeAnswer: !state.allowChangeAnswer }); },
          "aria-label": "Allow changing answers",
        }),
        React.createElement("span", { className: styles.toggleTrack },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    ),

    React.createElement("label", { className: styles.toggleRow },
      React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, "\uD83D\uDC65"),
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, "Show Respondent Count"),
        React.createElement("span", { className: styles.toggleDesc }, "Display number of total respondents")
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          className: styles.toggleInput,
          type: "checkbox",
          checked: state.showRespondentCount,
          onChange: function () { props.onChange({ showRespondentCount: !state.showRespondentCount }); },
          "aria-label": "Show respondent count",
        }),
        React.createElement("span", { className: styles.toggleTrack },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    )
  );
};

export default SettingsStep;
