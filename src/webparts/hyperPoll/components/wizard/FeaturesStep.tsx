import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperPollWizardState, ResultsAnimation, PollTheme } from "../../models/IHyperPollWizardState";
import type { ChartType } from "../../models/IPollResults";
import styles from "./WizardSteps.module.scss";

// ============================================================
// Step 3: Features & Styling
// ============================================================

var CHART_TYPES: Array<{ key: ChartType; icon: string; label: string }> = [
  { key: "bar", icon: "\uD83D\uDCCA", label: "Bar" },
  { key: "pie", icon: "\uD83E\uDD67", label: "Pie" },
  { key: "donut", icon: "\uD83C\uDF69", label: "Donut" },
];

var ANIMATIONS: Array<{ key: ResultsAnimation; icon: string; label: string }> = [
  { key: "none", icon: "\u23F9\uFE0F", label: "None" },
  { key: "countUp", icon: "\uD83D\uDD22", label: "Count Up" },
  { key: "barGrow", icon: "\uD83D\uDCC8", label: "Bar Grow" },
  { key: "reveal", icon: "\uD83C\uDFAD", label: "Reveal" },
  { key: "confetti", icon: "\uD83C\uDF89", label: "Confetti" },
];

var THEMES: Array<{ key: PollTheme; icon: string; label: string }> = [
  { key: "default", icon: "\uD83D\uDCBB", label: "Default" },
  { key: "dark", icon: "\uD83C\uDF11", label: "Dark" },
  { key: "vibrant", icon: "\uD83C\uDF08", label: "Vibrant" },
  { key: "minimal", icon: "\u2B1C", label: "Minimal" },
  { key: "corporate", icon: "\uD83C\uDFE2", label: "Corporate" },
  { key: "fun", icon: "\uD83C\uDF88", label: "Fun" },
];

var FEATURE_TOGGLES: Array<{ key: string; icon: string; label: string; desc: string }> = [
  { key: "enableExport", icon: "\uD83D\uDCE5", label: "Export (CSV/JSON)", desc: "Download poll results as spreadsheet or JSON" },
  { key: "enableRealTimeResults", icon: "\u26A1", label: "Real-Time Results", desc: "Live-updating results as votes come in" },
  { key: "enableConfetti", icon: "\uD83C\uDF89", label: "Confetti on Vote", desc: "Celebratory confetti animation after voting" },
  { key: "enableLeaderboard", icon: "\uD83C\uDFC6", label: "Quiz Leaderboard", desc: "Scoreboard ranking for quiz mode" },
  { key: "confidentialMode", icon: "\uD83D\uDD12", label: "Confidential Mode", desc: "Hide individual responses from admin (aggregates only)" },
  { key: "enableAudienceTargeting", icon: "\uD83C\uDFAF", label: "Audience Targeting", desc: "Restrict poll visibility to specific groups" },
];

var REFRESH_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 0, label: "Off (manual)" },
  { value: 5, label: "Every 5 seconds" },
  { value: 10, label: "Every 10 seconds" },
  { value: 30, label: "Every 30 seconds" },
  { value: 60, label: "Every 1 minute" },
];

var FeaturesStep: React.FC<IWizardStepProps<IHyperPollWizardState>> = function (props) {
  var state = props.state;

  var handleToggle = React.useCallback(function (key: string) {
    var updated: Record<string, unknown> = {};
    updated[key] = !(state as unknown as Record<string, unknown>)[key];
    props.onChange(updated as Partial<IHyperPollWizardState>);
  }, [state, props]);

  // Count enabled features
  var enabledCount = 0;
  FEATURE_TOGGLES.forEach(function (ft) {
    if ((state as unknown as Record<string, boolean>)[ft.key]) {
      enabledCount++;
    }
  });

  // ── Chart type picker ──
  var chartTypeCards = CHART_TYPES.map(function (ct) {
    var isSelected = state.chartType === ct.key;
    return React.createElement("div", {
      key: ct.key,
      className: isSelected ? styles.miniPickerCardSelected : styles.miniPickerCard,
      onClick: function () { props.onChange({ chartType: ct.key }); },
      role: "radio",
      "aria-checked": isSelected,
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          props.onChange({ chartType: ct.key });
        }
      },
    },
      React.createElement("span", { className: styles.miniPickerIcon, "aria-hidden": "true" }, ct.icon),
      React.createElement("span", { className: styles.miniPickerLabel }, ct.label)
    );
  });

  // ── Animation picker ──
  var animationCards = ANIMATIONS.map(function (anim) {
    var isSelected = state.resultsAnimation === anim.key;
    return React.createElement("div", {
      key: anim.key,
      className: isSelected ? styles.miniPickerCardSelected : styles.miniPickerCard,
      onClick: function () { props.onChange({ resultsAnimation: anim.key }); },
      role: "radio",
      "aria-checked": isSelected,
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          props.onChange({ resultsAnimation: anim.key });
        }
      },
    },
      React.createElement("span", { className: styles.miniPickerIcon, "aria-hidden": "true" }, anim.icon),
      React.createElement("span", { className: styles.miniPickerLabel }, anim.label)
    );
  });

  // ── Theme picker ──
  var themeCards = THEMES.map(function (th) {
    var isSelected = state.theme === th.key;
    return React.createElement("div", {
      key: th.key,
      className: isSelected ? styles.miniPickerCardSelected : styles.miniPickerCard,
      onClick: function () { props.onChange({ theme: th.key }); },
      role: "radio",
      "aria-checked": isSelected,
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          props.onChange({ theme: th.key });
        }
      },
    },
      React.createElement("span", { className: styles.miniPickerIcon, "aria-hidden": "true" }, th.icon),
      React.createElement("span", { className: styles.miniPickerLabel }, th.label)
    );
  });

  // ── Feature toggles ──
  var toggleRows = FEATURE_TOGGLES.map(function (def) {
    var isOn = (state as unknown as Record<string, boolean>)[def.key] === true;

    // Hide leaderboard toggle if not quiz mode
    if (def.key === "enableLeaderboard" && state.pollType !== "quiz") {
      return undefined;
    }

    return React.createElement("label", {
      key: def.key,
      className: styles.toggleRow,
    },
      React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, def.icon),
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, def.label),
        React.createElement("span", { className: styles.toggleDesc }, def.desc)
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          className: styles.toggleInput,
          type: "checkbox",
          checked: isOn,
          onChange: function () { handleToggle(def.key); },
          "aria-label": def.label,
        }),
        React.createElement("span", { className: styles.toggleTrack },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    );
  });

  // Filter out undefined entries (hidden toggles)
  var visibleToggles: React.ReactNode[] = [];
  toggleRows.forEach(function (t) {
    if (t !== undefined) { visibleToggles.push(t); }
  });

  return React.createElement("div", { className: styles.stepContainer },
    // Chart type
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Results Chart Type"),
      React.createElement("div", { className: styles.stepSectionHint }, "Default visualization for poll results.")
    ),
    React.createElement("div", {
      className: styles.miniPickerGrid,
      role: "radiogroup",
      "aria-label": "Chart type",
    }, chartTypeCards),

    // Animation
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Results Animation"),
      React.createElement("div", { className: styles.stepSectionHint }, "How results are revealed after voting.")
    ),
    React.createElement("div", {
      className: styles.miniPickerGrid,
      role: "radiogroup",
      "aria-label": "Results animation",
    }, animationCards),

    // Theme
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Visual Theme"),
      React.createElement("div", { className: styles.stepSectionHint }, "Overall look and feel of the poll.")
    ),
    React.createElement("div", {
      className: styles.miniPickerGrid,
      role: "radiogroup",
      "aria-label": "Visual theme",
    }, themeCards),

    // Feature toggles
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Features"),
      React.createElement("div", { className: styles.stepSectionHint },
        String(enabledCount) + " of " + String(visibleToggles.length) + " features enabled."
      )
    ),
    visibleToggles,

    // Auto-refresh (only if real-time enabled)
    state.enableRealTimeResults
      ? React.createElement("div", { className: styles.refreshRow },
          React.createElement("span", { className: styles.refreshLabel }, "Auto-Refresh Interval"),
          React.createElement("select", {
            className: styles.refreshSelect,
            value: String(state.refreshInterval),
            onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
              props.onChange({ refreshInterval: parseInt(e.target.value, 10) });
            },
            "aria-label": "Auto-refresh interval",
          }, REFRESH_OPTIONS.map(function (opt) {
            return React.createElement("option", { key: opt.value, value: String(opt.value) }, opt.label);
          }))
        )
      : undefined,

    // SP List config
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "SharePoint Lists"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Configure list names for storing responses. Lists will be auto-provisioned if they don\u2019t exist."
      )
    ),

    React.createElement("label", { className: styles.toggleRow },
      React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, "\uD83D\uDCBE"),
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, "Auto-Provision Responses List"),
        React.createElement("span", { className: styles.toggleDesc }, state.listConfig.responsesListName)
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          className: styles.toggleInput,
          type: "checkbox",
          checked: state.listConfig.provisionResponsesList,
          onChange: function () {
            var cfg = JSON.parse(JSON.stringify(state.listConfig));
            cfg.provisionResponsesList = !cfg.provisionResponsesList;
            props.onChange({ listConfig: cfg });
          },
          "aria-label": "Auto-provision responses list",
        }),
        React.createElement("span", { className: styles.toggleTrack },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    ),

    state.pollType === "quiz"
      ? React.createElement("label", { className: styles.toggleRow },
          React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, "\uD83C\uDFC6"),
          React.createElement("div", { className: styles.toggleInfo },
            React.createElement("span", { className: styles.toggleLabel }, "Auto-Provision Leaderboard List"),
            React.createElement("span", { className: styles.toggleDesc }, state.listConfig.leaderboardListName)
          ),
          React.createElement("div", { className: styles.toggleSwitch },
            React.createElement("input", {
              className: styles.toggleInput,
              type: "checkbox",
              checked: state.listConfig.provisionLeaderboardList,
              onChange: function () {
                var cfg = JSON.parse(JSON.stringify(state.listConfig));
                cfg.provisionLeaderboardList = !cfg.provisionLeaderboardList;
                props.onChange({ listConfig: cfg });
              },
              "aria-label": "Auto-provision leaderboard list",
            }),
            React.createElement("span", { className: styles.toggleTrack },
              React.createElement("span", { className: styles.toggleThumb })
            )
          )
        )
      : undefined,

    // Sample data / demo mode
    React.createElement("div", { className: styles.stepSection, style: { marginTop: "4px" } },
      React.createElement("div", { className: styles.stepSectionLabel }, "Demo & Preview"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Sample data shows realistic vote distributions for preview. Demo mode adds a control bar when published."
      )
    ),

    React.createElement("label", { className: styles.toggleRow },
      React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, "\uD83D\uDCE6"),
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, "Use Sample Data"),
        React.createElement("span", { className: styles.toggleDesc }, "Pre-fill with realistic vote distributions for previewing")
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          className: styles.toggleInput,
          type: "checkbox",
          checked: state.useSampleData,
          onChange: function () { props.onChange({ useSampleData: !state.useSampleData }); },
          "aria-label": "Use sample data",
        }),
        React.createElement("span", { className: styles.toggleTrack },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    ),

    React.createElement("label", { className: styles.toggleRow },
      React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, "\uD83C\uDFAE"),
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, "Demo Mode"),
        React.createElement("span", { className: styles.toggleDesc }, "Show control bar when published for live demos (layout, chart type, etc.)")
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          className: styles.toggleInput,
          type: "checkbox",
          checked: state.enableDemoMode,
          onChange: function () { props.onChange({ enableDemoMode: !state.enableDemoMode }); },
          "aria-label": "Enable demo mode",
        }),
        React.createElement("span", { className: styles.toggleTrack },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    )
  );
};

export default FeaturesStep;
