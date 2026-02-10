import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IFaqWizardState } from "./faqWizardConfig";
import type { FaqSortMode } from "../../models/IHyperFaqEnums";
import { ALL_SORT_MODES, getSortModeDisplayName } from "../../models/IHyperFaqEnums";
import styles from "./WizardSteps.module.scss";

// ============================================================
// FeaturesStep — Feature toggles in 2 columns
// Column 1: Search & Discovery
// Column 2: Engagement
// ============================================================

/** Toggle definition for a boolean field */
interface IFeatureToggleDef {
  key: string;
  label: string;
  desc: string;
}

var SEARCH_FEATURES: IFeatureToggleDef[] = [
  { key: "enableSearch", label: "Search", desc: "Fuzzy weighted search across questions, answers, and tags" },
  { key: "enableSearchHighlight", label: "Search Highlight", desc: "Highlight matching terms in search results" },
  { key: "enableDeepLink", label: "Deep Linking", desc: "URL hash links to individual FAQ items (#faq=itemId)" },
];

var ENGAGEMENT_FEATURES: IFeatureToggleDef[] = [
  { key: "enableVoting", label: "Voting", desc: "Thumbs up/down to surface the best answers" },
  { key: "enableFeedbackOnDownvote", label: "Feedback on Downvote", desc: "Prompt users for feedback when they downvote" },
  { key: "enableRelated", label: "Related FAQs", desc: "Show up to 3 related items by category and tag overlap" },
  { key: "enableCopyLink", label: "Copy Link", desc: "Copy a direct link to an FAQ item to the clipboard" },
  { key: "enableContactExpert", label: "Contact Expert", desc: "Show a button to contact a subject-matter expert" },
  { key: "enableSubmission", label: "Ask Guru", desc: "Let users submit new questions to a review queue" },
  { key: "showViewCount", label: "View Count", desc: "Display how many times each FAQ has been viewed" },
  { key: "enableExpandAll", label: "Expand / Collapse All", desc: "Add buttons to expand or collapse all accordion items" },
  { key: "enablePinnedFaqs", label: "Pinned FAQs", desc: "Pin important items to the top of the list" },
];

var FeaturesStep: React.FC<IWizardStepProps<IFaqWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  // Toggle handler for boolean fields
  var handleToggle = React.useCallback(function (key: string): void {
    var partial: Partial<IFaqWizardState> = {};
    var currentValue = (state as unknown as Record<string, boolean>)[key];
    (partial as unknown as Record<string, boolean>)[key] = !currentValue;
    onChange(partial);
  }, [onChange, state]);

  // Sort mode handler
  var handleSortModeChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void {
    onChange({ sortMode: e.target.value as FaqSortMode });
  }, [onChange]);

  // Build a single toggle element
  var buildToggle = function (feat: IFeatureToggleDef): React.ReactElement {
    var isChecked = (state as unknown as Record<string, boolean>)[feat.key] === true;

    return React.createElement("label", { key: feat.key, className: styles.toggleRow },
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, feat.label),
        React.createElement("span", { className: styles.toggleDesc }, feat.desc)
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          type: "checkbox",
          className: styles.toggleInput,
          checked: isChecked,
          onChange: function (): void { handleToggle(feat.key); },
          "aria-label": feat.label,
        }),
        React.createElement("span", { className: styles.toggleTrack },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    );
  };

  // Build search feature toggles
  var searchToggles: React.ReactElement[] = [];
  SEARCH_FEATURES.forEach(function (feat) {
    searchToggles.push(buildToggle(feat));
  });

  // Build sort mode dropdown (goes with search column)
  var sortOptions: React.ReactElement[] = [];
  ALL_SORT_MODES.forEach(function (mode) {
    sortOptions.push(
      React.createElement("option", { key: mode, value: mode }, getSortModeDisplayName(mode))
    );
  });

  var sortDropdown = React.createElement("div", { key: "sortMode", className: styles.selectRow },
    React.createElement("label", { className: styles.selectLabel }, "Default Sort Mode"),
    React.createElement("select", {
      className: styles.select,
      value: state.sortMode,
      onChange: handleSortModeChange,
      "aria-label": "Default sort mode",
    }, sortOptions)
  );

  // Build engagement feature toggles
  var engagementToggles: React.ReactElement[] = [];
  ENGAGEMENT_FEATURES.forEach(function (feat) {
    engagementToggles.push(buildToggle(feat));
  });

  // Count enabled features
  var enabledCount = 0;
  var allFeatures: IFeatureToggleDef[] = [];
  SEARCH_FEATURES.forEach(function (f) { allFeatures.push(f); });
  ENGAGEMENT_FEATURES.forEach(function (f) { allFeatures.push(f); });
  allFeatures.forEach(function (f) {
    if ((state as unknown as Record<string, boolean>)[f.key] === true) {
      enabledCount += 1;
    }
  });

  return React.createElement("div", { className: styles.stepContainer },
    // Header
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Configure Features"),
      React.createElement("div", { className: styles.stepSectionHint },
        String(enabledCount) + " of " + String(allFeatures.length) + " features enabled. Toggle the features you want."
      )
    ),

    // Two-column layout
    React.createElement("div", { className: styles.featureColumns },
      // Column 1: Search & Discovery
      React.createElement("div", { className: styles.featureColumn },
        React.createElement("div", { className: styles.featureSectionTitle }, "Search & Discovery"),
        searchToggles,
        sortDropdown
      ),

      // Column 2: Engagement
      React.createElement("div", { className: styles.featureColumn },
        React.createElement("div", { className: styles.featureSectionTitle }, "Engagement"),
        engagementToggles
      )
    )
  );
};

export default FeaturesStep;
