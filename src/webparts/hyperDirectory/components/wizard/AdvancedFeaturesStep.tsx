import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IDirectoryWizardState } from "../../models/IHyperDirectoryWizardState";
import { countNewFeatures } from "../../models/IHyperDirectoryWizardState";
import styles from "./WizardSteps.module.scss";

var AdvancedFeaturesStep: React.FC<IWizardStepProps<IDirectoryWizardState>> = function (props) {
  var state = props.state.advancedFeatures;
  var profileState = props.state.profilePresence;

  function toggleField(key: string): void {
    var updated = Object.assign({}, state);
    (updated as unknown as Record<string, boolean | number>)[key] = !(state as unknown as Record<string, boolean>)[key];
    props.onChange({ advancedFeatures: updated as typeof state });
  }

  function setCacheDuration(val: number): void {
    props.onChange({ advancedFeatures: Object.assign({}, state, { cacheDuration: val }) });
  }

  var featureCount = countNewFeatures(profileState, state);

  return React.createElement("div", { className: styles.stepContainer },
    // ── Skills Search ──
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Directory Intelligence"),
      React.createElement("div", {
        className: state.enableSkillsSearch ? styles.featureCardActive : styles.featureCard,
        role: "switch",
        "aria-checked": String(state.enableSkillsSearch),
        tabIndex: 0,
        onClick: function () { toggleField("enableSkillsSearch"); },
        onKeyDown: function (e: React.KeyboardEvent) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleField("enableSkillsSearch");
          }
        },
      },
        React.createElement("span", { className: styles.featureCardEmoji, "aria-hidden": "true" }, "\uD83C\uDF93"),
        React.createElement("span", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel },
            "Skills & Expertise Search",
            React.createElement("span", { className: styles.badgeNew }, "NEW"),
            React.createElement("span", { className: styles.badgeStar }, "\u2B50 KILLER")
          ),
          React.createElement("span", { className: styles.toggleDesc },
            "Search people by skills and expertise. Reads from Entra ID skills profile or custom SP list."
          )
        )
      ),
      state.enableSkillsSearch
        ? React.createElement("div", { className: styles.hintBox },
            "Skill tags appear on profile cards. Users can be found by searching for skills like \"React\", \"Project Management\", or \"Spanish\". " +
            "No competitor SPFx directory offers skill-based search."
          )
        : undefined
    ),

    // ── Sample Data ──
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Sample Data"),
      React.createElement("label", { className: styles.toggleRow },
        React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, "\uD83D\uDC65"),
        React.createElement("span", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, "Seed with Sample Data"),
          React.createElement("span", { className: styles.toggleDesc }, "Show realistic sample people so you can preview layouts and features before connecting real data")
        ),
        React.createElement("span", { className: styles.toggleSwitch },
          React.createElement("input", {
            type: "checkbox",
            className: styles.toggleInput,
            checked: state.useSampleData,
            onChange: function () { toggleField("useSampleData"); },
            "aria-label": "Seed with sample data",
          }),
          React.createElement("span", { className: styles.toggleTrack },
            React.createElement("span", { className: styles.toggleThumb })
          )
        )
      ),
      state.useSampleData
        ? React.createElement("div", { className: styles.hintBox },
            "12 realistic sample employees will populate the directory so you can see how layouts, cards, presence, and features look with real data. " +
            "Turn this off once you connect to your Microsoft 365 tenant."
          )
        : undefined
    ),

    // ── Performance / Caching ──
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Performance"),
      React.createElement("label", { className: styles.toggleRow },
        React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, "\u26A1"),
        React.createElement("span", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, "Data Caching"),
          React.createElement("span", { className: styles.toggleDesc }, "Cache directory data to reduce API calls and speed up repeat views")
        ),
        React.createElement("span", { className: styles.toggleSwitch },
          React.createElement("input", {
            type: "checkbox",
            className: styles.toggleInput,
            checked: state.cacheEnabled,
            onChange: function () { toggleField("cacheEnabled"); },
            "aria-label": "Enable data caching",
          }),
          React.createElement("span", { className: styles.toggleTrack },
            React.createElement("span", { className: styles.toggleThumb })
          )
        )
      ),
      state.cacheEnabled
        ? React.createElement("div", { className: styles.sliderRow },
            React.createElement("span", { className: styles.sliderLabel }, "Cache Duration"),
            React.createElement("input", {
              type: "range",
              className: styles.sliderInput,
              min: 1,
              max: 60,
              step: 1,
              value: state.cacheDuration,
              "aria-label": "Cache duration in minutes",
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                setCacheDuration(parseInt(e.target.value, 10));
              },
            }),
            React.createElement("span", { className: styles.sliderValue }, state.cacheDuration + "m")
          )
        : undefined
    ),

    // ── Summary ──
    featureCount > 0
      ? React.createElement("div", { className: styles.hintBox },
          "\uD83D\uDE80 " + featureCount + " Hyper feature" +
          (featureCount === 1 ? "" : "s") +
          " enabled across all steps. These features put HyperDirectory ahead of every competitor."
        )
      : undefined
  );
};

export default AdvancedFeaturesStep;
